---
layout: default
title: "Billionaire Novels - Rich CEO & Tycoon Stories | WebNovels"
description: "Read 300+ billionaire novels online free. Discover stories of powerful CEOs, tycoons, and wealthy families. Power, wealth, and romance. Updated daily!"
permalink: /genre/billionaire/
---

<header class="genre-header">
  <div class="container">
    <nav class="breadcrumbs">
      <a href="{{ '/' | relative_url }}">Home</a> &gt;
      Genres &gt;
      <span>Billionaire</span>
    </nav>
    <h1 class="genre-title">Billionaire</h1>
    <div class="genre-description">
      <p>Power, wealth, and influence. Explore stories featuring billionaires, CEOs, and tycoons. From rags-to-riches to born-into-wealth family dramas.</p>
    </div>
  </div>
</header>

<main class="content-wrapper">
  <section class="popular-in-genre">
    <div class="container">
      <h2>Popular in Billionaire</h2>
      <div class="novel-carousel" id="genre-popular">
        <div class="loading-state">Loading novels...</div>
      </div>
    </div>
  </section>

  <section class="all-novels">
    <div class="container">
      <div class="section-header">
        <h2>All Billionaire Novels</h2>
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

      <div class="novel-grid" id="genre-all">
        <div class="loading-state">Loading novels...</div>
      </div>
    </div>
  </section>
</main>

<style>
  .genre-header { background: linear-gradient(135deg, #d4af37, #aa8c2c); color: white; padding: 50px 0 60px; margin-bottom: 30px; }
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
  .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #aa8c2c; color: white; font-size: 3rem; font-weight: bold; }
  .status-tag { position: absolute; top: 10px; right: 10px; padding: 5px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; color: white; }
  .status-tag.completed { background-color: #27ae60; }
  .status-tag.ongoing { background-color: #f39c12; }
  .novel-info { padding: 15px; }
  .novel-meta { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.85rem; color: #7f8c8d; }
  .novel-excerpt { font-size: 0.9rem; color: #555; margin-bottom: 15px; height: 60px; overflow: hidden; }
  .novel-stats { display: flex; flex-wrap: wrap; gap: 10px; font-size: 0.8rem; color: #7f8c8d; margin-bottom: 15px; }
  .read-btn { display: inline-block; background-color: #d4af37; color: white; padding: 8px 15px; border-radius: 4px; font-size: 0.9rem; transition: background-color 0.3s; }
  .read-btn:hover { background-color: #aa8c2c; color: white; }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
  .filter-sort { display: flex; align-items: center; gap: 15px; }
  .sort-dropdown { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background-color: white; font-size: 0.9rem; }
  .view-toggle { display: flex; gap: 5px; }
  .view-btn { width: 36px; height: 36px; border: 1px solid #ddd; background-color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.3s, color 0.3s; }
  .view-btn.active { background-color: #d4af37; color: white; border-color: #d4af37; }
  @media (max-width: 768px) {
    .genre-title { font-size: 2rem; }
    .genre-header { padding: 30px 0 40px; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 15px; }
    .novel-grid { grid-template-columns: 1fr; }
  }
</style>

<script src="/assets/js/supabase.js"></script>
<script src="/assets/js/genre-page.js" data-genre="Billionaire"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const viewButtons = document.querySelectorAll('.view-btn');
  const novelsContainer = document.getElementById('genre-all');
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
