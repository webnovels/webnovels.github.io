/**
 * Supabase 客户端封装
 *
 * 配置说明：
 *   url:      Project URL (Settings → API Keys 页面顶部)
 *   anonKey:  Publishable key (Settings → API Keys → Publishable key，以 sb_publishable_ 开头)
 *
 *   Publishable key 可以安全地暴露在前端（配合 RLS 策略，仅允许 SELECT）。
 *   Secret key（service_role）只用于本地迁移脚本，切勿提交到仓库。
 */
window.WEB_NOVELS_SUPABASE_CONFIG = {
  url: "https://jvciadamlhkpeqgnqvvt.supabase.co",
  anonKey: "sb_publishable_1NDBCdl6n6wNKzi6p2aQxA_loOhDqnB",
};

(function () {
  // 动态加载 Supabase JS 客户端 (UMD 版本，直接挂到 window.supabase)
  function loadSupabase() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && window.supabase.createClient) {
        resolve(window.supabase);
        return;
      }
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
      s.onload = function () {
        if (window.supabase && window.supabase.createClient) {
          resolve(window.supabase);
        } else {
          reject(new Error("Supabase lib loaded but createClient not found"));
        }
      };
      s.onerror = function () {
        reject(new Error("Failed to load @supabase/supabase-js"));
      };
      document.head.appendChild(s);
    });
  }

  var initPromise = null;

  function getClient() {
    if (initPromise) return initPromise;
    initPromise = loadSupabase().then(function (sb) {
      var cfg = window.WEB_NOVELS_SUPABASE_CONFIG;
      if (!cfg.url || cfg.url.indexOf("YOUR-PROJECT-REF") !== -1) {
        // 未配置时返回 null，调用方应回退到 search.json
        console.warn("[supabase] SUPABASE_URL not configured, falling back to static data.");
        return null;
      }
      return sb.createClient(cfg.url, cfg.anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    });
    return initPromise;
  }

  // 业务查询 API
  window.NovelDB = {
    ready: getClient(),

    /**
     * 搜索小说：按 title / genre / description 模糊匹配
     * @param {string} query
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    search: function (query, limit) {
      limit = limit || 50;
      return getClient().then(function (client) {
        if (!client) return [];
        var q = (query || "").trim().toLowerCase();
        if (!q) return [];
        return client
          .from("novels")
          .select("id,slug,title,genre,genres,description,views,rating,cover_image,featured")
          .or(
            "title.ilike.%" + q + "%,genre.ilike.%" + q + "%,description.ilike.%" + q + "%"
          )
          .order("views", { ascending: false })
          .limit(limit)
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] search error:", res.error);
              return [];
            }
            return res.data.map(mapNovel);
          });
      });
    },

    /**
     * 获取排行榜
     * @param {string} type - 'popular' | 'rating' | 'completed'
     * @param {number} limit
     */
    rankings: function (type, limit) {
      limit = limit || 100;
      return getClient().then(function (client) {
        if (!client) return [];
        var q = client.from("novels").select(
          "id,slug,title,genre,description,views,rating,cover_image,status,completed"
        );
        if (type === "rating") {
          q = q.order("rating", { ascending: false });
        } else if (type === "completed") {
          q = q.eq("completed", true).order("rating", { ascending: false });
        } else {
          q = q.order("views", { ascending: false });
        }
        return q.limit(limit).then(function (res) {
          if (res.error) {
            console.error("[supabase] rankings error:", res.error);
            return [];
          }
          return res.data.map(mapNovel);
        });
      });
    },

    /**
     * 按分类获取小说（在 genres 数组中查找）
     * @param {string} genre
     * @param {number} limit
     * @param {string} sort - 'views' | 'rating' | 'last_updated'
     */
    byGenre: function (genre, limit, sort) {
      limit = limit || 100;
      sort = sort || "views";
      return getClient().then(function (client) {
        if (!client) return [];
        return client
          .from("novels")
          .select(
            "id,slug,title,author,genre,genres,subgenres,description,excerpt,views,rating,cover_image,status,completed,chapter_count,last_updated"
          )
          .contains("genres", [genre])
          .order(sort, { ascending: false })
          .limit(limit)
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] byGenre error:", res.error);
              return [];
            }
            return res.data.map(mapNovel);
          });
      });
    },

    /**
     * 获取精选/热门/最新小说
     * @param {Object} opts - { featured, limit, sort }
     */
    list: function (opts) {
      opts = opts || {};
      var limit = opts.limit || 20;
      var sort = opts.sort || "last_updated";
      return getClient().then(function (client) {
        if (!client) return [];
        var q = client
          .from("novels")
          .select(
            "id,slug,title,author,genre,genres,description,excerpt,views,rating,cover_image,featured,status,last_updated"
          );
        if (opts.featured) {
          q = q.eq("featured", true);
        }
        return q
          .order(sort, { ascending: false })
          .limit(limit)
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] list error:", res.error);
              return [];
            }
            return res.data.map(mapNovel);
          });
      });
    },

    /**
     * 随机推荐小说（用于 "You May Also Like"）
     * @param {number} limit
     * @param {number} excludeId - 排除当前小说
     */
    recommend: function (limit, excludeId) {
      limit = limit || 6;
      return getClient().then(function (client) {
        if (!client) return [];
        // Supabase 没有内置随机，先取一批再用 JS 随机
        return client
          .from("novels")
          .select("id,slug,title,genre,cover_image,views,rating")
          .gt("id", 0)
          .limit(200)
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] recommend error:", res.error);
              return [];
            }
            var pool = res.data;
            if (excludeId) {
              pool = pool.filter(function (n) {
                return String(n.id) !== String(excludeId);
              });
            }
            // Fisher-Yates 洗牌
            for (var i = pool.length - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              var tmp = pool[i];
              pool[i] = pool[j];
              pool[j] = tmp;
            }
            return pool.slice(0, limit).map(mapNovel);
          });
      });
    },

    /**
     * 根据 URL 列表批量获取小说元数据（书架用）
     * @param {Array<string>} urls
     */
    byUrls: function (urls) {
      if (!urls || urls.length === 0) return Promise.resolve([]);
      return getClient().then(function (client) {
        if (!client) return [];
        // 从 URL 中提取 id，例如 /novels/123/ -> 123
        var ids = urls
          .map(function (u) {
            var m = u.match(/\/novels\/(\d+)/);
            return m ? parseInt(m[1], 10) : null;
          })
          .filter(function (x) {
            return x !== null;
          });
        if (ids.length === 0) return [];
        return client
          .from("novels")
          .select("id,slug,title,genre,description,views,rating,cover_image")
          .in("id", ids)
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] byUrls error:", res.error);
              return [];
            }
            // 保持原 URL 顺序
            var map = {};
            res.data.forEach(function (n) {
              map["/novels/" + n.id + "/"] = mapNovel(n);
            });
            return urls.map(function (u) {
              var normalized = u.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") + "/";
              return map[normalized] || map[u] || null;
            });
          });
      });
    },

    // ----------------------------------------------------------
    // 章节相关 API
    // ----------------------------------------------------------

    /**
     * 获取小说的章节列表（不含正文，用于目录页）
     * @param {number|string} novelId
     * @returns {Promise<Array<{chapter_number, title}>>}
     */
    chapterList: function (novelId) {
      var id = typeof novelId === "string" ? parseInt(novelId, 10) : novelId;
      return getClient().then(function (client) {
        if (!client || !id) return [];
        return client
          .from("chapters")
          .select("chapter_number,title")
          .eq("novel_id", id)
          .order("chapter_number", { ascending: true })
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] chapterList error:", res.error);
              return [];
            }
            return res.data || [];
          });
      });
    },

    /**
     * 获取单个章节（含正文）
     * @param {number|string} novelId
     * @param {number} chapterNumber
     * @returns {Promise<{novel_id, chapter_number, title, content}|null>}
     */
    getChapter: function (novelId, chapterNumber) {
      var id = typeof novelId === "string" ? parseInt(novelId, 10) : novelId;
      return getClient().then(function (client) {
        if (!client || !id) return null;
        return client
          .from("chapters")
          .select("novel_id,chapter_number,title,content")
          .eq("novel_id", id)
          .eq("chapter_number", chapterNumber)
          .single()
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] getChapter error:", res.error);
              return null;
            }
            return res.data;
          });
      });
    },

    /**
     * 获取上一章和下一章（用于章节导航）
     * @param {number|string} novelId
     * @param {number} chapterNumber
     * @returns {Promise<{prev: {chapter_number,title}|null, next: {chapter_number,title}|null}>}
     */
    getAdjacentChapters: function (novelId, chapterNumber) {
      var id = typeof novelId === "string" ? parseInt(novelId, 10) : novelId;
      return getClient().then(function (client) {
        if (!client || !id) return { prev: null, next: null };
        return client
          .from("chapters")
          .select("chapter_number,title")
          .eq("novel_id", id)
          .in("chapter_number", [chapterNumber - 1, chapterNumber + 1])
          .then(function (res) {
            if (res.error) {
              console.error("[supabase] getAdjacentChapters error:", res.error);
              return { prev: null, next: null };
            }
            var prev = null;
            var next = null;
            (res.data || []).forEach(function (c) {
              if (c.chapter_number === chapterNumber - 1) prev = c;
              if (c.chapter_number === chapterNumber + 1) next = c;
            });
            return { prev: prev, next: next };
          });
      });
    },
  };

  // 将 Supabase 行映射为前端使用的对象（兼容 search.json 字段）
  function mapNovel(row) {
    return {
      id: row.id,
      title: row.title || "",
      url: "/novels/" + row.id + "/",
      slug: row.slug || String(row.id),
      genre: row.genre || "Fiction",
      genres: row.genres || [row.genre],
      subgenres: row.subgenres || [],
      description: row.description || "",
      excerpt: row.excerpt || row.description || "",
      views: row.views || 0,
      rating: row.rating || 4.0,
      cover_image: row.cover_image || "",
      featured: !!row.featured,
      status: row.status || "Ongoing",
      completed: !!row.completed,
      chapter_count: row.chapter_count || 0,
      author: row.author || "Anonymous",
      last_updated: row.last_updated || null,
    };
  }
})();
