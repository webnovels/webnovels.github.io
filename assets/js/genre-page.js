/**
 * 分类页脚本：从 Supabase 加载该分类下的小说
 * 在 _genre/*.md 中通过 <script src="/assets/js/genre-page.js" data-genre="Realistic"></script> 引入
 */
(function () {
  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var genre = thisScript.getAttribute('data-genre') || '';
  if (!genre) return;

  var popularContainer = document.getElementById('genre-popular');
  var allContainer = document.getElementById('genre-all');
  var sortDropdown = document.getElementById('sort-options');

  // 注入 loading-state 样式
  (function () {
    if (document.getElementById('genre-loading-style')) return;
    var s = document.createElement('style');
    s.id = 'genre-loading-style';
    s.textContent = '.loading-state{text-align:center;padding:40px;color:#888;grid-column:1/-1;}';
    document.head.appendChild(s);
  })();

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 分类关键词规则（与 _genre/*.md 中的筛选逻辑一致）
  var GENRE_KEYWORDS = {
    Romance: { desc: ['romance','love','husband','wife','marriage'], title: ['love'] },
    Betrayal: { desc: ['betray','revenge','cheat','affair','deceit'], title: ['betray','revenge'] },
    Rebirth: { desc: ['rebirth','reborn','second chance','reincarnat','previous life','past life','rewritten'], title: ['rebirth','reborn'] },
    Billionaire: { desc: ['billionaire','ceo','tycoon','wealth','rich','empire','fortune'], title: ['billionaire','ceo','rich'] },
    Realistic: { desc: [], title: [] } // 全部匹配
  };

  function matchesGenre(n, g) {
    var rule = GENRE_KEYWORDS[g];
    if (!rule) return false;
    if (g === 'Realistic') return true;
    if (Array.isArray(n.genres) && n.genres.indexOf(g) !== -1) return true;
    var t = (n.title || '').toLowerCase();
    var d = (n.description || '').toLowerCase();
    return rule.desc.some(function(k){ return d.indexOf(k) !== -1; }) ||
           rule.title.some(function(k){ return t.indexOf(k) !== -1; });
  }

  function cardHtml(n) {
    var cover = n.cover_image
      ? '<img src="' + n.cover_image + '" alt="' + escapeHtml(n.title) + '" loading="lazy">'
      : '<div class="cover-placeholder">' + escapeHtml(n.title.charAt(0)) + '</div>';
    var statusClass = n.completed ? 'completed' : 'ongoing';
    var statusText = n.completed ? 'Completed' : 'Ongoing';
    var desc = n.description ? escapeHtml(n.description.substring(0, 80)) : '';
    return '<div class="novel-card">' +
      '<div class="novel-cover">' + cover +
        '<span class="status-tag ' + statusClass + '">' + statusText + '</span>' +
      '</div>' +
      '<div class="novel-info">' +
        '<h3><a href="' + n.url + '">' + escapeHtml(n.title) + '</a></h3>' +
        '<div class="novel-meta">' +
          '<span class="author">By ' + escapeHtml(n.author || 'Anonymous') + '</span>' +
          '<span class="rating"><i class="fa fa-star"></i> ' + (n.rating || '4.3') + '</span>' +
        '</div>' +
        '<p class="novel-excerpt">' + desc + '</p>' +
        '<div class="novel-stats">' +
          '<span><i class="fa fa-book"></i> ' + (n.chapter_count || '12') + ' Chapters</span>' +
          '<span><i class="fa fa-eye"></i> ' + (n.views || '840') + '</span>' +
        '</div>' +
        '<a href="' + n.url + '" class="read-btn">Read Now</a>' +
      '</div>' +
    '</div>';
  }

  function render(popularNovels, allNovels) {
    if (popularContainer) {
      popularContainer.innerHTML = popularNovels.map(cardHtml).join('');
    }
    if (allContainer) {
      allContainer.innerHTML = allNovels.map(cardHtml).join('');
    }
  }

  function loadGenre(sort) {
    sort = sort || 'views';
    if (popularContainer) popularContainer.innerHTML = '<div class="loading-state">Loading...</div>';
    if (allContainer) allContainer.innerHTML = '<div class="loading-state">Loading...</div>';

    // 优先 Supabase，回退 search.json
    NovelDB.ready.then(function (client) {
      if (client) {
        Promise.all([
          NovelDB.byGenre(genre, 5, 'views'),
          NovelDB.byGenre(genre, 200, sort)
        ]).then(function (results) {
          render(results[0], results[1]);
        }).catch(function () {
          fallbackStatic(sort);
        });
      } else {
        fallbackStatic(sort);
      }
    }).catch(function () {
      fallbackStatic(sort);
    });
  }

  function fallbackStatic(sort) {
    fetch('/search.json')
      .then(function (r) { return r.json(); })
      .then(function (novels) {
        var filtered = novels.filter(function (n) { return matchesGenre(n, genre); });
        filtered.sort(function (a, b) {
          if (sort === 'rating') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
          if (sort === 'recent') return new Date(b.last_updated || 0) - new Date(a.last_updated || 0);
          if (sort === 'chapters') return (parseInt(b.chapter_count) || 0) - (parseInt(a.chapter_count) || 0);
          return (parseInt(b.views) || 0) - (parseInt(a.views) || 0);
        });
        render(filtered.slice(0, 5), filtered.slice(0, 200));
      })
      .catch(function () {
        if (popularContainer) popularContainer.innerHTML = '<div class="loading-state">Failed to load.</div>';
        if (allContainer) allContainer.innerHTML = '<div class="loading-state">Failed to load.</div>';
      });
  }

  if (sortDropdown) {
    sortDropdown.addEventListener('change', function () {
      loadGenre(this.value);
    });
  }

  loadGenre('views');
})();
