export function normalizePhone(phone: string) {
  let digits = phone.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

/** Spaced format reduces browser auto-link hydration mismatches on mobile numbers. */
export function formatPhoneDisplay(phone: string) {
  const digits = normalizePhone(phone);
  if (digits.length !== 10) return `+91 ${digits}`;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}
