// Carousel functionality for developer cards
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.developers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const cards = document.querySelectorAll('.developer-card');
   
    if (!carousel || !prevBtn || !nextBtn || cards.length === 0) {
      return;
    }
  
  
    // Calculate how many cards to show at once based on viewport
    let cardsPerView = getCardsPerView();
    let currentIndex = 0;
    const totalCards = cards.length;
    const totalPages = Math.ceil(totalCards / cardsPerView);
  
  
    // Create indicators
    function createIndicators() {
      indicatorsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.setAttribute('aria-label', `Go to page ${i + 1}`);
        indicator.addEventListener('click', () => goToPage(i));
        indicatorsContainer.appendChild(indicator);
      }
    }
  
  
    // Get number of cards per view based on screen size
    function getCardsPerView() {
      const cardWidth = cards[0]?.offsetWidth || 250;
      const containerWidth = carousel.offsetWidth;
      return Math.floor(containerWidth / (cardWidth + 32)); // 32px for gap
    }
  
  
    // Update cards per view on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
          cardsPerView = newCardsPerView;
          const newTotalPages = Math.ceil(totalCards / cardsPerView);
          if (newTotalPages !== totalPages) {
            createIndicators();
          }
          goToPage(Math.min(currentIndex, newTotalPages - 1));
        }
      }, 250);
    });
  
  
    // Scroll to specific page
    function goToPage(pageIndex) {
      if (pageIndex < 0 || pageIndex >= totalPages) return;
     
      currentIndex = pageIndex;
      const cardWidth = cards[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(carousel).gap) || 24;
      const scrollAmount = (cardWidth + gap) * cardsPerView * pageIndex;
     
      carousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
  
  
      updateButtons();
      updateIndicators();
    }
  
  
    // Update button states
    function updateButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= totalPages - 1;
    }
  
  
    // Update indicator states
    function updateIndicators() {
      const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
  
  
    // Navigation button handlers
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        goToPage(currentIndex - 1);
      }
    });
  
  
    nextBtn.addEventListener('click', () => {
      if (currentIndex < totalPages - 1) {
        goToPage(currentIndex + 1);
      }
    });
  
  
    // Handle scroll to update current index (for manual scrolling)
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(carousel).gap) || 24;
        const scrollPosition = carousel.scrollLeft;
        const newIndex = Math.round(scrollPosition / ((cardWidth + gap) * cardsPerView));
       
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalPages) {
          currentIndex = newIndex;
          updateButtons();
          updateIndicators();
        }
      }, 100);
    });
  
  
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.developers-section')) {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
          e.preventDefault();
          prevBtn.click();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
          e.preventDefault();
          nextBtn.click();
        }
      }
    });
  
  
    // Initialize
    createIndicators();
    updateButtons();
  });
  
  
  // Back to top button functionality
  document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.querySelector('.back-to-top');
   
    if (backToTopBtn) {
      // Prevent default anchor behavior and add smooth scroll
      backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
       
        // Scroll to the very top of the page to show navbar and all content
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  });


// Load navbar dynamically
fetch('../nav-bar/nav.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data;
    const script = document.createElement('script');
    script.src = '../nav-bar/nav.js';
    document.body.appendChild(script);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../nav-bar/nav.css';
    document.head.appendChild(link);
  });


