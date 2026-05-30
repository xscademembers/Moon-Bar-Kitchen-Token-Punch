import { createAdminClient } from "@/lib/supabase/admin";
import { fromPhoneE164, toPhoneE164 } from "@/lib/supabase/phone";
import type { CustomerRecord } from "@/lib/customers/customer-store";

type DbCustomer = {
  id: string;
  phone_e164: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

function mapCustomer(row: DbCustomer): CustomerRecord {
  return {
    id: row.id,
    phone: fromPhoneE164(row.phone_e164),
    name: row.display_name?.trim() ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertCustomerSupabase(phone: string, name: string) {
  const admin = createAdminClient();
  const phoneE164 = toPhoneE164(phone);
  const now = new Date().toISOString();

  const { data, error } = await admin
    .from("customers")
    .upsert(
      {
        phone_e164: phoneE164,
        display_name: name.trim(),
        updated_at: now,
      },
      { onConflict: "phone_e164" },
    )
    .select("id, phone_e164, display_name, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not save customer to Supabase.");
  }

  return mapCustomer(data as DbCustomer);
}

export async function findCustomerByPhoneSupabase(phone: string) {
  const admin = createAdminClient();
  const phoneE164 = toPhoneE164(phone);

  const { data, error } = await admin
    .from("customers")
    .select("id, phone_e164, display_name, created_at, updated_at")
    .eq("phone_e164", phoneE164)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapCustomer(data as DbCustomer) : null;
}

export async function getCustomerIdByPhone(phone: string) {
  const customer = await findCustomerByPhoneSupabase(phone);
  return customer?.id ?? null;
}
