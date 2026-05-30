import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  let supabase: { ok: boolean; message?: string; count?: number } = { ok: false };

  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();
      const { count, error } = await admin
        .from("customer_punches")
        .select("id", { count: "exact", head: true });

      if (error) {
        supabase = { ok: false, message: error.message };
      } else {
        supabase = { ok: true, count: count ?? 0 };
      }
    } catch (error) {
      supabase = {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown Supabase error",
      };
    }
  } else {
    supabase = { ok: false, message: "Supabase not configured" };
  }

  return NextResponse.json({
    ok: true,
    service: "moon-journey",
    supabase,
    timestamp: new Date().toISOString(),
  });
}

