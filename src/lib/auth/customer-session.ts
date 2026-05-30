import { cookies } from "next/headers";
import { normalizePhone } from "@/lib/phone";

export const CUSTOMER_SESSION_COOKIE = "moon_customer_session";

export type CustomerSession = {
  name: string;
  phone: string;
};

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CustomerSession;
    const name = parsed.name?.trim();
    const phone = normalizePhone(parsed.phone ?? "");

    if (!name || !phone || phone.length < 10) return null;

    return { name, phone };
  } catch {
    return null;
  }
}
