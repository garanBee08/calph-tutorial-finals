document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('.nav-links a');
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Handle mobile toggle
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Highlight active link based on current URL
  const currentURL = window.location.href;

  links.forEach(link => {
    if (currentURL.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// Note In Connecting NavBar
// Above <main>

//   <div id="navbar"></div>      / /

// Above </body>

// <script>
//   // Load navbar dynamically
//   fetch('../nav-bar/nav.html')
//     .then(res => res.text())
//     .then(data => {
//       document.getElementById('navbar').innerHTML = data;

//       // Load the navbar JS after it's inserted
//       const script = document.createElement('script');
//       script.src = '../nav-bar/nav.js';
//       document.body.appendChild(script);
//     });

//   // Load navbar CSS
//   const link = document.createElement('link');
//   link.rel = 'stylesheet';
//   link.href = '../nav-bar/nav.css';
//   document.head.appendChild(link);
// </script>
