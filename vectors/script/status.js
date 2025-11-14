import { supabase } from "./supabaseClient.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (!user) return;

  // Fetch progress for both lessons
  const [measurement, vectors] = await Promise.all([
    fetchProgress("measurement_progress", user.id),
    fetchProgress("vectors_progress", user.id)
  ]);

  // Update status icons
  updateLessonStatus(measurement, "m");
  updateLessonStatus(vectors, "v");
});

// ✅ Get current user
async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error("User not found:", error);
    return null;
  }
  return data.user;
}

// ✅ Fetch progress data from Supabase
async function fetchProgress(tableName, userId) {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(`Error fetching ${tableName}:`, error);
    return {};
  }
  return data || {};
}

// ✅ Update topic and quiz statuses dynamically
function updateLessonStatus(progress, prefix) {
  if (!progress) return;

  Object.keys(progress).forEach((key) => {
    if (key.startsWith("topic") || key.startsWith("quiz")) {
      const element = document.getElementById(`status-${prefix}-${key}`);
      if (element) {
        element.style.backgroundImage = progress[key]
          ? "url(/vectors/assets/images/check.png)"
          : "url(/vectors/assets/images/not_check.png)";
      }
    }
  });
}
