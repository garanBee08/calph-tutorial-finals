// supabaseClient.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://sjevsjchglepgctehvrr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXZzamNoZ2xlcGdjdGVodnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTIzMzIsImV4cCI6MjA3NzEyODMzMn0.UpDnIBBQHC3R65uOGtnIN_5jOr40Zs2lAfOEdY1J45A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
