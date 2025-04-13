---
layout: default
title: About
description: Learn about WebNovels, our passion for literature, and our mission to share captivating stories with readers worldwide. Contact us to contribute or collaborate.
permalink: /about/
---

<header class="about-header">
  <div class="container">
    <nav class="breadcrumbs">
      <a href="{{ '/' | relative_url }}">Home</a> &gt;
      <span>About</span>
    </nav>
    <h1 class="page-title">About WebNovels</h1>
  </div>
</header>

<main class="content-wrapper">
  <section class="about-intro">
    <div class="container">
      <div class="about-content">
       
        <div class="about-text">
          <h2>Our Story</h2>
          <p>Welcome to WebNovels, a passion project born from our love of storytelling and literature. We started this platform with a simple mission: to collect and share captivating novels with readers around the world.</p>
          
          <p>What began as a small personal collection has grown into a diverse library of stories spanning multiple genres, from epic fantasy adventures and heart-racing science fiction to touching romances and thought-provoking contemporary fiction.</p>
          
          <p>We believe that great stories deserve to be shared, and that every reader should have access to quality literature that inspires, entertains, and broadens horizons.</p>
        </div>
      </div>
    </div>
  </section>
  
  <section class="our-mission">
    <div class="container">
      <div class="mission-content">
        <h2>Our Mission</h2>
        <div class="mission-cards">
          <div class="mission-card">
            <div class="mission-icon">
              <i class="fa fa-book-open"></i>
            </div>
            <h3>Curate Quality Content</h3>
            <p>We carefully select novels that demonstrate exceptional storytelling, character development, and creativity to ensure our readers have access to the best reading experiences.</p>
          </div>
          
          <div class="mission-card">
            <div class="mission-icon">
              <i class="fa fa-globe"></i>
            </div>
            <h3>Support Diverse Voices</h3>
            <p>We celebrate stories from various perspectives, cultures, and backgrounds, believing that diversity in literature enriches the reading experience and promotes understanding.</p>
          </div>
          
         
        </div>
      </div>
    </div>
  </section>
  
  <section class="how-it-works">
    <div class="container">
      <h2>How WebNovels Works</h2>
      <div class="works-steps">
        <div class="work-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Collection</h3>
            <p>We collect novels from various sources, focusing on quality and diversity across different genres. Our team reviews submissions and curates content to ensure standards of quality.</p>
          </div>
        </div>
        
        <div class="work-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Organization</h3>
            <p>We categorize novels by genre, tags, and themes to make them easily discoverable. Each novel is presented with comprehensive information to help readers find stories they'll love.</p>
          </div>
        </div>
        
        <div class="work-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Sharing</h3>
            <p>We make novels available in a convenient, reader-friendly format. Our platform is designed to provide a seamless reading experience across all devices.</p>
          </div>
        </div>
        
       
      </div>
    </div>
  </section>
  
  <section class="faq-section">
    <div class="container">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-list">
        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <h3>How often do you add new novels?</h3>
            <span class="toggle-icon">+</span>
          </div>
          <div class="faq-answer">
            <p>We update our collection on a weekly basis, adding new novels and chapters as they become available. We typically feature new content every Monday, but special releases may occur throughout the week.</p>
          </div>
        </div>
        
       
        
        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <h3>How can I support WebNovels?</h3>
            <span class="toggle-icon">+</span>
          </div>
          <div class="faq-answer">
            <p>The best way to support us is by reading, sharing, and engaging with the content. Leave reviews, participate in discussions, and tell others about your favorite novels. If you'd like to contribute financially, we have a donation option available on our site.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section class="contact-section">
    <div class="container">
      <div class="contact-content">
        <div class="contact-info">
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you! Whether you have suggestions, questions, or just want to say hello, feel free to reach out.</p>
          
          <div class="contact-method">
            <div class="contact-icon">
              <i class="fa fa-envelope"></i>
            </div>
            <div class="contact-details">
              <h3>Email</h3>
              <p><a href="mailto:chaskx@gmail.com">chaskx@gmail.com</a></p>
            </div>
          </div>
          
          <div class="contact-method">
            <div class="contact-icon">
              <i class="fa fa-comment"></i>
            </div>
            <div class="contact-details">
              <h3>Response Time</h3>
              <p>We aim to respond to all inquiries within 48 hours.</p>
            </div>
          </div>
          
         
        </div>
        
        
      </div>
    </div>
  </section>
</main>

