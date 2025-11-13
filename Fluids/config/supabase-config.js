// Supabase Configuration
// Replace these values with your Supabase project credentials
// You can find these in your Supabase project settings > API

const SUPABASE_URL = 'https://sjevsjchglepgctehvrr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXZzamNoZ2xlcGdjdGVodnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTIzMzIsImV4cCI6MjA3NzEyODMzMn0.UpDnIBBQHC3R65uOGtnIN_5jOr40Zs2lAfOEdY1J45A';

// Initialize Supabase client
// Wait for Supabase CDN to load, then initialize
let supabase;

function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully');
    return true;
  }
  return false;
}

// Try to initialize immediately
if (!initSupabase()) {
  // If not ready, wait for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    if (!initSupabase()) {
      console.error('Supabase CDN not loaded. Please check your script tags.');
    }
  });
}