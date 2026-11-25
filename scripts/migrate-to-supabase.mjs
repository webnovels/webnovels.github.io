/**
 * 数据迁移脚本：解析 _novels/*.md 的 front matter，导出为 JSON 并可选推送到 Supabase
 *
 * 用法：
 *   # 1) 仅导出 JSON（用于检查）
 *   node scripts/migrate-to-supabase.mjs --export
 *
 *   # 2) 导出 JSON 并推送到 Supabase（需要 service_role key）
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   node scripts/migrate-to-supabase.mjs --push
 *
 * 注意：service_role key 拥有完全权限，切勿提交到公开仓库！
 *       建议使用环境变量或 .env 文件（已在 .gitignore 中）。
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, parse } from "node:path";

const NOVELS_DIR = join(process.cwd(), "_novels");
const OUTPUT_FILE = join(process.cwd(), "supabase", "novels-export.json");
const CHAPTERS_OUTPUT_FILE = join(process.cwd(), "supabase", "chapters-export.json");

// ------------------------------------------------------------
// 轻量级 YAML front matter 解析器
// 支持：字符串（带/不带引号）、数字、布尔、数组、日期
// ------------------------------------------------------------
function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  const data = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of yaml.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // 数组项: - value
    if (trimmed.startsWith("- ") && currentArray) {
      currentArray.push(parseScalar(trimmed.slice(2)));
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value === "") {
      // 可能是数组开始
      data[key] = [];
      currentKey = key;
      currentArray = data[key];
    } else {
      data[key] = parseScalar(value);
      currentKey = null;
      currentArray = null;
    }
  }
  return data;
}

function parseScalar(raw) {
  // 去引号并反转义 YAML 转义序列
  if (raw.startsWith('"') && raw.endsWith('"')) {
    return raw
      .slice(1, -1)
      .replace(/\\(["\\/bfnrt])/g, (_, c) =>
        ({ '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" }[c])
      );
  }
  if (raw.startsWith("'") && raw.endsWith("'")) {
    return raw.slice(1, -1).replace(/''/g, "'");
  }
  // 布尔
  if (raw === "true") return true;
  if (raw === "false") return false;
  // 数字
  if (/^-?\d+$/.test(raw)) return parseInt(raw, 10);
  if (/^-?\d+\.\d+$/.test(raw)) return parseFloat(raw);
  return raw;
}

// ------------------------------------------------------------
// 关键词分类规则（与 _genre/*.md 中的筛选逻辑保持一致）
// 一本小说可属于多个分类
// ------------------------------------------------------------
const GENRE_RULES = {
  Romance: {
    desc: ["romance", "love", "husband", "wife", "marriage"],
    title: ["love"],
    genreField: ["romance"],
  },
  Betrayal: {
    desc: ["betray", "revenge", "cheat", "affair", "deceit"],
    title: ["betray", "revenge"],
  },
  Rebirth: {
    desc: ["rebirth", "reborn", "second chance", "reincarnat", "previous life", "past life", "rewritten"],
    title: ["rebirth", "reborn"],
  },
  Billionaire: {
    desc: ["billionaire", "ceo", "tycoon", "wealth", "rich", "empire", "fortune"],
    title: ["billionaire", "ceo", "rich"],
  },
};

function classifyGenres(title, description, originalGenre) {
  const genres = [];
  const t = (title || "").toLowerCase();
  const d = (description || "").toLowerCase();

  for (const [name, rule] of Object.entries(GENRE_RULES)) {
    const descMatch = rule.desc.some((kw) => d.includes(kw));
    const titleMatch = rule.title.some((kw) => t.includes(kw));
    const genreMatch = rule.genreField
      ? rule.genreField.some((kw) => (originalGenre || "").toLowerCase().includes(kw))
      : false;
    if (descMatch || titleMatch || genreMatch) {
      genres.push(name);
    }
  }

  // 所有小说默认属于 Realistic（与原 realistic.md 的 item.genre == 'Realistic' 一致）
  if (!genres.includes("Realistic")) genres.unshift("Realistic");
  return genres;
}

// ------------------------------------------------------------
// 扫描小说
// ------------------------------------------------------------
function scanNovels() {
  const entries = readdirSync(NOVELS_DIR, { withFileTypes: true });
  const novels = [];

  for (const entry of entries) {
    // 顶层 .md 文件是小说索引页（排除目录）
    if (entry.isFile() && entry.name.endsWith(".md")) {
      const id = parseInt(entry.name.slice(0, -3), 10);
      if (isNaN(id)) continue;

      const filePath = join(NOVELS_DIR, entry.name);
      const content = readFileSync(filePath, "utf8");
      const fm = parseFrontMatter(content);
      const bodyMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
      const body = bodyMatch ? bodyMatch[1].trim() : "";

      // 统计章节数：_novels/<id>/ 目录下的 .md 文件
      let chapterCount = 0;
      const chapterDir = join(NOVELS_DIR, String(id));
      if (existsSync(chapterDir)) {
        const chapterFiles = readdirSync(chapterDir).filter(
          (f) => f.endsWith(".md") && f !== "more.md"
        );
        chapterCount = chapterFiles.length;
      }

      const genres = classifyGenres(fm.title, fm.description, fm.genre);

      // token / appname 存放在 _novels/<id>/more.md
      let moreFm = {};
      const morePath = join(NOVELS_DIR, String(id), "more.md");
      if (existsSync(morePath)) {
        moreFm = parseFrontMatter(readFileSync(morePath, "utf8"));
      }

      novels.push({
        id,
        slug: fm.slug || String(id),
        title: fm.title || "",
        author: fm.author || "",
        description: fm.description || "",
        excerpt: fm.excerpt || "",
        body,
        cover_image: fm.cover_image || "",
        genre: fm.genre || null,
        genres,
        subgenres: Array.isArray(fm.subgenres) ? fm.subgenres : [],
        featured: !!fm.featured,
        views: typeof fm.views === "number" ? fm.views : 0,
        rating: typeof fm.rating === "number" ? fm.rating : 4.0,
        rating_count: typeof fm.rating_count === "number" ? fm.rating_count : 0,
        status: fm.status || (fm.completed ? "Completed" : "Ongoing"),
        completed: !!fm.completed,
        chapter_count: chapterCount || (typeof fm.chapter_count === "number" ? fm.chapter_count : 0),
        appname: moreFm.appname || fm.appname || null,
        token: moreFm.token || fm.token || null,
        last_updated: fm.last_updated || null,
      });
    }
  }

  // 按 id 排序
  novels.sort((a, b) => a.id - b.id);
  return novels;
}

// ------------------------------------------------------------
// 扫描章节
// 解析 _novels/<id>/<num>.md，提取 chapter_number / title / content
// ------------------------------------------------------------
function scanChapters(novelId) {
  const chapterDir = join(NOVELS_DIR, String(novelId));
  if (!existsSync(chapterDir)) return [];

  const files = readdirSync(chapterDir).filter(
    (f) => f.endsWith(".md") && f !== "more.md"
  );

  const chapters = [];
  for (const file of files) {
    const num = parseInt(file.slice(0, -3), 10);
    if (isNaN(num)) continue;

    const filePath = join(chapterDir, file);
    const raw = readFileSync(filePath, "utf8");

    // 分离 front matter 和正文
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    const fm = fmMatch ? parseFrontMatter(fmMatch[1] + "---") : {};
    const body = fmMatch ? fmMatch[2].trim() : raw.trim();

    if (!body) continue;

    chapters.push({
      novel_id: novelId,
      chapter_number: num,
      title: fm.title || `Chapter ${num}`,
      content: body,
    });
  }

  // 按章节号排序
  chapters.sort((a, b) => a.chapter_number - b.chapter_number);
  return chapters;
}

// 扫描所有小说的所有章节
function scanAllChapters(novelIds) {
  const all = [];
  for (const id of novelIds) {
    all.push(...scanChapters(id));
  }
  return all;
}

// ------------------------------------------------------------
// 推送到 Supabase（批量 upsert）
// ------------------------------------------------------------
async function pushTable(url, serviceKey, table, rows, label) {
  console.log(`推送 ${label}: 共 ${rows.length} 条`);
  if (rows.length === 0) {
    console.log(`  跳过：无数据`);
    return;
  }

  const batchSize = 200; // 章节内容较大，减小批量
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`批量 ${i}-${i + batch.length} 失败 (HTTP ${res.status}):`, errText);
      process.exit(1);
    }
    console.log(`  已推送 ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
  }
  console.log(`${label} 推送完成！`);
}

async function pushToSupabase(novels, chapters) {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) {
    console.error("错误：需要设置 SUPABASE_URL 和 SUPABASE_SERVICE_KEY 环境变量");
    process.exit(1);
  }

  console.log(`推送到 Supabase: ${url}`);

  // 先推 novels（chapters 依赖 novels.id 外键）
  await pushTable(url, serviceKey, "novels", novels, "小说");
  // 再推 chapters
  await pushTable(url, serviceKey, "chapters", chapters, "章节");
}

// ------------------------------------------------------------
// 主流程
// ------------------------------------------------------------
function main() {
  const args = process.argv.slice(2);
  const doExport = args.includes("--export");
  const doPush = args.includes("--push");
  const skipChapters = args.includes("--no-chapters");

  if (!doExport && !doPush) {
    console.log("用法:");
    console.log("  node scripts/migrate-to-supabase.mjs --export   # 导出 JSON");
    console.log("  node scripts/migrate-to-supabase.mjs --push     # 推送到 Supabase");
    console.log("  --no-chapters   跳过章节解析（仅处理小说元数据）");
    process.exit(0);
  }

  console.log("扫描小说目录...");
  const novels = scanNovels();
  console.log(`找到 ${novels.length} 本小说`);

  if (novels.length === 0) {
    console.error("未找到任何小说，请确认在项目根目录运行");
    process.exit(1);
  }

  // 扫描章节
  let chapters = [];
  if (!skipChapters) {
    console.log("扫描章节内容...");
    chapters = scanAllChapters(novels.map((n) => n.id));
    console.log(`找到 ${chapters.length} 个章节`);
  }

  // 打印一些统计
  const genres = {};
  novels.forEach((n) => {
    if (n.genre) genres[n.genre] = (genres[n.genre] || 0) + 1;
  });
  console.log("\n分类分布:");
  Object.entries(genres)
    .sort((a, b) => b[1] - a[1])
    .forEach(([g, c]) => console.log(`  ${g}: ${c}`));

  if (doExport) {
    const dir = parse(OUTPUT_FILE).dir;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(OUTPUT_FILE, JSON.stringify(novels, null, 2));
    console.log(`\n小说已导出到: ${OUTPUT_FILE}`);

    if (!skipChapters) {
      writeFileSync(CHAPTERS_OUTPUT_FILE, JSON.stringify(chapters, null, 2));
      console.log(`章节已导出到: ${CHAPTERS_OUTPUT_FILE}`);
    }
  }

  if (doPush) {
    pushToSupabase(novels, chapters);
  }
}

main();
