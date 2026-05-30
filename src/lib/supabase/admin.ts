import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dns from "node:dns";
import { getSupabaseServiceRoleKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";

dns.setDefaultResultOrder("ipv4first");

let adminClient: SupabaseClient | null = null;

async function serverFetch(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    return await fetch(input, {
      ...init,
      signal: init?.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function createAdminClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local",
    );
  }

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: serverFetch,
      },
    });
  }

  return adminClient;
}
