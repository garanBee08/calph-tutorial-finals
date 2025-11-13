// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');


if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}


// Optional search example
document.querySelector('.search')?.addEventListener('submit', e => {
  e.preventDefault();
  const q = e.target.querySelector('input').value.trim();
  if (q) alert(`You searched for: ${q}`);
});


// === About Us section toggle ===
const aboutTitle = document.querySelector('.about-title');
const descCard = document.querySelector('.glass');


aboutTitle?.addEventListener('click', () => {
  if (!descCard) return;
  const isOpen = descCard.classList.contains('is-open');
  if (!descCard.classList.contains('is-open') && !descCard.classList.contains('is-collapsed')) {
    descCard.classList.add('is-open');
    return;
  }
  descCard.classList.toggle('is-open', !isOpen);
  descCard.classList.toggle('is-collapsed', isOpen);
});


// === See More button animation (optional smooth left/right toggle) ===
const ctaRow = document.querySelector('.cta-row');
const seeMoreBtn = ctaRow?.querySelector('.btn-primary');
const chips = Array.from(ctaRow?.querySelectorAll('.chip') || []);


if (ctaRow) ctaRow.classList.remove('off');


seeMoreBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  if (!ctaRow || !chips.length) return;


  const isOff = ctaRow.classList.contains('off');


  if (isOff) {
    // OPEN (left → right)
    chips.forEach((chip, i) => {
      chip.style.transitionDelay = `${i * 90}ms`;
    });
    ctaRow.classList.remove('off', 'closing');
    setTimeout(() => chips.forEach(chip => (chip.style.transitionDelay = '0ms')), 280 + (chips.length - 1) * 90);
  } else {
    // CLOSE (right → left)
    ctaRow.classList.add('closing');
    chips
      .slice()
      .reverse()
      .forEach((chip, i) => {
        chip.style.transitionDelay = `${i * 90}ms`;
      });
    setTimeout(() => {
      ctaRow.classList.add('off');
      ctaRow.classList.remove('closing');
      chips.forEach(chip => (chip.style.transitionDelay = '0ms'));
    }, 280 + (chips.length - 1) * 90);
  }
});


// Precise tagline alignment: start after logo icon, end under the 'd'
(function () {
  const logo = document.querySelector('.hero-mark');
  const tagline = document.querySelector('.tagline');
  if (!logo || !tagline) return;


  // ratios from your measurements: logo=566, tagline=411, offset=155
  const OFFSET_RATIO = 155 / 566; // 27.4% -> where the logo icon ends
  const WIDTH_RATIO  = 411 / 566; // 72.6% -> tagline span to the 'd'


  function alignTagline() {
    const logoWidth = logo.getBoundingClientRect().width;
    if (!logoWidth) return;


    const left = Math.round(logoWidth * OFFSET_RATIO);
    const width = Math.round(logoWidth * WIDTH_RATIO);


    tagline.style.marginLeft = left + 'px';
    tagline.style.width = width + 'px';
    tagline.style.textAlign = 'left';
  }


  window.addEventListener('load', alignTagline);
  window.addEventListener('resize', alignTagline);
})();


// Keep tagline proportion aligned to the logo (responsive)
(() => {
  const logo = document.querySelector('.hero-mark');
  const tagline = document.querySelector('.tagline');
  if (!logo || !tagline) return;


  const OFFSET_RATIO = 155 / 566; // icon end
  const WIDTH_RATIO  = 411 / 566; // span to 'd'


  function alignTagline() {
    const w = logo.getBoundingClientRect().width;
    if (!w) return;
    // use CSS custom properties to keep it tweakable from CSS
    tagline.style.marginLeft = `calc(${(OFFSET_RATIO*100).toFixed(3)}% + var(--tag-offset-tweak))`;
    tagline.style.width = `${(WIDTH_RATIO*100).toFixed(3)}%`;
  }


  window.addEventListener('load', alignTagline);
  window.addEventListener('resize', alignTagline);
})();


// SEE MORE toggle: centered under card -> slide left & reveal chips
(() => {
  const row = document.querySelector('.cta-row');
  const btn = document.querySelector('.see-more');
  if (!row || !btn) return;


  // Start closed (pill centered, chips hidden)
  row.classList.remove('is-open');
  row.classList.add('is-closed');
  btn.setAttribute('aria-expanded', 'false');


  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const open = row.classList.toggle('is-open');
    row.classList.toggle('is-closed', !open);
    btn.setAttribute('aria-expanded', String(open));
  });
})();
// SEE MORE toggle: centered -> slide left & reveal chips
(() => {
  const row = document.querySelector('.cta-row');
  const btn = document.querySelector('.see-more');
  if (!row || !btn) return;


  // start closed (pill centered, chips hidden)
  row.classList.remove('is-open');
  row.classList.add('is-closed');
  btn.setAttribute('aria-expanded', 'false');


  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const open = row.classList.toggle('is-open');
    row.classList.toggle('is-closed', !open);
    btn.setAttribute('aria-expanded', String(open));
  });
})();


