import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Clean trailing slashes or rest/v1 if pasted by mistake
let supabaseUrl = rawUrl.trim();
if (supabaseUrl.endsWith("/rest/v1/")) {
  supabaseUrl = supabaseUrl.replace("/rest/v1/", "");
}
if (supabaseUrl.endsWith("/rest/v1")) {
  supabaseUrl = supabaseUrl.replace("/rest/v1", "");
}
if (supabaseUrl.endsWith("/")) {
  supabaseUrl = supabaseUrl.slice(0, -1);
}

// Fallback placeholder if empty or invalid
if (!supabaseUrl) {
  supabaseUrl = "https://placeholder-project.supabase.co";
}

let client: any;
try {
  client = createClient(supabaseUrl, supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE1OTg5MTg0MDAsImV4cCI6MTg5ODkxODQwMH0.placeholder");
} catch (err) {
  console.error("Failed to initialize Supabase client:", err);
  // Create a mock proxy client to prevent crashes
  client = new Proxy({}, {
    get: () => () => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
      from: () => ({ select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
    })
  });
}

export const supabase = client;

