import { buildQrPublicId } from "@/lib/journey/qr-identity";
import { normalizePhone } from "@/lib/phone";

export type QrSignInParams = {
  name: string;
  phone: string;
  qr: string;
};

export function parseQrSignInParams(
  qr: string | null | undefined,
  phone: string | null | undefined,
  name: string | null | undefined,
): QrSignInParams | null {
  const displayName = name?.trim();
  const normalizedPhone = phone ? normalizePhone(phone) : "";

  if (!displayName || !normalizedPhone || normalizedPhone.length < 10 || !qr?.trim()) {
    return null;
  }

  if (qr.trim() !== buildQrPublicId(normalizedPhone)) {
    return null;
  }

  return { name: displayName, phone: normalizedPhone, qr: qr.trim() };
}

export function buildQrSignInQuery(params: QrSignInParams) {
  return new URLSearchParams({
    qr: params.qr,
    phone: params.phone,
    name: params.name,
  }).toString();
}
