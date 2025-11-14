import { supabase } from "./supabaseClient.js";


document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (!user) return;

  // Fetch all quiz scores for this user
  const scores = await fetchScores("vectors_leaderboard", user.id);

  // Update the page
  updateScores(scores);
});

// ✅ Get logged-in user
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error("User not found:", error);
    return null;
  }
  return data.user;
}

// ✅ Fetch scores from the single leaderboard table
async function fetchScores(tableName, userId) {
  const { data, error } = await supabase
    .from(tableName)
    .select("quiz_number, score")
    .eq("user_id", userId);

  if (error) {
    console.error(`Error fetching scores:`, error);
    return {};
  }

  // Store latest score for each quiz number
  const latestScores = {};
  data?.forEach((row) => {
    latestScores[row.quiz_number] = row.score;
  });

  return latestScores;
}

// ✅ Update DOM elements with quiz scores
function updateScores(scores) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`score-quiz${i}`);
    if (el) {
      el.textContent = scores[i] ?? "---";
    }
  }
}
