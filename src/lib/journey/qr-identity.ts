/** Scannable payload prefix — used when parsing legacy text QRs. */
export const QR_PAYLOAD_PREFIX = "MOON-JOURNEY";

export function buildQrPublicId(phone?: string) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (digits.length >= 4) {
    return `MJ-QR-${digits.slice(-4)}`;
  }
  return "MJ-QR-NEW";
}

/** URL opened when a phone scans the customer QR code — signs in and opens the dashboard. */
export function buildQrProfileUrl(baseUrl: string, phone?: string, name?: string) {
  const qrPublicId = buildQrPublicId(phone);
  const params = new URLSearchParams({ qr: qrPublicId });

  const digits = phone?.replace(/\D/g, "") ?? "";
  if (digits) params.set("phone", digits);
  if (name?.trim()) params.set("name", name.trim());

  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}/customer/profile?${params.toString()}`;
}

/** Legacy plain-text payload (kept for staff API parsing). */
export function buildQrPayload(phone?: string, name?: string) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  const qrPublicId = buildQrPublicId(phone);
  const safeName = name?.trim().replace(/\|/g, " ") ?? "";

  if (!digits) {
    return `${QR_PAYLOAD_PREFIX}|${qrPublicId}`;
  }

  return `${QR_PAYLOAD_PREFIX}|${qrPublicId}|${digits}|${safeName}`;
}

export function parseQrPayload(payload: string) {
  if (payload.startsWith(`${QR_PAYLOAD_PREFIX}|`)) {
    const [, qr, phone, name] = payload.split("|");
    return { qr, phone, name };
  }

  try {
    const url = new URL(payload);
    return {
      qr: url.searchParams.get("qr") ?? undefined,
      phone: url.searchParams.get("phone") ?? undefined,
      name: url.searchParams.get("name") ?? undefined,
    };
  } catch {
    return { qr: payload, phone: undefined, name: undefined };
  }
}