// ============================================
// ANIMATIONS AND EFFECTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Add initial hidden state for animated elements
  const heroContent = document.querySelector('.hero-content');
  const infoCard = document.querySelector('.info-card');
  const developerCards = document.querySelectorAll('.developer-card');
  const developersSection = document.querySelector('.developers-section');
  const backToTopBtn = document.querySelector('.back-to-top');
  const carouselBtns = document.querySelectorAll('.carousel-btn');

  // Add CSS for animations dynamically
  const style = document.createElement('style');
  style.textContent = `
    /* Initial hidden state */
    .hero-content,
    .info-card {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }

    .hero-content.animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    .info-card.animate-in {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 0.2s;
    }

    /* Developer cards animation */
    .developer-card {
      opacity: 0;
      transform: translateY(50px) scale(0.9);
      transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
    }

    .developer-card.animate-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* Hover effects for cards */
    .developer-card:hover {
      transform: translateY(-10px) scale(1.02) !important;
      box-shadow: 0 30px 60px rgba(1, 8, 33, 0.7) !important;
      transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    }

    /* Avatar animation on card hover */
    .developer-card:hover .avatar {
      transform: scale(1.1) rotate(5deg);
      transition: transform 0.3s ease;
    }

    .avatar {
      transition: transform 0.3s ease;
    }

    /* Social icons animation */
    .socials a {
      transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    }

    .socials a:hover {
      transform: translateY(-5px) scale(1.15);
      box-shadow: 0 8px 20px rgba(59, 92, 255, 0.6);
    }

    /* Carousel buttons animation */
    .carousel-btn {
      transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
    }

    .carousel-btn:hover {
      transform: scale(1.15) !important;
    }

    .carousel-btn:active {
      transform: scale(0.9) !important;
    }

    /* Back to top button animation */
    .back-to-top {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .back-to-top.animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    .back-to-top:hover {
      transform: translateY(-5px) !important;
    }

    /* Developers section fade in */
    .developers-section {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }

    .developers-section.animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    /* Card title animation */
    .developer-card h3 {
      transition: color 0.3s ease, transform 0.3s ease;
    }

    .developer-card:hover h3 {
      color: rgba(255, 255, 255, 1);
      transform: scale(1.05);
    }

    /* Pulse animation for indicators */
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.3);
      }
    }

    .carousel-indicator.active {
      animation: pulse 2s ease-in-out infinite;
    }

    /* Smooth scroll reveal */
    @keyframes slideInFromLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Glow effect on hover */
    .developer-card::before {
      transition: box-shadow 0.3s ease;
    }

    .developer-card:hover::before {
      box-shadow: 0 0 30px rgba(110, 143, 255, 0.5);
    }
  `;
  document.head.appendChild(style);

  // Animate hero section on load
  setTimeout(() => {
    if (heroContent) {
      heroContent.classList.add('animate-in');
    }
    if (infoCard) {
      infoCard.classList.add('animate-in');
    }
  }, 100);

  // Animate developers section when it comes into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Animate cards with stagger
        if (entry.target.classList.contains('developers-section')) {
          const cards = entry.target.querySelectorAll('.developer-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  if (developersSection) {
    sectionObserver.observe(developersSection);
  }

  // Animate back to top button when scrolling
  const backToTopObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        backToTopBtn?.classList.add('animate-in');
      } else {
        backToTopBtn?.classList.remove('animate-in');
      }
    });
  }, { threshold: 0.1 });

  if (heroContent && backToTopBtn) {
    backToTopObserver.observe(heroContent);
  }

  // Add parallax effect to hero section on scroll (only after animation)
  let lastScrollTop = 0;
  let heroAnimated = false;
  let infoAnimated = false;
  
  // Wait for initial animations to complete
  setTimeout(() => {
    heroAnimated = true;
    infoAnimated = true;
  }, 1000);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (heroContent && heroAnimated) {
      const parallaxSpeed = 0.3;
      const yPos = -(scrollTop * parallaxSpeed);
      heroContent.style.transform = `translateY(${yPos}px)`;
    }

    if (infoCard && infoAnimated) {
      const parallaxSpeed = 0.2;
      const yPos = -(scrollTop * parallaxSpeed);
      infoCard.style.transform = `translateY(${yPos}px)`;
    }

    lastScrollTop = scrollTop;
  }, { passive: true });

  // Add ripple effect to carousel buttons
  carouselBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add ripple effect CSS
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    .carousel-btn {
      position: relative;
      overflow: hidden;
    }

    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  // Add subtle glow pulse to hero title
  const heroTitle = document.querySelector('.hero-content h1');
  if (heroTitle) {
    const glowStyle = document.createElement('style');
    glowStyle.textContent = `
      .hero-content h1 {
        animation: glow-pulse 3s ease-in-out infinite;
      }

      @keyframes glow-pulse {
        0%, 100% {
          filter: drop-shadow(0 0 10px rgba(110, 143, 255, 0.3));
        }
        50% {
          filter: drop-shadow(0 0 20px rgba(110, 143, 255, 0.6));
        }
      }
    `;
    document.head.appendChild(glowStyle);
  }

  // Add smooth reveal animation for carousel indicators
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  if (indicatorsContainer) {
    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
      indicator.style.opacity = '0';
      indicator.style.transform = 'scale(0)';
      setTimeout(() => {
        indicator.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        indicator.style.opacity = '1';
        indicator.style.transform = 'scale(1)';
      }, 500 + (index * 50));
    });
  }

  // Add floating animation to avatars
  developerCards.forEach((card, index) => {
    const avatar = card.querySelector('.avatar');
    if (avatar) {
      const floatDelay = index * 0.2;
      avatar.style.animation = `float 3s ease-in-out infinite`;
      avatar.style.animationDelay = `${floatDelay}s`;
    }
  });

  // Add floating animation CSS
  const floatStyle = document.createElement('style');
  floatStyle.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .developer-card:hover .avatar {
      animation: none !important;
    }
  `;
  document.head.appendChild(floatStyle);

  // Add glow effect on card hover
  developerCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });

  // Add smooth transition for carousel scrolling
  const carousel = document.querySelector('.developers');
  if (carousel) {
    let isScrolling = false;
    carousel.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        carousel.style.transition = 'transform 0.3s ease';
      }
      
      clearTimeout(carousel.scrollTimeout);
      carousel.scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    });
  }
});
  