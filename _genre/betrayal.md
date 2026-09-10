---
layout: default
title: "Betrayal Novels - Best Revenge & Betrayal Stories Online | WebNovels"
description: "Read 200+ betrayal novels online free. Discover stories of revenge, deception, and sweet vengeance. When trust breaks, revenge follows. Updated daily!"
permalink: /genre/betrayal/
---

<header class="genre-header">
  <div class="container">
    <nav class="breadcrumbs">
      <a href="{{ '/' | relative_url }}">Home</a> &gt;
      Genres &gt;
      <span>Betrayal</span>
    </nav>
    <h1 class="genre-title">Betrayal</h1>
    <div class="genre-description">
      <p>Trust shattered, loyalty tested. Explore gripping tales of betrayal, revenge, and sweet vengeance. When the people you trust the most turn against you.</p>
    </div>
  </div>
</header>

{% assign novel_indexes = "" | split: ',' %}
{% for item in site.novels %}
  {% assign url_parts = item.url | split: '/' %}
  {% if url_parts.size == 3 %}
    {% assign has_desc = item.description | default: '' | downcase %}
    {% assign has_title = item.title | downcase %}
    {% if has_desc contains 'betray' or has_desc contains 'revenge' or has_desc contains 'cheat' or has_desc contains 'affair' or has_desc contains 'deceit' or has_title contains 'betray' or has_title contains 'revenge' %}
      {% assign novel_indexes = novel_indexes | push: item %}
    {% endif %}
  {% endif %}
{% endfor %}

<main class="content-wrapper">
  <section class="popular-in-genre">
    <div class="container">
      <h2>Popular in Betrayal</h2>
      <div class="novel-carousel">
        {% assign genre_novels = novel_indexes | sort: "views" | reverse | limit: 5 %}
        {% for novel in genre_novels %}
          <div class="novel-card">
            <div class="novel-cover">
              {% if novel.cover_image %}
                {% include picture.html img=novel.cover_image alt= novel.title  %}
              {% else %}
                <div class="cover-placeholder">{{ novel.title | slice: 0, 1 }}</div>
              {% endif %}
              {% if novel.completed %}
                <span class="status-tag completed">Completed</span>
              {% else %}
                <span class="status-tag ongoing">Ongoing</span>
              {% endif %}
            </div>
            <div class="novel-info">
              <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
              <div class="novel-meta">
                <span class="author">By {{ novel.author | default: "Anonymous" }}</span>
                <span class="rating"><i class="fa fa-star"></i> {{ novel.rating | default: "4.3" }}</span>
              </div>
              <p class="novel-excerpt">{{ novel.description | default: novel.excerpt | strip_html | truncate: 90 }}</p>
              <div class="novel-stats">
                <span><i class="fa fa-book"></i> {{ novel.chapter_count | default: "15" }} Chapters</span>
                <span><i class="fa fa-eye"></i> {{ novel.views | default: "1250" }}</span>
              </div>
              <a href="{{ novel.url | relative_url }}" class="read-btn">Read Now</a>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>

  <section class="all-novels">
    <div class="container">
      <div class="section-header">
        <h2>All Betrayal Novels</h2>
        <div class="filter-sort">
          <select id="sort-options" class="sort-dropdown">
            <option value="popular">Sort by: Popularity</option>
            <option value="rating">Sort by: Rating</option>
            <option value="recent">Sort by: Recently Updated</option>
          </select>
          <div class="view-toggle">
            <button class="view-btn active" data-view="grid"><i class="fa fa-th-large"></i></button>
            <button class="view-btn" data-view="list"><i class="fa fa-list"></i></button>
          </div>
        </div>
      </div>

      <div class="novel-grid" id="novels-container">
        {% for novel in novel_indexes %}
          <div class="novel-card">
            <div class="novel-cover">
              {% if novel.cover_image %}
                {% include picture.html img=novel.cover_image alt= novel.title  %}
              {% else %}
                <div class="cover-placeholder">{{ novel.title | slice: 0, 1 }}</div>
              {% endif %}
              {% if novel.completed %}
                <span class="status-tag completed">Completed</span>
              {% else %}
                <span class="status-tag ongoing">Ongoing</span>
              {% endif %}
            </div>
            <div class="novel-info">
              <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
              <div class="novel-meta">
                <span class="author">By {{ novel.author | default: "Anonymous" }}</span>
                <span class="rating"><i class="fa fa-star"></i> {{ novel.rating | default: "4.2" }}</span>
              </div>
              <p class="novel-excerpt">{{ novel.description | default: novel.excerpt | strip_html | truncate: 80 }}</p>
              <div class="novel-stats">
                <span><i class="fa fa-book"></i> {{ novel.chapter_count | default: "12" }} Chapters</span>
                <span><i class="fa fa-eye"></i> {{ novel.views | default: "840" }}</span>
              </div>
              <a href="{{ novel.url | relative_url }}" class="read-btn">Read Now</a>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>
