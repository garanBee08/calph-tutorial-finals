// dashboard.js - Combined progress and leaderboard for dashboard
import { supabase } from "./supabaseClient.js";

// ==================== PROGRESS FUNCTIONS ====================

// Progress ring animation
function animateProgressRing(ringElement, percentage) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  ringElement.style.strokeDasharray = `${circumference} ${circumference}`;
  ringElement.style.strokeDashoffset = circumference;
  
  // Trigger animation after a brief delay
  setTimeout(() => {
    ringElement.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
    ringElement.style.strokeDashoffset = offset;
  }, 100);
}

// Animate percentage text counting up
function animatePercentageText(textElement, targetPercentage) {
  let currentPercentage = 0;
  const duration = 1500; // 1.5 seconds
  const increment = targetPercentage / (duration / 16); // 60fps
  
  const interval = setInterval(() => {
    currentPercentage += increment;
    if (currentPercentage >= targetPercentage) {
      currentPercentage = targetPercentage;
      clearInterval(interval);
    }
    textElement.textContent = `${Math.round(currentPercentage)}%`;
  }, 16);
}

// Calculate progress percentage from boolean fields
function calculateProgress(progressData, fields) {
  if (!progressData) return 0;
  
  const completedCount = fields.filter(field => progressData[field] === true).length;
  const totalCount = fields.length;
  
  return Math.round((completedCount / totalCount) * 100);
}

// Load and display progress for a specific lesson
async function loadLessonProgress(userId, tableName, ringId, textId, lessonProgressId, fields) {
  try {
    console.log(`📊 Loading progress for ${tableName}, user: ${userId}`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error(`❌ Error loading ${tableName}:`, error);
      return 0;
    }

    console.log(`✅ Data from ${tableName}:`, data);
    
    const percentage = calculateProgress(data, fields);
    console.log(`📈 Calculated percentage for ${tableName}: ${percentage}%`);
    
    // Update progress ring
    const ringElement = document.getElementById(ringId);
    if (ringElement) {
      animateProgressRing(ringElement, percentage);
      console.log(`🎨 Updated ring: ${ringId}`);
    } else {
      console.warn(`⚠️ Ring element not found: ${ringId}`);
    }
    
    // Update percentage text
    const textElement = document.getElementById(textId);
    if (textElement) {
      animatePercentageText(textElement, percentage);
      console.log(`📝 Updated text: ${textId}`);
    } else {
      console.warn(`⚠️ Text element not found: ${textId}`);
    }
    
    // Update lesson card progress
    const lessonProgressElement = document.getElementById(lessonProgressId);
    if (lessonProgressElement) {
      lessonProgressElement.textContent = `${percentage}% Complete`;
      console.log(`✨ Updated lesson progress: ${lessonProgressId}`);
    } else {
      console.warn(`⚠️ Lesson progress element not found: ${lessonProgressId}`);
    }
    
    return percentage;
    
  } catch (err) {
    console.error(`💥 Unexpected error loading ${tableName}:`, err);
    return 0;
  }
}

// Main function to load all progress
async function loadAllProgress() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      setDefaultProgress();
      return;
    }

    if (!session?.user) {
      console.log("No user logged in");
      setDefaultProgress();
      return;
    }

    const userId = session.user.id;

    // Load both lessons' progress with their specific fields
    await Promise.all([
      loadLessonProgress(
        userId, 
        'measurement_progress', 
        'measurement-ring', 
        'measurement-progress',
        'measurement-lesson-progress',
        ['topic1', 'topic2', 'topic3', 'topic4', 'quiz1', 'quiz2'] // 4 topics + 2 quizzes
      ),
      loadLessonProgress(
        userId, 
        'vectors_progress', 
        'vector-ring', 
        'vector-progress',
        'vector-lesson-progress',
        ['topic1', 'topic2', 'topic3', 'quiz3', 'quiz4'] // 3 topics + quiz3 & quiz4
      )
    ]);

  } catch (err) {
    console.error("Error loading progress:", err);
    setDefaultProgress();
  }
}

