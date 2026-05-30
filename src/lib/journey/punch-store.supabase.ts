import { createAdminClient } from "@/lib/supabase/admin";
import { fromPhoneE164, toPhoneE164 } from "@/lib/supabase/phone";
import { findCustomerByPhoneSupabase, upsertCustomerSupabase } from "@/lib/customers/customer-store.supabase";
import type { SlotCode } from "@/lib/journey/slots";
import {
  buildRecentActivity,
  calculateProgress,
  getTodayDateString,
  type CustomerProgress,
  type PunchRecord,
} from "@/lib/journey/progress";

function formatSupabaseError(error: { message?: string; details?: string; hint?: string; code?: string }) {
  return [error.message, error.details, error.hint, error.code].filter(Boolean).join(" — ");
}

type DbCustomerJoin = {
  phone_e164: string;
  display_name: string | null;
};

type DbPunchRow = {
  id: string;
  customer_id: string;
  punch_date: string;
  slot_code: SlotCode;
  branch_code: string;
  created_at: string;
  customers: DbCustomerJoin | DbCustomerJoin[] | null;
};

function getJoinedCustomer(customers: DbPunchRow["customers"]): DbCustomerJoin | null {
  if (!customers) return null;
  return Array.isArray(customers) ? (customers[0] ?? null) : customers;
}

function mapPunch(row: DbPunchRow): PunchRecord {
  const customer = getJoinedCustomer(row.customers);
  return {
    id: row.id,
    phone: fromPhoneE164(customer?.phone_e164 ?? ""),
    name: customer?.display_name?.trim() ?? "",
    slotCode: row.slot_code,
    punchDate: row.punch_date,
    branchCode: row.branch_code,
    createdAt: row.created_at,
  };
}

async function getCustomerPunches(phone: string) {
  const admin = createAdminClient();
  const phoneE164 = toPhoneE164(phone);

  const { data, error } = await admin
    .from("customer_punches")
    .select(
      "id, customer_id, punch_date, slot_code, branch_code, created_at, customers!inner(phone_e164, display_name)",
    )
    .eq("customers.phone_e164", phoneE164)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  return (data as DbPunchRow[]).map(mapPunch);
}

export async function getCustomerProgressSupabase(phone: string): Promise<CustomerProgress> {
  const customerPunches = await getCustomerPunches(phone);
  const today = getTodayDateString(process.env.NEXT_PUBLIC_APP_TIMEZONE);
  const todayPunches = customerPunches.filter((punch) => punch.punchDate === today);
  const { level, stage, progressPercent } = calculateProgress(customerPunches.length);

  return {
    level,
    stage,
    progressPercent,
    totalPunches: customerPunches.length,
    todayPunches,
    recentActivity: buildRecentActivity(customerPunches),
  };
}

export async function createPunchSupabase(input: {
  phone: string;
  name: string;
  slotCode: SlotCode;
  branchCode?: string;
}): Promise<{ ok: true; punch: PunchRecord } | { ok: false; code: string; message: string }> {
  const admin = createAdminClient();
  const customer = await upsertCustomerSupabase(input.phone, input.name);
  const punchDate = getTodayDateString(process.env.NEXT_PUBLIC_APP_TIMEZONE);

  const { data: existing, error: lookupError } = await admin
    .from("customer_punches")
    .select("id")
    .eq("customer_id", customer.id!)
    .eq("punch_date", punchDate)
    .eq("slot_code", input.slotCode)
    .maybeSingle();

  if (lookupError) {
    throw new Error(formatSupabaseError(lookupError));
  }

  if (existing) {
    return {
      ok: false,
      code: "DUPLICATE_SLOT_PUNCH",
      message: `Customer already punched for ${input.slotCode} today.`,
    };
  }

  const { data, error } = await admin
    .from("customer_punches")
    .insert({
      customer_id: customer.id!,
      punch_date: punchDate,
      slot_code: input.slotCode,
      branch_code: input.branchCode ?? "moon-bar",
    })
    .select(
      "id, customer_id, punch_date, slot_code, branch_code, created_at, customers!inner(phone_e164, display_name)",
    )
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return {
        ok: false,
        code: "DUPLICATE_SLOT_PUNCH",
        message: `Customer already punched for ${input.slotCode} today.`,
      };
    }
    throw new Error(formatSupabaseError(error) || "Could not save punch to Supabase.");
  }

  return { ok: true, punch: mapPunch(data as DbPunchRow) };
}

export async function getTodayPunchCountSupabase() {
  const admin = createAdminClient();
  const today = getTodayDateString(process.env.NEXT_PUBLIC_APP_TIMEZONE);

  const { count, error } = await admin
    .from("customer_punches")
    .select("id", { count: "exact", head: true })
    .eq("punch_date", today);

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  return count ?? 0;
}

export async function findCustomerFromPunchesSupabase(phone: string) {
  const customer = await findCustomerByPhoneSupabase(phone);
  if (customer?.name) {
    return { phone: customer.phone, name: customer.name };
  }

  const admin = createAdminClient();
  const phoneE164 = toPhoneE164(phone);

  const { data, error } = await admin
    .from("customer_punches")
    .select("created_at, customers!inner(phone_e164, display_name)")
    .eq("customers.phone_e164", phoneE164)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  if (!data) return null;

  const punchCustomer = getJoinedCustomer((data as DbPunchRow).customers);
  const name = punchCustomer?.display_name?.trim();
  if (!punchCustomer || !name) return null;

  return {
    phone: fromPhoneE164(punchCustomer.phone_e164),
    name,
  };
}
