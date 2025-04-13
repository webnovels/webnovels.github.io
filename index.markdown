---
layout: default
title: WebNovels
description: Discover captivating original novels, web serials, and fiction stories. Read fantasy, sci-fi, romance, and more engaging webnovels updated regularly.
---

<header class="hero-section">
  <div class="container">
    <h1 class="main-title">WebNovels</h1>
    <p class="tagline">Discover Your Next Reading Adventure</p>
    <!-- <div class="search-box">
      <input type="text" id="novel-search" placeholder="Search for novels, genres, or authors...">
      <button type="button" aria-label="Search"><i class="fa fa-search"></i></button>
    </div> -->
  </div>
</header>

<main class="content-wrapper">
  <!-- Featured Novels Section -->
  <section class="featured-novels">
    <div class="container">
      <h2>Featured Webnovels</h2>
      <div class="novel-carousel">
        {% assign featured_novels = site.novels | where: "featured", true | limit: 5 %}
        {% for novel in featured_novels %}
          <div class="novel-card featured">
            <div class="novel-cover">
              {% if novel.cover_image %}
                <img src="{{ novel.cover_image | relative_url }}" alt="{{ novel.title }} - Web Novel Cover">
              {% else %}
                <div class="cover-placeholder">{{ novel.title | slice: 0, 1 }}</div>
              {% endif %}
            </div>
            <div class="novel-info">
              <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
              <div class="novel-meta">
                <span class="genre">{{ novel.genres | first }}</span>
                <span class="rating"><i class="fa fa-star"></i> {{ novel.rating | default: "4.5" }}</span>
              </div>
              <p class="novel-excerpt">{{ novel.excerpt | strip_html | truncate: 90 }}</p>
              <a href="{{ novel.url | relative_url }}" class="read-btn">Read Now</a>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>

  <!-- Browse by Genre -->
  <section class="genre-section">
    <div class="container">
      <h2>Popular Genres</h2>
      <div class="genre-list">
        <a href="{{ '/genre/realistic/' | relative_url }}" class="genre-tag">Realistic</a>
      </div>
    </div>
  </section>

  <!-- Latest Updates -->
  <section class="latest-updates">
    <div class="container">
      <h2>Latest Novel Updates</h2>
      <div class="novel-grid">
        {% assign novel_indexes = "" | split: ',' %}
        {% for item in site.novels %}
          {% assign url_parts = item.url | split: '/' %}
          {% if url_parts.size == 3 %}
            {% assign novel_indexes = novel_indexes | push: item %}
          {% endif %}
        {% endfor %}
        
        {% assign sorted_novels = novel_indexes | sort: 'last_updated' | reverse | limit: 6 %}
        {% for novel in sorted_novels %}
          <div class="novel-card">
            <div class="novel-cover">
              {% if novel.cover_image %}
                <img src="{{ novel.cover_image | relative_url }}" alt="{{ novel.title }} - Web Novel Cover">
              {% else %}
                <div class="cover-placeholder">{{ novel.title | slice: 0, 1 }}</div>
              {% endif %}
            </div>
            <div class="novel-info">
              <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
              <div class="novel-meta">
                <span class="author">By {{ novel.author }}</span>
                <span class="chapters">{{ novel.chapter_count | default: '10' }} Chapters</span>
              </div>
              <div class="tags">
                {% for genre in novel.genres limit: 2 %}
                  <span class="tag">{{ genre }}</span>
                {% endfor %}
              </div>
              <p class="novel-excerpt">{{ novel.excerpt | strip_html | truncate: 80 }}</p>
              <a href="{{ novel.url | relative_url }}" class="read-btn">Read Now</a>
            </div>
          </div>
        {% endfor %}
      </div>
      <!-- <div class="view-more">
        <a href="{{ '/novels' | relative_url }}" class="view-all-btn">View All Novels</a>
      </div> -->
    </div>
  </section>

  <!-- Trending Section -->
  <section class="trending-section">
    <div class="container">
      <h2>Trending This Week</h2>
      <div class="novel-list">
      
        {% assign trending_novels = novel_indexes | sort: 'views' | reverse | limit: 5 %}
        {% for novel in trending_novels %}
          <div class="novel-list-item">
            <div class="rank">{{ forloop.index }}</div>
            <div class="novel-info">
              <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
              <div class="novel-meta">
                <span class="genre">{{ novel.genres | first }}</span>
                <span class="views"><i class="fa fa-eye"></i> {{ novel.views | default: forloop.index -1  }}</span>
              </div>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>

  <!-- About This Site -->
  <section class="about-section">
    <div class="container">
      <h2>About WebNovels</h2>
      <div class="about-content">
        <p>Welcome to WebNovels, a platform dedicated to sharing original webnovels and stories. Our collection features high-quality fiction across various genres, from epic fantasy and science fiction to heartwarming romance and thrilling mysteries.</p>
        <p>All novels are available to read . New chapters are published regularly, providing readers with fresh content to enjoy. Join our community of novel enthusiasts and discover your next favorite story!</p>
        <!-- <a href="{{ '/about' | relative_url }}" class="about-link">Learn More About Us</a> -->
      </div>
    </div>
  </section>
