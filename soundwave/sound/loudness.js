// Get the back-to-top button
const backToTopButton = document.getElementById('back-to-top');

// Show button when scrolled down 300px
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'flex';
  } else {
    backToTopButton.style.display = 'none';
  }
});

// Scroll smoothly to top when clicked
backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Hide the button initially
backToTopButton.style.display = 'none';
