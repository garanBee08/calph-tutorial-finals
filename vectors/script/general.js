// Make sure JS runs **after DOM is loaded**
document.addEventListener("DOMContentLoaded", () => {
  const logoButton1 = document.getElementById("logoButton1");
  const logoButton2 = document.getElementById("logoButton2");
  const dropdown1 = document.getElementById("accountDropdown1");
  const dropdown2 = document.getElementById("accountDropdown2");
  
  // Toggle dropdown on click
  logoButton1.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from bubbling to window
    dropdown1.style.display = dropdown1.style.display === "block" ? "none" : "block";
  });

  logoButton2.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from bubbling to window
    dropdown2.style.display = dropdown2.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  window.addEventListener("click", () => {
    dropdown1.style.display = "none";
    dropdown2.style.display = "none";
  });
});
