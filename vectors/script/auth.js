// ================================
// auth.js — Email/Password Auth + Profile Insert
// ================================

import { supabase } from "./supabaseClient";


// ---------- DOM ELEMENTS ----------
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignupLink = document.getElementById("show-signup");
const showLoginLink = document.getElementById("show-login");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const signupName = document.getElementById("signup-name");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirm = document.getElementById("signup-confirm");

// ---------- UI HELPERS ----------
function showSignup(e) {
  e?.preventDefault();
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
}

function showLogin(e) {
  e?.preventDefault();
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
}

showSignupLink?.addEventListener("click", showSignup);
showLoginLink?.addEventListener("click", showLogin);

// ---------- PASSWORD VISIBILITY ----------
document.querySelectorAll(".toggle-password").forEach((el) => {
  el.addEventListener("click", () => {
    const targetId = el.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    el.textContent = isHidden ? "visibility" : "visibility_off";
  });
});

// ---------- CHECK SESSION ----------
(async () => {
  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    // Already logged in
    window.location.href = "mainDashboard.html";
  }
})();

// ---------- SIGNUP ----------
signupForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const name = signupName.value.trim();
  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const confirm = signupConfirm.value;

  if (!name || !username || !email || !password) {
    return alert("Please fill in all fields.");
  }
  if (password !== confirm) {
    return alert("Passwords do not match.");
  }

  // Create user in Supabase Auth
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, username },
    },
  });

  if (signupError) {
    alert("Sign up failed: " + signupError.message);
    return;
  }

  const user = signupData?.user;
  if (user) {
    // Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        user_id: user.id,
        name,
        username,
        email,
        created_at: new Date().toISOString(),
      },
    ]);

    if (profileError) {
      console.warn("⚠️ Profile insert failed:", profileError.message);
    } else {
      console.log("✅ Profile added to profiles table");
    }
  }

  alert("Sign up successful! Please check your email to confirm your account.");
  showLogin();
});

// ---------- LOGIN ----------
loginForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    alert("Login failed: " + loginError.message);
    return;
  }

  // Success
  window.location.href = "mainDashboard.html";
});
