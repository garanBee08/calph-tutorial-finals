const NAV_HEIGHT = 70; // navbar height

// --- Original Smooth Scroll Logic (Unchanged) ---
function smoothScroll(target, duration = 1500) {
  const start = window.scrollY;
  const end = target.offsetTop - NAV_HEIGHT + 70;
  const distance = end - start;
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
  }

  function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

const scrollBtn = document.getElementById('scrollBtn');
const aboutSection = document.getElementById('about');
const clickSound = document.getElementById('clickSound');

scrollBtn.addEventListener('click', () => {
  const clickSound = document.getElementById('clickSound');
  const aboutSection = document.getElementById('about');

  // Delay click sound slightly so it won't conflict with bg unmute
  setTimeout(() => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.volume = 0.7;
      clickSound.play().catch(err => console.log('Click sound blocked:', err));
    }
  }, 200); // small delay (0.2s)

  smoothScroll(aboutSection, 2000);
});




// Navbar links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  const href = link.getAttribute('href');

  // If it's an in-page anchor (starts with '#'), intercept and smooth-scroll
  if (href && href.startsWith('#')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) smoothScroll(target, 1500);
    });
  }
  // If it's NOT a hash (external/relative page), do nothing and allow normal navigation
});

// -------------------- AUTOMATIC SMOOTH CAROUSEL LOGIC --------------------

const aboutBoxes = document.getElementById('aboutBoxes');
const originalCards = aboutBoxes.querySelectorAll('.topic-card');

// Card width (280px) + gap (32px) = 312px. Using 315px for safe margin.
const CARD_SCROLL_AMOUNT = 315; 
const TOTAL_CARDS = originalCards.length; // 4
const TOTAL_WIDTH_OF_SET = CARD_SCROLL_AMOUNT * TOTAL_CARDS; // 315 * 4 = 1260

let animationFrameId;
const SCROLL_SPEED = 1; // Pixels per frame (adjust for slower/faster speed)
const FRAME_RATE_MS = 16.6; // ~60 frames per second

/**
 * 1. Clone Cards for Smoother Looping
 * Structure: [1, 2, 3, 4] [1, 2, 3, 4]
 * We clone the entire original set and append it once.
 */
function setupSmoothInfiniteCarousel() {
    // Clone the entire original set and append it.
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        aboutBoxes.appendChild(clone);
    });
    
    // Crucially, we do NOT set the initial scroll position here. 
    // The animation loop will start from scrollLeft = 0.
}

// Set up the carousel when the page loads
setupSmoothInfiniteCarousel();

/**
 * 2. Continuous Animation Loop
 * This function uses requestAnimationFrame for smoother, browser-optimized scrolling.
 */
function animateScroll() {
    // Scroll the box container continuously
    aboutBoxes.scrollLeft += SCROLL_SPEED;

    // Check if we have scrolled past the original set of cards (i.e., we are viewing the clone)
    if (aboutBoxes.scrollLeft >= TOTAL_WIDTH_OF_SET) {
        // Instantly jump back to the start of the first original set.
        // This jump is instantaneous because scroll-behavior: smooth is NOT used here.
        aboutBoxes.scrollLeft = 0;
    }

    // Request the next frame to continue the animation
    animationFrameId = requestAnimationFrame(animateScroll);
}


// 3. Start/Stop Animation on Hover (Good UX practice)
function stopAutoScroll() {
    cancelAnimationFrame(animationFrameId);
}

// Start the continuous scrolling
window.addEventListener('load', () => {
    // We disable CSS smooth scroll for this continuous loop
    aboutBoxes.style.scrollBehavior = 'auto';
    animateScroll();

    // Pause on hover
    aboutBoxes.addEventListener('mouseenter', stopAutoScroll);
    aboutBoxes.addEventListener('mouseleave', animateScroll);
});

// Inject chatbot HTML if not already loaded
if (!document.querySelector("[data-chatbot-loaded]")) {
  document.body.setAttribute("data-chatbot-loaded", "true");

  const placeholder = document.getElementById("chatbot-placeholder");
  placeholder.innerHTML = `
    <button id="chatbot-toggle">💬 <span id="chatbot-badge">1</span></button>
    <div id="chatbot-container">
      <div id="chatbot-header">Fluids Chatbot</div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-options"></div>
    </div>
  `;

  initChatbot();
}

function initChatbot() {
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotOptions = document.getElementById("chatbot-options");
  const chatbotBadge = document.getElementById("chatbot-badge");

  let chatbotOpened = false;

  const conversation = {
    start: {
      text: "Hello! Welcome to Fluids! How can I assist you today?",
      options: ["About Fluids", "Topics", "Quiz"]
    },
    "About Fluids": {
      text: "Fluids is an interactive platform to explore fluid mechanics through lessons, topics, and simulations.",
      options: ["Topics", "Back to main menu"]
    },
    Topics: {
      text: "We cover: Archimedes Principle, Bernoulli's Principle, Fluid Pressure, and Continuity Principle.",
      options: ["About Fluids", "Quiz", "Back to main menu"]
    },
    Quiz: {
      text: "Test your knowledge with our interactive quizzes!",
      options: ["Topics", "Back to main menu"]
    },
    backToMenu: {
      text: "Welcome back! How can I help you today?",
      options: ["About Fluids", "Topics", "Quiz"]
    }
  };

  let currentNode = "start";

  chatbotToggle.addEventListener("click", () => {
    const isHidden = chatbotContainer.style.display === "none" || chatbotContainer.style.display === "";
    if (isHidden) {
      chatbotContainer.style.display = "flex";
      chatbotBadge.style.display = "none";
      if (!chatbotOpened) {
        chatbotMessages.innerHTML = "";
        displayMessage("bot", conversation.start.text);
        displayOptions(conversation.start.options);
        chatbotOpened = true;
      }
    } else {
      chatbotContainer.style.display = "none";
    }
  });

  function displayMessage(sender, text) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = text;
    chatbotMessages.appendChild(message);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function displayOptions(options) {
    chatbotOptions.innerHTML = "";
    options.forEach(option => {
      const button = document.createElement("button");
      button.classList.add("option");
      button.textContent = option;
      button.addEventListener("click", () => handleOption(option));
      chatbotOptions.appendChild(button);
    });
  }

  function handleOption(option) {
    displayMessage("user", option);
    if (option === "Back to main menu") currentNode = "backToMenu";
    else if (conversation[option]) currentNode = option;

    setTimeout(() => {
      displayMessage("bot", conversation[currentNode].text);
      displayOptions(conversation[currentNode].options);
    }, 500);
  }

  chatbotContainer.style.display = "none";
}

const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');

// Open modal when logout is clicked
logoutBtn.addEventListener('click', () => {
  logoutModal.style.display = 'flex';
});

// Confirm logout
confirmLogout.addEventListener('click', () => {
  window.location.href = "/mainDashboard.html"; // change link if needed
});

// Cancel logout
cancelLogout.addEventListener('click', () => {
  logoutModal.style.display = 'none';
});

// Optional: close modal if clicked outside the box
window.addEventListener('click', (e) => {
  if (e.target === logoutModal) {
    logoutModal.style.display = 'none';
  }
});