// Set default progress values (0%)
function setDefaultProgress() {
  ['measurement-progress', 'vector-progress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0%';
  });
  
  ['measurement-ring', 'vector-ring'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const circumference = 2 * Math.PI * 50;
      el.style.strokeDasharray = `${circumference} ${circumference}`;
      el.style.strokeDashoffset = circumference;
    }
  });
  
  ['measurement-lesson-progress', 'vector-lesson-progress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0% Complete';
  });
}

// ==================== LEADERBOARD FUNCTIONS ====================

async function loadDashboardLeaderboard() {
  const podiumContainer = document.querySelector(".podium-container");
  
  if (!podiumContainer) {
    console.log("Podium container not found");
    return;
  }

  try {
    // Fetch all leaderboard data
    const { data, error } = await supabase
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

    if (error) {
      console.error("Error fetching leaderboard:", error);
      podiumContainer.innerHTML = `<p style="text-align:center; color:#fff; opacity:0.8;">Unable to load leaderboard.</p>`;
      return;
    }

    if (!data || data.length === 0) {
      podiumContainer.innerHTML = `<p style="text-align:center; color:#fff; opacity:0.8;">No leaderboard data yet.</p>`;
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
        };
      }
      grouped[id].score += row.score;
    });

    // Sort by score and get top 3
    const leaderboard = Object.values(grouped)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Render top 3
    renderDashboardLeaderboard(leaderboard, podiumContainer);

  } catch (err) {
    console.error("Unexpected error loading leaderboard:", err);
    podiumContainer.innerHTML = `<p style="text-align:center; color:#fff; opacity:0.8;">Error loading leaderboard.</p>`;
  }
}

function renderDashboardLeaderboard(top3, container) {
  if (top3.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#fff; opacity:0.8;">No data available.</p>`;
    return;
  }

  // Display in proper order: 1st, 2nd, 3rd
  const displayOrder = [
    top3[0] || null, // 1st place
    top3[1] || null, // 2nd place  
    top3[2] || null  // 3rd place
  ];

  const positions = ['first', 'second', 'third'];

  const podiumHTML = displayOrder
    .map((user, index) => {
      if (!user) {
        return `
          <div class="podium ${positions[index]}" style="opacity: 0.3;">
            <div class="podium-pic"></div>
            <div class="podium-info">
              <p class="name">---</p>
              <p class="username">@---</p>
            </div>
            <div class="podium-rank"></div>
          </div>
        `;
      }

      return `
        <div class="podium ${positions[index]}">
          <img src="/assets/images/profile_placeholder.png" class="podium-pic" alt="${user.name}">
          <div class="podium-info">
            <p class="name">${user.name}</p>
            <p class="username">@${user.username}</p>
          </div>
          <div class="podium-rank"></div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = podiumHTML;
}

// ==================== INITIALIZATION ====================

let dashboardInitialized = false;

async function initializeDashboard() {
  if (dashboardInitialized) return;
  dashboardInitialized = true;

  // Load both progress and leaderboard
  await Promise.all([
    loadAllProgress(),
    loadDashboardLeaderboard()
  ]);

  // Reload on auth state changes
  supabase.auth.onAuthStateChange(async (event) => {
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
      await Promise.all([
        loadAllProgress(),
        loadDashboardLeaderboard()
      ]);
    } else if (event === "SIGNED_OUT") {
      setDefaultProgress();
      const podiumContainer = document.querySelector(".podium-container");
      if (podiumContainer) {
        podiumContainer.innerHTML = `<p style="text-align:center; color:#fff; opacity:0.8;">Please log in to view leaderboard.</p>`;
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
  initializeDashboard();
}

export { loadAllProgress, loadDashboardLeaderboard, calculateProgress };