import { supabase } from '/script/supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const buttons = document.querySelectorAll('.mark-complete-btn');
  const user = await getUser();
  if (!user) return;

  const tables = ['measurement_progress', 'vectors_progress'];
  const progressData = {};

  // ✅ Load progress data
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) progressData[table] = data;
  }

  // ✅ Initialize buttons
  buttons.forEach((btn) => {
    const table = btn.dataset.table;
    const topic = btn.dataset.topic;
    const currentState = progressData[table]?.[topic] || false;
    updateButton(btn, currentState);

    btn.addEventListener('click', async () => {
      btn.classList.add('loading');

      // ✅ Ensure record exists
      if (!progressData[table]) {
        const { error: insertError } = await supabase
          .from(table)
          .insert([{ user_id: user.id, [topic]: true }]);

        if (insertError) {
          console.error('Insert error:', insertError);
          alert('Error saving progress.');
          btn.classList.remove('loading');
          return;
        }

        progressData[table] = { user_id: user.id, [topic]: true };
        updateButton(btn, true);
        btn.classList.remove('loading');
        return;
      }

      // ✅ Toggle progress
      const currentValue = progressData[table]?.[topic] || false;
      const newValue = !currentValue;

      const { error } = await supabase
        .from(table)
        .update({ [topic]: newValue })
        .eq('user_id', user.id);

      if (error) {
        console.error('Update error:', error);
        alert('Error updating progress.');
        btn.classList.remove('loading');
        return;
      }

      setTimeout(() => {
        btn.classList.remove('loading');
        progressData[table][topic] = newValue;
        updateButton(btn, newValue);
      }, 400);
    });
  });
});

// ✅ Helpers
function updateButton(btn, isComplete) {
  if (isComplete) {
    btn.innerHTML = `<span class="material-symbols-rounded">check_circle</span> Lesson Completed`;
    btn.classList.add('completed');
  } else {
    btn.innerHTML = `Mark Complete`;
    btn.classList.remove('completed');
  }
}

async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
