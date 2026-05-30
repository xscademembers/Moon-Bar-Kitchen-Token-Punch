import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin-session";
import { createPunch } from "@/lib/journey/punch-store";
import { getCurrentHourInTimezone, resolveSlotFromHour } from "@/lib/journey/slots";

const createPunchSchema = z.object({
  phone: z.string().trim().min(10),
  name: z.string().trim().min(2),
  branchCode: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json(
      { ok: false, code: "UNAUTHORIZED", message: "Admin login required to record punches." },
      { status: 401 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = createPunchSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "INVALID_PUNCH_PAYLOAD", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const slotCode = resolveSlotFromHour(getCurrentHourInTimezone());
  const result = await createPunch({
    phone: parsed.data.phone,
    name: parsed.data.name,
    slotCode,
    branchCode: parsed.data.branchCode,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, code: result.code, message: result.message },
      { status: 409 },
    );
  }

  return NextResponse.json({
    ok: true,
    code: "PUNCH_CREATED",
    data: result.punch,
  });
}