<style>
  /* Base Styles - Matching Homepage */
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
  
  h1, h2, h3, h4 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }
  
  a {
    color: #3498db;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  a:hover {
    color: #2980b9;
  }
  
  section {
    margin-bottom: 50px;
    padding: 30px 0;
  }
  
  /* About Header */
  .about-header {
    background: linear-gradient(135deg, #3498db, #8e44ad);
    color: white;
    padding: 50px 0;
    margin-bottom: 30px;
  }
  
  .breadcrumbs {
    margin-bottom: 20px;
    font-size: 0.9rem;
  }
  
  .breadcrumbs a {
    color: rgba(255, 255, 255, 0.8);
    margin-right: 5px;
  }
  
  .breadcrumbs a:hover {
    color: white;
  }
  
  .breadcrumbs span {
    color: white;
  }
  
  .page-title {
    font-size: 2.8rem;
    position: relative;
  }
  
  /* About Intro Section */
  .about-content {
    display: flex;
    gap: 40px;
    align-items: center;
  }
  
  .about-image {
    flex: 0 0 40%;
  }
  
  .about-image img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .about-text {
    flex: 0 0 100%;
  }
  
  .about-text h2 {
    color: #2c3e50;
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .about-text p {
    margin-bottom: 20px;
    font-size: 1.05rem;
    color: #555;
  }
  
  /* Mission Section */
  .our-mission {
    background-color: #f0f7ff;
    padding: 60px 0;
    border-radius: 10px;
  }
  
  .mission-content h2 {
    text-align: center;
    margin-bottom: 40px;
    color: #2c3e50;
    font-size: 2rem;
  }
  
  .mission-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
  
  .mission-card {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .mission-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .mission-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #3498db, #8e44ad);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 20px;
  }
  
  .mission-card h3 {
    margin-bottom: 15px;
    color: #2c3e50;
  }
  
  .mission-card p {
    color: #555;
  }
  
  /* How It Works Section */
  .how-it-works h2 {
    text-align: center;
    margin-bottom: 40px;
    color: #2c3e50;
    font-size: 2rem;
  }
  
  .works-steps {
    position: relative;
  }
  
  .works-steps::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 30px;
    width: 2px;
    background-color: #e0e0e0;
  }
  
  .work-step {
    display: flex;
    margin-bottom: 30px;
    position: relative;
  }
  
  .step-number {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #3498db, #8e44ad);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: 30px;
    z-index: 1;
  }
  
  .step-content {
    flex: 1;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  }
  
  .step-content h3 {
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  /* FAQ Section */
  .faq-section {
    background-color: #f5f5f5;
    padding: 60px 0;
    border-radius: 10px;
  }
  
  .faq-section h2 {
    text-align: center;
    margin-bottom: 40px;
    color: #2c3e50;
    font-size: 2rem;
  }
  
  .faq-item {
    background: white;
    border-radius: 8px;
    margin-bottom: 15px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .faq-question {
    padding: 20px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .faq-question h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #2c3e50;
  }
  
  .toggle-icon {
    font-size: 1.5rem;
    color: #3498db;
    transition: transform 0.3s;
  }
  
  .faq-question.active .toggle-icon {
    transform: rotate(45deg);
  }
  
  .faq-answer {
    padding: 0 20px 20px;
    display: none;
  }
  
  .faq-answer p {
    margin: 0;
    color: #555;
  }
  
  /* Contact Section */
  .contact-section {
    padding: 60px 0;
  }
  
  .contact-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
  }
  
  .contact-info h2 {
    color: #2c3e50;
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .contact-info > p {
    margin-bottom: 30px;
    color: #555;
  }
  
  .contact-method {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .contact-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #3498db, #8e44ad);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-right: 15px;
  }
  
  .contact-details h3 {
    margin-bottom: 5px;
    color: #2c3e50;
    font-size: 1.1rem;
  }
  
  .social-links {
    display: flex;
    gap: 15px;
    margin-top: 30px;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
    background-color: #3498db;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: background-color 0.3s;
  }
  
  .social-link:hover {
    background-color: #2980b9;
    color: white;
  }
  
  .contact-form {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .contact-form h3 {
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 1.3rem;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    border-color: #3498db;
    outline: none;
  }
  
  .submit-btn {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .submit-btn:hover {
    background: linear-gradient(135deg, #2980b9, #2471a3);
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2.2rem;
    }
    
    .about-content {
      flex-direction: column;
    }
    
    .about-image,
    .about-text {
      flex: 0 0 100%;
    }
    
    .about-text h2 {
      font-size: 1.8rem;
    }
    
    .mission-content h2,
    .how-it-works h2,
    .faq-section h2,
    .contact-info h2 {
      font-size: 1.8rem;
    }
  }
  
  @media (max-width: 480px) {
    .page-title {
      font-size: 1.8rem;
    }
    
    .about-header {
      padding: 30px 0;
    }
    
    .about-text h2 {
      font-size: 1.5rem;
    }
    
    .mission-content h2,
    .how-it-works h2,
    .faq-section h2,
    .contact-info h2 {
      font-size: 1.5rem;
    }
    
    .work-step {
      flex-direction: column;
    }
    
    .step-number {
      margin-bottom: 15px;
    }
    
    .step-content {
      padding: 15px;
    }
  }
</style>

<script>
  // FAQ Accordion Functionality
  function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isActive = element.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-question').forEach(item => {
      item.classList.remove('active');
      item.nextElementSibling.style.display = 'none';
    });
    
    // If the clicked FAQ wasn't active, open it
    if (!isActive) {
      element.classList.add('active');
      answer.style.display = 'block';
    }
  }
  
  // Form Submission
  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, this would send the form data to a server
        // For now, we'll just show a success message
        
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        
        console.log('Form submitted:', formObject);
        
        // Reset the form
        contactForm.reset();
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you soon.');
      });
    }
  });
</script>