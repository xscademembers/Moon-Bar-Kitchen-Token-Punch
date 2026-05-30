import { normalizePhone } from "@/lib/phone";

/** Store Indian mobiles as +91XXXXXXXXXX in Supabase. */
export function toPhoneE164(phone: string) {
  const digits = normalizePhone(phone);
  return digits.startsWith("+") ? digits : `+91${digits}`;
}

export function fromPhoneE164(phoneE164: string) {
  return normalizePhone(phoneE164);
}
