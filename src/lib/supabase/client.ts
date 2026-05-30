import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";

export function createClient() {
  if (!isSupabaseConfigured() || !getSupabaseAnonKey()) {
    throw new Error("Supabase browser client is not configured.");
  }

  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
