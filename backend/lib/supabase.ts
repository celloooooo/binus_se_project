import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cjsykzffuvfauatersji.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3lremZmdXZmYXVhdGVyc2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MTQ1ODIsImV4cCI6MjA5NTA5MDU4Mn0.D-gbLEE3GPmaAcb3aj1tKspHqdNcHEHp8Ju9i0meD-A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
