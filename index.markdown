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
      <input type="text" id="novel-search" placeholder="Search novels...">
      <button type="button" aria-label="Search"><i class="fa fa-search"></i></button>
    </div> -->
  </div>
</header>

<main class="content-wrapper">
  <!-- Mobile Navigation -->
  <nav class="mobile-nav">
    <div class="container">
      <div class="nav-scroll">
        <a href="#featured" class="nav-item active">Featured</a>
        <a href="#genres" class="nav-item">Genres</a>
        <a href="#latest" class="nav-item">Latest</a>
        <a href="#trending" class="nav-item">Trending</a>
        <a href="#about" class="nav-item">About</a>
      </div>
    </div>
  </nav>

  <!-- Featured Novels Section -->
  <section id="featured" class="featured-novels">
  <div class="container">
    <h2>Featured Webnovels</h2>
    <div class="featured-stack">
      {% assign featured_novels = site.novels | where: "featured", true | limit: 5 %}
      {% for novel in featured_novels %}
        <div class="featured-stack-item">
          <div class="stack-cover">
            {% if novel.cover_image %}
              <img src="{{ novel.cover_image | relative_url }}" alt="{{ novel.title }}" loading="lazy">
            {% else %}
              <div class="cover-placeholder">{{ novel.title | slice: 0, 1 }}</div>
            {% endif %}
          </div>
          <div class="stack-content">
            <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
            <div class="stack-meta">
              <span class="genre">{{ novel.genres | first }}</span>
              <span class="rating"><i class="fa fa-star"></i> {{ novel.rating | default: "4.5" }}</span>
            </div>
            <p class="stack-excerpt">{{ novel.excerpt | strip_html | truncate: 100 }}</p>
            <a href="{{ novel.url | relative_url }}" class="read-btn">Read Now</a>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</section>

  <!-- Browse by Genre -->
  <section id="genres" class="genre-section">
    <div class="container">
      <h2>Popular Genres</h2>
      <div class="genre-list">
        <a href="{{ '/genre/realistic/' | relative_url }}" class="genre-tag">Realistic</a>
        
      </div>
    </div>
  </section>

  <!-- Latest Updates -->
  <section id="latest" class="latest-updates">
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
        
        {% assign sorted_novels = novel_indexes | sort: 'last_updated' | reverse | limit: 4 %}
        {% for novel in sorted_novels %}
          <div class="novel-card">
            <div class="novel-cover">
              {% if novel.cover_image %}
                <img src="{{ novel.cover_image | relative_url }}" alt="{{ novel.title }}" loading="lazy">
              {% else %}
                <div class="cover-placeholder">{{ novel.title | slice: 0, 1 }}</div>
              {% endif %}
              <div class="update-badge">
                <i class="fa fa-clock"></i> New
              </div>
            </div>
            <div class="novel-info">
              <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
              <div class="novel-meta">
                <span class="author"><i class="fa fa-user"></i> {{ novel.author }}</span>
                <!-- <span class="chapters"><i class="fa fa-book"></i> {{ novel.chapter_count | default: '10' }}</span> -->
              </div>
              <div class="tags">
                {% for genre in novel.genres limit: 2 %}
                  <span class="tag">{{ genre }}</span>
                {% endfor %}
              </div>
              <a href="{{ novel.url | relative_url }}" class="read-btn">Read Now</a>
            </div>
          </div>
        {% endfor %}
      </div>
     
    </div>
  </section>

  <!-- Trending Section -->
  <section id="trending" class="trending-section">
    <div class="container">
      <h2>Trending This Week</h2>
      <div class="trending-list">
        {% assign trending_novels = novel_indexes | sort: 'views' | reverse | limit: 5 %}
        {% for novel in trending_novels %}
          <div class="trending-item">
            <div class="trending-rank">{{ forloop.index }}</div>
            <div class="trending-cover">
              {% if novel.cover_image %}
                <img src="{{ novel.cover_image | relative_url }}" alt="{{ novel.title }}" loading="lazy">
              {% else %}
                <div class="cover-placeholder small">{{ novel.title | slice: 0, 1 }}</div>
              {% endif %}
            </div>
            <div class="trending-info">
              <h3><a href="{{ novel.url | relative_url }}">{{ novel.title }}</a></h3>
              <div class="trending-meta">
                <span class="trending-genre">{{ novel.genres | first | default: "Fiction" }}</span>
                <span class="trending-views"><i class="fa fa-eye"></i> {{ novel.views | default: 1000 | divided_by: 1000.0 | round: 1 }}k</span>
              </div>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>

  <!-- About This Site -->
  <section id="about" class="about-section">
    <div class="container">
      <h2>About WebNovels</h2>
      <div class="about-content">
        <p>Welcome to WebNovels, a platform dedicated to sharing original webnovels and stories. Our collection features high-quality fiction across various genres, from epic fantasy and science fiction to heartwarming romance and thrilling mysteries.</p>
        <p>All novels are available to read for free. New chapters are published regularly, providing readers with fresh content to enjoy. Join our community of novel enthusiasts and discover your next favorite story!</p>
        <div class="action-buttons">
          <a href="{{ '/about' | relative_url }}" class="about-link">Learn More</a>
          <a href="{{ '/about' | relative_url }}" class="contact-link">Contact Us</a>
        </div>
      </div>
    </div>
  </section>
