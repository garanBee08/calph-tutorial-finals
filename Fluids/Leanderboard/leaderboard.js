// Leaderboard Management
const leaderboardTable = document.getElementById('leaderboard-table');

// Load and display leaderboard from Supabase
async function loadLeaderboard() {
  try {
    // First, try to join with profiles table using Supabase's join syntax
    // This works if there's a foreign key relationship
    let { data, error } = await supabase
      .from('fluids_leaderboard')
      .select('*, profiles(username)')
      .order('score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100);
    
    // If join fails (no foreign key relationship), fetch separately and merge
    if (error) {
      console.warn('Join failed, fetching separately:', error.message);
      
      // Fetch leaderboard data
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('fluids_leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (leaderboardError) {
        throw leaderboardError;
      }
      
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username');
      
      if (profilesError) {
        console.warn('Could not fetch profiles:', profilesError.message);
      }
      
      // Create a map of user_id to username
      const usernameMap = {};
      if (profilesData) {
        profilesData.forEach(profile => {
          usernameMap[profile.user_id] = profile.username;
        });
      }
      
      // Merge username into leaderboard data
      data = leaderboardData.map(entry => ({
        ...entry,
        profiles: usernameMap[entry.user_id] ? { username: usernameMap[entry.user_id] } : null
      }));
      
      error = null;
    }

    if (error) {
      console.error('Error loading scores from Supabase:', error);
      console.error('Error details:', error.message);
      leaderboardTable.innerHTML = `
        <div class="empty-state">
          <h3>Error Loading Scores</h3>
          <p>Unable to load leaderboard. Please try again later.</p>
        </div>
      `;
      return;
    }

    if (!data || data.length === 0) {
      console.log('No scores found in Supabase');
      leaderboardTable.innerHTML = `
        <div class="empty-state">
          <h3>No Scores Yet!</h3>
          <p>Be the first to take the quiz and claim the top spot!</p>
        </div>
      `;
      return;
    }

    console.log('Successfully loaded scores from Supabase!');
    console.log('Number of scores:', data.length);
    console.log('Scores data:', data);
    
    // Display leaderboard
    displayScores(data);
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
    leaderboardTable.innerHTML = `
      <div class="empty-state">
        <h3>Error Loading Scores</h3>
        <p>Unable to connect to Supabase. Please check your connection and try again.</p>
      </div>
    `;
  }
}

// Display scores in the leaderboard
function displayScores(scores) {
  let html = '';
  scores.forEach((entry, index) => {
    const rank = index + 1;
    const topClass = rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : '';
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    
    // Get username from profiles table, fallback to user_id if not available
    let displayName = 'Player';
    if (entry.profiles && entry.profiles.username) {
      // Use username from profiles table
      displayName = entry.profiles.username;
    } else if (entry.user_id) {
      // Fallback to shortened user_id if username not found
      displayName = `Player ${entry.user_id.substring(0, 8)}`;
    }
    
    const score = entry.score || 0;
    // The quiz has 30 questions total
    const total = 30;
    
    html += `
      <div class="leaderboard-item ${topClass}">
        <div class="rank">${medal || rank}</div>
        <div class="player-info">
          <div class="player-name">${escapeHtml(displayName)}</div>
        </div>
        <div class="score">${score}/${total}</div>
      </div>
    `;
  });

  leaderboardTable.innerHTML = html;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load leaderboard on page load
loadLeaderboard();

