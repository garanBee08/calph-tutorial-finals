// Smooth scroll for internal links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const quizContainer = document.querySelector(".quiz-container");
  if (quizContainer) observer.observe(quizContainer);

  // Parallax effect on scroll
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.wave-img');
    parallaxElements.forEach(el => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
  
  // ========== NEW: Generate Particles ========== 
  generateParticles();
  
  // ========== NEW: Add Button Ripple Effects ========== 
  addButtonRipples();
});

// ========== NEW: Particle Generation Function ==========
function generateParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  // Create 50 particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
    particlesContainer.appendChild(particle);
  }
}

// ========== NEW: Mouse Tracking for Card Spotlight Effect ==========
function trackMouse(e, card) {
  const rect = card.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty('--mouse-x', x + '%');
  card.style.setProperty('--mouse-y', y + '%');
}

// Make trackMouse available globally
window.trackMouse = trackMouse;

// ========== NEW: Button Ripple Effect ==========
function addButtonRipples() {
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
      // Don't add ripple if it's the quiz start button (already has animation)
      if (this.classList.contains('quiz-start')) return;
      
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255,255,255,0.5)';
      ripple.style.transform = 'scale(0)';
      ripple.style.pointerEvents = 'none';
      
      // Add ripple animation
      ripple.style.animation = 'ripple-effect 0.6s ease-out';
      
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation to CSS dynamically
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple-effect {
        to {
          transform: scale(3);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ========== NEW: Enhanced Scroll Animations ==========
window.addEventListener('scroll', () => {
  // Existing parallax code
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.wave-img');
  parallaxElements.forEach(el => {
    const speed = 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
  
  // Add fade-in for sections as they come into view
  const sections = document.querySelectorAll('.page');
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.75) {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }
  });
});

// Redirect function with smooth transition
function redirectTo(url) {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = url;
  }, 500);
}

// Make redirectTo available globally
window.redirectTo = redirectTo;