// === See More toggle: chips appear beside button ===
document.addEventListener("DOMContentLoaded", () => {
  const seeMoreBtn = document.querySelector(".see-more");
  const chips = document.querySelectorAll(".chip");


  if (!seeMoreBtn || !chips.length) return;


  seeMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const open = chips[0].classList.contains("is-visible");


    chips.forEach((chip, i) => {
      chip.style.transitionDelay = open ? "0ms" : `${i * 100}ms`;
      chip.classList.toggle("is-visible", !open);
    });


    seeMoreBtn.textContent = open ? "See more..." : "See less...";
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const aboutTitle = document.querySelector(".about-title");
  const rightSection = document.querySelector(".right");
  const glassCard = document.querySelector(".glass");
  const glassText = glassCard?.querySelector("p");
  const seeMoreBtn = document.querySelector(".btn-primary.see-more");


  if (aboutTitle && rightSection && glassCard && glassText && seeMoreBtn) {
    // Hide both at the start
    glassCard.classList.add("hidden");
    seeMoreBtn.classList.add("hidden");


    const fullText = glassText.textContent;
    glassText.textContent = "";


    aboutTitle.addEventListener("click", () => {
      const open = rightSection.classList.toggle("active");


      glassCard.classList.toggle("hidden", !open);
      glassCard.classList.toggle("show", open);


      if (open) {
        // start typewriter
        typeWriter(glassText, fullText);
        // delay See More fade-in slightly
        setTimeout(() => {
          seeMoreBtn.classList.remove("hidden");
          seeMoreBtn.classList.add("show");
        }, 800);
      } else {
        glassText.textContent = "";
        seeMoreBtn.classList.remove("show");
        seeMoreBtn.classList.add("hidden");
      }
    });


    // --- Typewriter Animation ---
    function typeWriter(element, text) {
      element.textContent = "";
      let i = 0;
      const speed = 20;


      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }
  }
});








/*SECOND PAGE*/
/* === Cinematic Scroll Transition: fade + wavy movement === */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowH = window.innerHeight;
  const fadeStart = windowH * 0.3;
  const fadeEnd = windowH * 1.1;

  const fadeProgress = Math.min(Math.max((scrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1);

  const bgWrap = document.querySelector(".bg-wrap");
  const page2 = document.querySelector(".second-page");
  const hero = document.querySelector(".hero");
  const glass = document.querySelector(".glass");
  const cta = document.querySelector(".cta-row");

  if (!bgWrap || !page2) return;

  // background cross-fade
  bgWrap.style.opacity = 1 - fadeProgress;
  page2.style.opacity = fadeProgress;

  // wavy upward entrance for bg2
  const waveY = Math.sin(fadeProgress * Math.PI) * 60; // gentle vertical wave
  page2.style.transform = `translateY(${60 - waveY}px)`;

  // fade out hero + glass + see more gradually
  if (fadeProgress > 0.15) {
    hero?.classList.add("fade-out");
    glass?.classList.add("fade-out");
    cta?.classList.add("fade-out");
  } else {
    hero?.classList.remove("fade-out");
    glass?.classList.remove("fade-out");
    cta?.classList.remove("fade-out");
  }
});

/* === Natural scroll transition === */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowH = window.innerHeight;
  const fadeStart = windowH * 0.35; // starts fade slightly later
  const fadeEnd = windowH * 1.1;    // finishes smoothly

  const fadeProgress = Math.min(Math.max((scrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1);

  const bgWrap = document.querySelector(".bg-wrap");
  const page2 = document.querySelector(".second-page");
  const hero = document.querySelector(".hero");
  const glass = document.querySelector(".glass");
  const cta = document.querySelector(".cta-row");

  if (!bgWrap || !page2) return;

  // fade backgrounds
  bgWrap.style.opacity = 1 - fadeProgress;
  page2.style.opacity = fadeProgress;

  // gentle upward movement (no wavy bounce)
  page2.style.transform = `translateY(${80 - fadeProgress * 80}px)`;

  // fade out first-page elements
  if (fadeProgress > 0.1) {
    hero?.classList.add("fade-out");
    glass?.classList.add("fade-out");
    cta?.classList.add("fade-out");
  } else {
    hero?.classList.remove("fade-out");
    glass?.classList.remove("fade-out");
    cta?.classList.remove("fade-out");
  }
});

window.addEventListener("scroll", () => {
  const firstBG = document.querySelector(".bg-wrap");
  const secondBG = document.querySelector(".second-page");
  const scrollY = window.scrollY;

  const fadeStart = window.innerHeight * 0.4;
  const fadeEnd = window.innerHeight * 1.4;
  const progress = Math.min(1, Math.max(0, (scrollY - fadeStart) / (fadeEnd - fadeStart)));

  if (firstBG) firstBG.style.opacity = `${1 - progress}`;
  if (secondBG) {
    secondBG.style.opacity = `${progress}`;
    secondBG.style.transform = `translateY(${80 - 80 * progress}px)`;
    if (progress > 0.3) {
      secondBG.classList.add("scrolling");
    } else {
      secondBG.classList.remove("scrolling");
    }
  }
});

// === SECOND PAGE fade & parallax scroll ===
window.addEventListener("scroll", () => {
  const bg2 = document.querySelector(".second-page");
  if (!bg2) return;

  const scrollY = window.scrollY;
  const fadeStart = window.innerHeight * 0.5;
  const fadeEnd = window.innerHeight * 1.3;
  const progress = Math.min(1, Math.max(0, (scrollY - fadeStart) / (fadeEnd - fadeStart)));

  bg2.style.opacity = `${progress}`;
  bg2.style.transform = `translateY(${80 - 80 * progress}px)`;

  if (progress > 0.3) bg2.classList.add("scrolling");
  else bg2.classList.remove("scrolling");
});

// Smooth scroll to second page
document.getElementById('aboutBtn').addEventListener('click', () => {
  const secondPage = document.getElementById('second-page');
  secondPage.scrollIntoView({ behavior: 'smooth' });
});
// Fade in when visible
window.addEventListener("scroll", () => {
  const secondPage = document.querySelector(".second-page");
  const rect = secondPage.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    secondPage.classList.add("visible");
  }
});

window.addEventListener("scroll", () => {
  const aboutSection = document.querySelector("#second-about");
  if (!aboutSection) return;

  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    aboutSection.classList.add("visible");
  }
});
