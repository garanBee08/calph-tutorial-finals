import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ==================== Supabase Setup ====================
const SUPABASE_URL = "https://sjevsjchglepgctehvrr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXZzamNoZ2xlcGdjdGVodnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTIzMzIsImV4cCI6MjA3NzEyODMzMn0.UpDnIBBQHC3R65uOGtnIN_5jOr40Zs2lAfOEdY1J45A"; // replace with your anon/public key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== DOM Elements ====================
const scoreQuiz1El = document.querySelector(".score_quiz1");
const scoreQuiz2El = document.querySelector(".score_quiz2");

const leaderboardBtn = document.querySelector(".leaderB a");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeLeaderboard = document.getElementById("closeLeaderboard");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

const firstUserEl = document.querySelector(".topUser.first .userName");
const firstScoreEl = document.querySelector(".topUser.first .userScore");
const secondUserEl = document.querySelector(".topUser.second .userName");
const secondScoreEl = document.querySelector(".topUser.second .userScore");
const thirdUserEl = document.querySelector(".topUser.third .userName");
const thirdScoreEl = document.querySelector(".topUser.third .userScore");

let confettiPieces = [];

// ==================== Fetch Current User Scores ====================
async function displayUserScores() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      scoreQuiz1El.textContent = "Score: 0/15";
      scoreQuiz2El.textContent = "Score: 0/10";
      return;
    }

    const userId = session.user.id;

    const { data: leaderboard, error } = await supabase
      .from("heatTemp_leaderboard")
      .select("score_quiz1, score_quiz2")
      .eq("user_id", userId)
      .limit(1);

    if (error) throw error;

    const row = leaderboard && leaderboard.length > 0 ? leaderboard[0] : null;

    scoreQuiz1El.textContent = `Score: ${row?.score_quiz1 || 0}/15`;
    scoreQuiz2El.textContent = `Score: ${row?.score_quiz2 || 0}/10`;

  } catch (err) {
    console.error("Unexpected error:", err.message);
    scoreQuiz1El.textContent = "Score: 0/15";
    scoreQuiz2El.textContent = "Score: 0/10";
  }
}

// ==================== Fetch Top 3 Users for Leaderboard (Manual Join) ====================
async function populateLeaderboard() {
  try {
    // Step 1: Fetch all leaderboard entries
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from("heatTemp_leaderboard")
      .select("user_id, score_quiz1, score_quiz2");

    if (leaderboardError) throw leaderboardError;

    if (!leaderboard || leaderboard.length === 0) return;

    // Step 2: Fetch corresponding profiles
    const userIds = leaderboard.map(u => u.user_id);
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, username")
      .in("user_id", userIds);

    if (profileError) throw profileError;

    // Step 3: Merge usernames into leaderboard entries
    const merged = leaderboard.map(row => {
      const profile = profiles.find(p => p.user_id === row.user_id);
      return {
        username: profile?.username || "Unknown",
        totalScore: (row.score_quiz1 || 0) + (row.score_quiz2 || 0)
      };
    });

    // Step 4: Sort by total score descending
    const sorted = merged.sort((a, b) => b.totalScore - a.totalScore);

    // Step 5: Update top 3 DOM elements
    const [first, second, third] = [
      sorted[0] || { username: "N/A", totalScore: 0 },
      sorted[1] || { username: "N/A", totalScore: 0 },
      sorted[2] || { username: "N/A", totalScore: 0 }
    ];

    firstUserEl.textContent = first.username;
    firstScoreEl.textContent = `${first.totalScore} pts`;
    secondUserEl.textContent = second.username;
    secondScoreEl.textContent = `${second.totalScore} pts`;
    thirdUserEl.textContent = third.username;
    thirdScoreEl.textContent = `${third.totalScore} pts`;

  } catch (err) {
    console.error("Error populating leaderboard:", err.message);
  }
}

// ==================== Confetti ====================
function resizeCanvas() {
  confettiCanvas.width = leaderboardModal.offsetWidth;
  confettiCanvas.height = leaderboardModal.offsetHeight;
}

function createConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height,
      r: Math.random() * 6 + 2,
      dx: (Math.random() - 0.5) * 2,
      dy: Math.random() * 2 + 1
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random() * 360},100%,50%)`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.y > confettiCanvas.height) p.y = 0;
  });
  requestAnimationFrame(drawConfetti);
}

// ==================== Event Listeners ====================
leaderboardBtn.addEventListener("click", async () => {
  leaderboardModal.style.display = "flex";
  resizeCanvas();
  createConfetti();
  drawConfetti();

  await populateLeaderboard();
});

closeLeaderboard.addEventListener("click", () => {
  leaderboardModal.style.display = "none";
});

// ==================== Initialize ====================
displayUserScores();
