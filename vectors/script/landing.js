// Smooth scroll + active nav highlight
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;
  
    const navbarHeight = document.querySelector(".navbar").offsetHeight;
    const sectionTop = section.offsetTop - navbarHeight;
  
    window.scrollTo({
      top: sectionTop,
      behavior: "smooth"
    });
  
    // Update active nav button
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.nav-btn[onclick="scrollToSection('${id}')"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }
  
  // “Get Started” button → go to dashboard.html
    document.querySelector(".get-started").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
  
  // Highlight nav button while scrolling
  const sections = document.querySelectorAll("section");
  const navButtons = document.querySelectorAll(".nav-btn");
  
  window.addEventListener("scroll", () => {
    let currentSection = "";
  
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });
  
    navButtons.forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("onclick") === `scrollToSection('${currentSection}')`) {
        btn.classList.add("active");
      }
    });
  });
  