</main>



<button id="back-to-top" aria-label="Back to top">
  <i class="fa fa-arrow-up"></i>
</button>

<style>
  
  
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
    position: relative;
    padding-bottom: 8px;
  }
  
  h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
  }
  
  h3 {
    font-size: 1.2rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: var(--transition);
  }
  
  a:hover {
    color: var(--primary-dark);
  }

  .featured-stack {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .featured-stack-item {
    display: flex;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
  }
  
  .stack-cover {
    width: 100px;
    min-width: 100px;
    height: 140px;
    overflow: hidden;
  }
  
  .stack-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .stack-content {
    padding: 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .stack-meta {
    display: flex;
    gap: 10px;
    margin: 5px 0 10px;
    font-size: 0.85rem;
    color: var(--text-light);
  }
  
  .stack-excerpt {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 10px;
    flex-grow: 1;
  }
  
  /* 响应式调整 */
  @media (max-width: 480px) {
    .featured-stack-item {
      flex-direction: column;
    }
    
    .stack-cover {
      width: 100%;
      height: 160px;
    }
    
    .stack-content {
      padding: 15px;
    }
  }
  
  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 50px 0 30px;
    text-align: center;
    margin-bottom: 15px;
    border-radius: 0 0 15px 15px;
    box-shadow: var(--shadow);
  }
  
  .main-title {
    font-size: 2.6rem;
    margin-bottom: 10px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    letter-spacing: -0.5px;
  }
  
  .tagline {
    font-size: 1.3rem;
    margin-bottom: 20px;
    font-weight: 300;
  }
  
  .search-box {
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    position: relative;
  }
  
  .search-box input {
    width: 100%;
    padding: 12px 20px;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .search-box button {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 36px;
    height: 36px;
    border: none;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .search-box button:hover {
    background: var(--primary-dark);
  }
  
  /* Mobile Navigation */
  .mobile-nav {
    background: white;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border-radius: var(--border-radius);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .nav-scroll {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    padding: 10px 5px;
  }
  
  .nav-scroll::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
  
  .nav-item {
    padding: 8px 16px;
    white-space: nowrap;
    color: var(--text-color);
    font-weight: 500;
    border-radius: 20px;
    transition: var(--transition);
  }
  
  .nav-item.active {
    background-color: var(--primary-color);
    color: white;
  }
  
  .nav-item:hover:not(.active) {
    background-color: #f0f0f0;
  }
  
  /* Section Styles */
  section {
    margin-bottom: 30px;
    padding: 20px 0;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }
  
  /* Novel Cards */
  .swipe-indicator {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text-light);
    font-size: 0.85rem;
    margin-bottom: 10px;
  }
  
  .novel-carousel {
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding: 10px 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }
  
  .novel-carousel::-webkit-scrollbar {
    display: none;
  }
  
  .novel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .novel-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
    flex: 0 0 280px;
    scroll-snap-align: start;
    position: relative;
  }
  
  .novel-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  .novel-card.featured {
    border-left: 4px solid #e74c3c;
  }
  
  .novel-cover {
    height: 160px;
    overflow: hidden;
    position: relative;
  }
  
  .novel-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .novel-card:hover .novel-cover img {
    transform: scale(1.05);
  }
  
  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-color);
    color: white;
    font-size: 3rem;
    font-weight: bold;
  }
  
  .cover-placeholder.small {
    font-size: 1.5rem;
  }
  
  .novel-quick-info, .update-badge {
    position: absolute;
    display: flex;
    gap: 5px;
  }
  
  .novel-quick-info {
    top: 10px;
    right: 10px;
  }
  
  .update-badge {
    bottom: 10px;
    right: 10px;
    background-color: #e74c3c;
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .genre-badge, .rating-badge {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
  }
  
  .novel-info {
    padding: 15px;
  }
  
  .novel-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.85rem;
    color: var(--text-light);
  }
  
  .novel-excerpt {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 15px;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .read-btn {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: var(--transition);
    width: 100%;
    text-align: center;
    font-weight: 500;
  }
  
  .read-btn:hover {
    background-color: var(--primary-dark);
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
    padding: 10px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #34495e;
    transition: var(--transition);
    text-align: center;
    flex-grow: 1;
    flex-basis: calc(33.333% - 10px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .genre-tag:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-3px);
  }
  
  /* Tags */
  .tags {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  
  .tag {
    background-color: #f0f0f0;
    color: #555;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 0.8rem;
  }
  
  /* Trending List */
  .trending-section {
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 20px 0;
    margin-bottom: 30px;
  }
  
  .trending-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .trending-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    background-color: #f8f9fa;
    border-radius: var(--border-radius);
    transition: var(--transition);
  }
  
  .trending-item:hover {
    background-color: #e9ecef;
    transform: translateX(5px);
  }
  
  .trending-rank {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--primary-color);
    width: 30px;
    text-align: center;
  }
  
  .trending-cover {
    width: 50px;
    height: 70px;
    margin: 0 15px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .trending-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .trending-info {
    flex-grow: 1;
    min-width: 0; /* 防止文本溢出 */
  }
  
  .trending-info h3 {
    font-size: 1rem;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .trending-meta {
    display: flex;
    gap: 10px;
    font-size: 0.85rem;
    color: var(--text-light);
  }
  
  .trending-genre {
    background-color: #e0e0e0;
    padding: 2px 8px;
    border-radius: 10px;
    color: #555;
  }
  
  .trending-views {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .trending-cover {
      width: 45px;
      height: 65px;
      margin: 0 10px;
    }
    
    .trending-rank {
      width: 25px;
      font-size: 1.1rem;
    }
    
    .trending-item {
      padding: 10px 12px;
    }
  }
  
  @media (max-width: 480px) {
    .trending-info h3 {
      font-size: 0.95rem;
    }
    
    .trending-meta {
      font-size: 0.8rem;
      flex-wrap: wrap;
      gap: 5px;
    }
    
    .trending-genre {
      padding: 1px 6px;
    }
  }
  
  .rank {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    width: 30px;
    text-align: center;
  }
  
  .trend-cover {
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 4px;
    margin: 0 12px;
  }
  
  .trend-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* View More Button */
  .view-more {
    text-align: center;
    margin-top: 20px;
  }
  
  .view-all-btn {
    background-color: #2c3e50;
    color: white;
    padding: 10px 25px;
    border-radius: 30px;
    font-weight: 500;
    transition: var(--transition);
    display: inline-block;
  }
  
  .view-all-btn:hover {
    background-color: #1a252f;
    transform: translateY(-2px);
  }
  
  /* About Section */
  .about-section {
    background: linear-gradient(135deg, #2c3e50, #34495e);
    color: white;
    padding: 30px 0;
    border-radius: var(--border-radius);
  }
  
  .about-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .about-section h2 {
    color: white;
  }
  
  .about-section h2::after {
    background: white;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }
  
  .about-link, .contact-link {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 500;
    transition: var(--transition);
    text-align: center;
    flex: 1;
  }
  
  .about-link {
    background-color: white;
    color: #2c3e50;
  }
  
  .contact-link {
    background-color: transparent;
    color: white;
    border: 1px solid white;
  }
  
  .about-link:hover, .contact-link:hover {
    transform: translateY(-3px);
  }
  
  /* Footer */
  .site-footer {
    background-color: #2c3e50;
    color: white;
    padding: 30px 0 20px;
    margin-top: 30px;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .footer-logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .social-icons {
    display: flex;
    gap: 15px;
  }
  
  .social-icons a {
    color: white;
    font-size: 1.2rem;
  }
  
  .footer-links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 15px;
  }
  
  .footer-links a {
    color: #ecf0f1;
    font-size: 0.9rem;
  }
  
  .copyright {
    text-align: center;
    font-size: 0.8rem;
    color: #bdc3c7;
  }
  
  /* Back to Top Button */
  #back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 99;
  }
  
  #back-to-top.visible {
    opacity: 1;
    visibility: visible;
  }
  
  #back-to-top:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .novel-card, .novel-list-item {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .novel-card.in-view, .novel-list-item.in-view {
    animation: fadeIn 0.5s forwards;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .container {
      padding: 0 15px;
    }
    
    .main-title {
      font-size: 2rem;
    }
    
    .tagline {
      font-size: 1.1rem;
    }
    
    .hero-section {
      padding: 30px 0 20px;
    }
    
    .swipe-indicator {
      display: flex;
      transition: opacity 0.3s ease;
    }
    
    .novel-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
    
    .novel-carousel {
      padding-bottom: 10px;
      scroll-padding: 15px;
    }
    
    .novel-card {
      flex: 0 0 85%;
      touch-action: pan-x;
    }
    
    h2 {
      font-size: 1.4rem;
    }
    
    .genre-tag {
      flex-basis: calc(50% - 10px);
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .footer-content, .footer-links {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    /* Improve touch targets for mobile */
    .read-btn, .genre-tag, .nav-item, .view-all-btn {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    
    /* Active state feedback */
    .read-btn:active, .genre-tag:active, .nav-item:active, .view-all-btn:active {
      transform: scale(0.98);
    }
  }
  
  @media (max-width: 480px) {
    .main-title {
      font-size: 1.7rem;
    }
    
    .tagline {
      font-size: 1rem;
    }
    
    .search-box input {
      padding: 10px 15px;
      font-size: 0.95rem;
    }
    
    section {
      padding: 15px 0;
      margin-bottom: 20px;
    }
    
    .novel-cover {
      height: 140px;
    }
    
    .novel-card {
      flex: 0 0 80%;
    }
    
    .genre-tag {
      flex-basis: 100%;
    }
    
    h2 {
      font-size: 1.3rem;
    }
    
    .novel-excerpt {
      height: 36px;
      -webkit-line-clamp: 2;
    }
    
    /* Adjust trending layout for very small screens */
    .novel-list-item {
      flex-wrap: wrap;
    }
    
    .rank {
      width: 25px;
      font-size: 1.3rem;
    }
    
    .trend-cover {
      margin: 0 8px;
      width: 40px;
      height: 40px;
    }
    
    /* Fix nav scrolling issues on small screens */
    .mobile-nav {
      margin-left: -15px;
      margin-right: -15px;
      width: calc(100% + 30px);
      border-radius: 0;
    }
    
    /* Safe area adjustments for modern mobile browsers */
    .hero-section, .site-footer {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    
    .site-footer {
      padding-bottom: calc(20px + env(safe-area-inset-bottom));
    }
    
    #back-to-top {
      bottom: calc(20px + env(safe-area-inset-bottom));
      right: calc(20px + env(safe-area-inset-right));
    }
  }
  
  /* Optimizations for tall mobile screens */
  @media (max-height: 700px) and (max-width: 480px) {
    .hero-section {
      padding: 20px 0 15px;
    }
    
    .main-title {
      font-size: 1.5rem;
      margin-bottom: 5px;
    }
    
    .tagline {
      font-size: 0.9rem;
      margin-bottom: 15px;
    }
    
    section {
      padding: 12px 0;
      margin-bottom: 15px;
    }
    
    h2 {
      font-size: 1.2rem;
      margin-bottom: 10px;
    }
    
    .novel-cover {
      height: 120px;
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    :root {
      --text-color: #e0e0e0;
      --text-light: #b0b0b0;
      --bg-color: #121212;
      --card-bg: #1e1e1e;
    }
    
    body {
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    .mobile-nav, .novel-card, .novel-list-item, section {
      background-color: var(--card-bg);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    h2 {
      color: #e0e0e0;
    }
    
    .genre-tag {
      background-color: #2c2c2c;
      color: #d0d0d0;
    }
    
    .genre-tag:hover {
      background-color: var(--primary-color);
    }
    
    .tag {
      background-color: #2a2a2a;
      color: #c0c0c0;
    }
    
    .search-box input {
      background-color: #2a2a2a;
      color: white;
      border: 1px solid #3a3a3a;
    }
    
    .novel-list-item {
      border-bottom-color: #2a2a2a;
    }
  }
</style>

<!-- Add Font Awesome for icons -->
<script src="https://kit.fontawesome.com/4e5f136f21.js" crossorigin="anonymous"></script>

<!-- JavaScript for enhanced mobile experience -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
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
    
    // Navigation active state based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    function setActiveNavItem() {
      let scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + sectionId) {
              item.classList.add('active');
            }
          });
        }
      });
    }
    
    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    
    function toggleBackToTopButton() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }
    
    // Scroll event listeners
    window.addEventListener('scroll', setActiveNavItem);
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // Back to top functionality
    if (backToTopButton) {
      backToTopButton.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Intersection Observer for lazy loading and animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all novel cards for animation
    document.querySelectorAll('.novel-card').forEach(card => {
      observer.observe(card);
    });
    
    // Add touch feedback to interactive elements
    document.querySelectorAll('.read-btn, .genre-tag, .nav-item, .view-all-btn').forEach(element => {
      element.addEventListener('touchstart', function() {
        this.style.opacity = '0.8';
      });
      
      element.addEventListener('touchend', function() {
        this.style.opacity = '1';
      });
    });
    
    // Improve carousel swiping experience on mobile
    const carousels = document.querySelectorAll('.novel-carousel');
    
    carousels.forEach(carousel => {
      let isDown = false;
      let startX;
      let scrollLeft;
      
      carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      });
      
      carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
      });
      
      carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
      });
      
      carousel.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
      });
      
      // Hide swipe indicator after first interaction
      carousel.addEventListener('scroll', function() {
        const indicator = this.parentElement.querySelector('.swipe-indicator');
        if (indicator) {
          indicator.style.opacity = '0';
          setTimeout(() => {
            indicator.style.display = 'none';
          }, 300);
        }
      }, { once: true });
    });
  });
</script>