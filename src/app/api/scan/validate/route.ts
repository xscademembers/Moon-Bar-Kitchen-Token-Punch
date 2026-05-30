import { NextResponse } from "next/server";
import { z } from "zod";

const validateScanSchema = z.object({
  qrPublicId: z.string().min(8),
  staffUserId: z.string().uuid(),
  branchCode: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = validateScanSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "INVALID_SCAN_PAYLOAD", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    code: "SCAN_VALIDATED",
    data: parsed.data,
  });
}

