import { supabase } from "./supabaseClient.js";

const leaderboardContainer = document.getElementById("leaderboardContent");
const overallBtn = document.getElementById("overallBtn");
const measurementsBtn = document.getElementById("measurementsBtn");
const vectorsBtn = document.getElementById("vectorsBtn");

async function fetchLeaderboard(mode = "overall") {
  leaderboardContainer.innerHTML = `<p style="text-align:center; color:#fff; opacity:0.8;">Loading leaderboard...</p>`;

  let query = supabase
    .from("vectors_leaderboard")
    .select(`
      user_id,
      score,
      correct,
      wrong,
      quiz_number,
      profiles (
        name,
        username
      )
    `);

  if (mode === "measurements") query = query.in("quiz_number", [1, 2]);
  if (mode === "vectors") query = query.in("quiz_number", [3, 4]);

  const { data, error } = await query;

  if (error) {
    console.error("❌ Error fetching leaderboard:", error);
    leaderboardContainer.innerHTML = `<p style="text-align:center; color:red;">Error loading leaderboard.</p>`;
    return;
  }

  if (!data || data.length === 0) {
    leaderboardContainer.innerHTML = `<p style="text-align:center; color:#fff; opacity:0.8;">No leaderboard data yet.</p>`;
    return;
  }

  // Group scores by user_id
  const grouped = {};
  data.forEach((row) => {
    const id = row.user_id;
    if (!grouped[id]) {
      grouped[id] = {
        id,
        name: row.profiles?.name || "Anonymous",
        username: row.profiles?.username || "unknown",
        score: 0,
        correct: 0,
        wrong: 0,
      };
    }
    grouped[id].score += row.score;
    grouped[id].correct += row.correct;
    grouped[id].wrong += row.wrong;
  });

  const leaderboard = Object.values(grouped).sort((a, b) => b.score - a.score);
  renderLeaderboard(leaderboard);
}

function renderLeaderboard(list) {
  leaderboardContainer.innerHTML = "";

  // Top 3 podium (new structure)
  const top3 = list.slice(0, 3);
  const others = list.slice(3);

  // Only show podium if we have at least 1 person
  if (top3.length > 0) {
    // Create array with 3 slots, filling empty ones with null
    const podiumData = [
      top3[1] || null, // 2nd place (left)
      top3[0] || null, // 1st place (center)
      top3[2] || null  // 3rd place (right)
    ];
    const podiumClasses = ['podium2', 'podium1', 'podium3'];

    const podiumHTML = `
      <div class="podium-wrapper">
        ${podiumData
          .map((p, i) => {
            if (!p) {
              // Empty podium slot
              return `
              <div class="podium-slot ${podiumClasses[i]}" style="opacity: 0.3;">
                <div class="podium-box">
                  <div class="podium-trapeziod"></div>
                  <div class="podium-fill"></div>
                </div>
              </div>
            `;
            }
            return `
            <div class="podium-slot ${podiumClasses[i]}">
              <div class="podium-profile">
                <img src="/vectors/assets/images/profile_placeholder.png" class="pic-podium" alt="${p.name}">
                <h3 class="user-name">${p.name}</h3>
              </div>
              <div class="podium-box">
                <div class="podium-trapeziod"></div>
                <div class="podium-fill">
                  <p class="podium-score">${p.score}</p>
                  <p class="podium-score-label">Points</p>
                </div>
                <div class="rank-medal"></div>
              </div>
            </div>

            
            
          `;
          })
          .join("")}
      </div>
    `;

    leaderboardContainer.innerHTML = podiumHTML;
  }

  // Rest of the leaderboard (4th+)
  if (others.length > 0) {
    const tableHTML = `
      <div class="ninetyseven-container">
        <div class="ninetyseven-header">
          <span>Rank</span>
          <span class="rank-username">Username</span>
          <span>Points</span>
        </div>
        ${others
          .map((user, i) => `
            <div class="leaderboard-row">
              <div class="rank">${i + 4}</div>
              <div class="user-info">
                <img src="/vectors/assets/images/profile_placeholder.png" class="leaderboard-pic" alt="${user.name}">
                <div class="user-text">
                  <div class="name">${user.name}</div>
                  <div class="username">@${user.username}</div>
                </div>
              </div>
              <div class="points-box">${user.score}</div>
            </div>
          `)
          .join("")}
      </div>
    `;
    
    leaderboardContainer.innerHTML += tableHTML;
  }
}

// Tab switching
function activateTab(selected) {
  [overallBtn, measurementsBtn, vectorsBtn].forEach((btn) => btn.classList.remove("active"));
  selected.classList.add("active");
}

overallBtn.addEventListener("click", () => {
  activateTab(overallBtn);
  fetchLeaderboard("overall");
});

measurementsBtn.addEventListener("click", () => {
  activateTab(measurementsBtn);
  fetchLeaderboard("measurements");
});

vectorsBtn.addEventListener("click", () => {
  activateTab(vectorsBtn);
  fetchLeaderboard("vectors");
});

// Default load
fetchLeaderboard("overall");