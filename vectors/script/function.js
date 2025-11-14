// logout.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// --- SUPABASE CONFIG ---
const SUPABASE_URL = "https://sjevsjchglepgctehvrr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXZzamNoZ2xlcGdjdGVodnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTIzMzIsImV4cCI6MjA3NzEyODMzMn0.UpDnIBBQHC3R65uOGtnIN_5jOr40Zs2lAfOEdY1J45A";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- LOGOUT FUNCTION ---
async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    document.getElementById("logoutModal").style.display = "none";
    window.location.href = "/index.html"; // redirect after logout
  } catch (err) {
    console.error("Logout failed:", err.message);
    alert("Logout failed: " + err.message);
  }
}

// --- DOM HANDLERS ---
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn1 = document.getElementById("logoutBtn1");
  const logoutBtn2 = document.getElementById("logoutBtn2");
  const modal = document.getElementById("logoutModal");
  const confirmBtn = document.getElementById("confirmLogout");
  const cancelBtn = document.getElementById("cancelLogout");

  if (!logoutBtn1 || !logoutBtn2 || !modal) return;

  // Open modal
  logoutBtn1.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });
  logoutBtn2.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  // Confirm logout
  confirmBtn.addEventListener("click", () => {
    logoutUser();
  });

  // Cancel logout
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close when clicking outside modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});