</main>

<style>
  .genre-header { background: linear-gradient(135deg, #8e44ad, #6c3483); color: white; padding: 50px 0 60px; margin-bottom: 30px; }
  .breadcrumbs { margin-bottom: 20px; font-size: 0.9rem; }
  .breadcrumbs a { color: rgba(255, 255, 255, 0.8); margin-right: 5px; }
  .breadcrumbs a:hover { color: white; }
  .breadcrumbs span { color: white; }
  .genre-title { font-size: 2.8rem; margin-bottom: 15px; }
  .genre-description { max-width: 800px; font-size: 1.1rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9); }
  section { margin-bottom: 50px; padding: 30px 0; }
  section:nth-child(even) { background-color: #f0f0f0; }
  .novel-carousel { display: flex; overflow-x: auto; gap: 20px; padding: 10px 0; scrollbar-width: thin; margin-bottom: 10px; }
  .novel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
  .novel-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s, box-shadow 0.3s; flex: 0 0 300px; position: relative; }
  .novel-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); }
  .novel-cover { height: 180px; overflow: hidden; position: relative; }
  .novel-cover img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #6c3483; color: white; font-size: 3rem; font-weight: bold; }
  .status-tag { position: absolute; top: 10px; right: 10px; padding: 5px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; color: white; }
  .status-tag.completed { background-color: #27ae60; }
  .status-tag.ongoing { background-color: #f39c12; }
  .novel-info { padding: 15px; }
  .novel-meta { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.85rem; color: #7f8c8d; }
  .novel-excerpt { font-size: 0.9rem; color: #555; margin-bottom: 15px; height: 60px; overflow: hidden; }
  .novel-stats { display: flex; flex-wrap: wrap; gap: 10px; font-size: 0.8rem; color: #7f8c8d; margin-bottom: 15px; }
  .read-btn { display: inline-block; background-color: #8e44ad; color: white; padding: 8px 15px; border-radius: 4px; font-size: 0.9rem; transition: background-color 0.3s; }
  .read-btn:hover { background-color: #6c3483; color: white; }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
  .filter-sort { display: flex; align-items: center; gap: 15px; }
  .sort-dropdown { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background-color: white; font-size: 0.9rem; }
  .view-toggle { display: flex; gap: 5px; }
  .view-btn { width: 36px; height: 36px; border: 1px solid #ddd; background-color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.3s, color 0.3s; }
  .view-btn.active { background-color: #8e44ad; color: white; border-color: #8e44ad; }
  @media (max-width: 768px) {
    .genre-title { font-size: 2rem; }
    .genre-header { padding: 30px 0 40px; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 15px; }
    .novel-grid { grid-template-columns: 1fr; }
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const novelsContainer = document.getElementById('novels-container');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const viewType = this.getAttribute('data-view');
      viewButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      if (viewType === 'list') {
        novelsContainer.classList.remove('novel-grid');
      } else {
        novelsContainer.classList.add('novel-grid');
      }
    });
  });
});
</script>