</main>

<style>
  /* Base Styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f9f9f9;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* Typography */
  h1, h2, h3, h4 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  h3 {
    font-size: 1.2rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: #3498db;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  a:hover {
    color: #2980b9;
  }
  
  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #3498db, #8e44ad);
    color: white;
    padding: 60px 0;
    text-align: center;
    margin-bottom: 30px;
    border-radius: 0 0 10px 10px;
  }
  
  .main-title {
    font-size: 3rem;
    margin-bottom: 10px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .tagline {
    font-size: 1.5rem;
    margin-bottom: 30px;
    font-weight: 300;
  }
  
  .search-box {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    position: relative;
  }
  
  .search-box input {
    width: 100%;
    padding: 15px 20px;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .search-box button {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 40px;
    height: 40px;
    border: none;
    background: #3498db;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .search-box button:hover {
    background: #2980b9;
  }
  
  /* Section Styles */
  section {
    margin-bottom: 50px;
    padding: 30px 0;
  }
  
  section:nth-child(even) {
    background-color: #f0f0f0;
  }
  
  /* Novel Cards */
  .novel-carousel {
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding: 10px 0;
    scrollbar-width: thin;
  }
  
  .novel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }
  
  .novel-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    flex: 0 0 300px;
  }
  
  .novel-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  .novel-card.featured {
    border-top: 4px solid #e74c3c;
  }
  
  .novel-cover {
    height: 180px;
    overflow: hidden;
    position: relative;
  }
  
  .novel-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3498db;
    color: white;
    font-size: 3rem;
    font-weight: bold;
  }
  
  .novel-info {
    padding: 15px;
  }
  
  .novel-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.85rem;
    color: #7f8c8d;
  }
  
  .novel-excerpt {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 15px;
    height: 60px;
    overflow: hidden;
  }
  
  .read-btn {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: background-color 0.3s;
  }
  
  .read-btn:hover {
    background-color: #2980b9;
    color: white;
  }
  
  /* Genre Tags */
  .genre-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .genre-tag {
    background-color: #ecf0f1;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #34495e;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .genre-tag:hover {
    background-color: #3498db;
    color: white;
  }
  
  .all-genres {
    margin-left: auto;
    color: #3498db;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
  }
  
  /* Trending List */
  .novel-list-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ecf0f1;
    background-color: white;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .rank {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3498db;
    width: 40px;
    text-align: center;
  }
  
  /* View More Button */
  .view-more {
    text-align: center;
    margin-top: 30px;
  }
  
  .view-all-btn {
    background-color: #2c3e50;
    color: white;
    padding: 10px 25px;
    border-radius: 5px;
    font-weight: 500;
    transition: background-color 0.3s;
  }
  
  .view-all-btn:hover {
    background-color: #1a252f;
  }
  
  /* About Section */
  .about-section {
    background-color: #2c3e50;
    color: white;
    padding: 50px 0;
    border-radius: 10px;
  }
  
  .about-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .about-section h2 {
    color: white;
  }
  
  .about-link {
    display: inline-block;
    background-color: white;
    color: #2c3e50;
    padding: 10px 20px;
    border-radius: 5px;
    margin-top: 20px;
    font-weight: 500;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .about-link:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  /* Tags */
  .tags {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
  }
  
  .tag {
    background-color: #f0f0f0;
    color: #555;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 0.8rem;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .main-title {
      font-size: 2.2rem;
    }
    
    .tagline {
      font-size: 1.2rem;
    }
    
    .hero-section {
      padding: 40px 0;
    }
    
    .novel-grid {
      grid-template-columns: 1fr;
    }
    
    .novel-carousel {
      padding-bottom: 15px;
    }
    
    .novel-card {
      flex: 0 0 90%;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    .genre-list {
      overflow-x: auto;
      padding-bottom: 10px;
    }
  }
  
  @media (max-width: 480px) {
    .main-title {
      font-size: 1.8rem;
    }
    
    .tagline {
      font-size: 1rem;
    }
    
    .search-box input {
      padding: 12px 15px;
    }
    
    section {
      padding: 20px 0;
      margin-bottom: 30px;
    }
    
    .novel-cover {
      height: 150px;
    }
  }
</style>

<!-- Add Font Awesome for icons -->
<script src="https://kit.fontawesome.com/4e5f136f21.js" crossorigin="anonymous"></script>

<!-- Simple JavaScript for search functionality -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('novel-search');
    if (searchInput) {
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          const query = this.value.trim();
          if (query) {
            window.location.href = '{{ "/search" | relative_url }}?q=' + encodeURIComponent(query);
          }
        }
      });
    }
  });
</script>