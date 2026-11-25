#!/usr/bin/env node
// 从 Supabase 拉取小说/章节数据，生成 Jekyll 的 _novels 目录。
// 用法：SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/pull-from-supabase.mjs
// 生成的页面 URL 与原来完全一致：
//   /novels/<id>/         小说详情
//   /novels/<id>/<n>/     章节正文
//   /novels/<id>/more/    more 页（token/appname）
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("缺少环境变量：SUPABASE_URL 和 SUPABASE_ANON_KEY（或 SUPABASE_SERVICE_KEY）");
  process.exit(1);
}

const ROOT = process.cwd();
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT_DIR =
  outIdx !== -1 && args[outIdx + 1]
    ? resolve(ROOT, args[outIdx + 1])
    : resolve(ROOT, "_novels");
const PAGE = 500;

async function fetchAll(table, select, order) {
  const rows = [];
  let offset = 0;
  for (;;) {
    const url =
      `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}` +
      `?select=${encodeURIComponent(select)}` +
      `&order=${encodeURIComponent(order)}` +
      `&limit=${PAGE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      throw new Error(`${table} 请求失败 ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < PAGE) break;
    offset += PAGE;
  }
  return rows;
}

// 输出合法的 YAML 双引号字符串（JSON 字符串即合法的 YAML double-quoted scalar）
const q = (v) => JSON.stringify(v == null ? "" : String(v));
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

function writeNovel(n) {
  const id = String(n.id);
  const fm = [
    "---",
    "layout: novel",
    `title: ${q(n.title)}`,
    `author: ${q(n.author)}`,
    `featured: ${n.featured ? "true" : "false"}`,
    `views: ${num(n.views)}`,
    `cover_image: ${q(n.cover_image)}`,
    `genre: ${q(n.genre)}`,
    `genres: [${(Array.isArray(n.genres) ? n.genres : []).map(q).join(", ")}]`,
    `last_updated: ${q(n.last_updated)}`,
    `rating: ${num(n.rating, 4)}`,
    `rating_count: ${num(n.rating_count)}`,
    `status: ${q(n.status || (n.completed ? "Completed" : "Ongoing"))}`,
    `completed: ${n.completed ? "true" : "false"}`,
    `chapter_count: ${num(n.chapter_count)}`,
    `description: ${q(n.description)}`,
  ];
  if (n.created_at) fm.push(`date: ${n.created_at}`);
  fm.push("---", "");

  const body = (n.body || "").trim();
  const path = join(OUT_DIR, `${id}.md`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, fm.join("\n") + (body ? body + "\n" : ""), "utf8");
}

function writeChapter(novelId, ch, prev, next) {
  const fm = [
    "---",
    "layout: chapter",
    `title: ${q(ch.title || `Chapter ${ch.chapter_number}`)}`,
    `novel_index: "/novels/${novelId}/"`,
    `chapter_number: ${num(ch.chapter_number)}`,
  ];
  if (prev != null) fm.push(`previous_chapter: "/novels/${novelId}/${prev}/"`);
  if (next != null) fm.push(`next_chapter: "/novels/${novelId}/${next}/"`);
  fm.push("---", "");

  const body = (ch.content || "").trim();
  const path = join(OUT_DIR, String(novelId), `${ch.chapter_number}.md`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, fm.join("\n") + (body ? body + "\n" : ""), "utf8");
}

function writeMore(n) {
  const id = String(n.id);
  const fm = [
    "---",
    "layout: more",
    `title: ${q(n.title)}`,
    `novel_index: "/novels/${id}/"`,
    `previous_chapter: "/novels/${id}/"`,
    `token: ${q(n.token)}`,
    `appname: ${q(n.appname || "NovelMaster")}`,
    "---",
    "",
  ];
  const path = join(OUT_DIR, id, "more.md");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, fm.join("\n"), "utf8");
}

async function main() {
  console.log("拉取小说元数据…");
  let novels;
  try {
    novels = await fetchAll(
      "novels",
      "id,title,author,description,body,cover_image,genre,genres,featured,views,rating,rating_count,status,completed,chapter_count,appname,token,last_updated,created_at",
      "id.asc"
    );
  } catch (err) {
    if (!/body/.test(err.message)) throw err;
    console.warn("  未找到 body 列，回退使用 excerpt/description");
    novels = await fetchAll(
      "novels",
      "id,title,author,description,excerpt,cover_image,genre,genres,featured,views,rating,rating_count,status,completed,chapter_count,appname,token,last_updated,created_at",
      "id.asc"
    );
    for (const n of novels) n.body = n.excerpt || n.description || "";
  }
  console.log(`  ${novels.length} 本`);

  console.log("拉取章节正文…");
  const chapters = await fetchAll(
    "chapters",
    "novel_id,chapter_number,title,content",
    "novel_id.asc,chapter_number.asc"
  );
  console.log(`  ${chapters.length} 章`);

  // 按小说分组
  const byNovel = new Map();
  for (const ch of chapters) {
    const key = String(ch.novel_id);
    if (!byNovel.has(key)) byNovel.set(key, []);
    byNovel.get(key).push(ch);
  }

  console.log("清理旧的 _novels 目录…");
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  let novelCount = 0;
  let chapterCount = 0;
  let moreCount = 0;

  for (const n of novels) {
    const id = String(n.id);
    writeNovel(n);
    novelCount++;

    const list = (byNovel.get(id) || []).sort(
      (a, b) => Number(a.chapter_number) - Number(b.chapter_number)
    );
    list.forEach((ch, i) => {
      const prev = i > 0 ? list[i - 1].chapter_number : null;
      const next = i < list.length - 1 ? list[i + 1].chapter_number : null;
      writeChapter(id, ch, prev, next);
      chapterCount++;
    });

    if (n.token || n.appname) {
      writeMore(n);
      moreCount++;
    }
  }

  console.log(`完成：小说 ${novelCount}，章节 ${chapterCount}，more ${moreCount}`);
}

main().catch((err) => {
  console.error("生成失败：", err.message);
  process.exit(1);
});
