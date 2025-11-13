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

