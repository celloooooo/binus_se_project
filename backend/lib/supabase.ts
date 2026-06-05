import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

// 1. Create a custom storage wrapper that is safe for Server-Side Rendering (SSR)
const serverSafeStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web" && typeof window === "undefined") {
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

const supabaseUrl = "https://cjsykzffuvfauatersji.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3lremZmdXZmYXVhdGVyc2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MTQ1ODIsImV4cCI6MjA5NTA5MDU4Mn0.D-gbLEE3GPmaAcb3aj1tKspHqdNcHEHp8Ju9i0meD-A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 2. Use the wrapper instead of AsyncStorage directly
    storage: serverSafeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
