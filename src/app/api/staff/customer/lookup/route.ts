import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/admin-session";
import { normalizePhone } from "@/lib/phone";
import { findCustomerByPhone, upsertCustomer } from "@/lib/customers/customer-store";
import { findCustomerFromPunches, getCustomerProgress } from "@/lib/journey/punch-store";
import { buildQrPublicId } from "@/lib/journey/qr-identity";

const lookupSchema = z.object({
  phone: z.string().trim().min(10),
});

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ ok: false, code: "UNAUTHORIZED", message: "Admin login required." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = lookupSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "INVALID_PHONE" }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  let customer = await findCustomerByPhone(phone);

  if (!customer) {
    const fromPunches = await findCustomerFromPunches(phone);
    if (fromPunches) {
      customer = await upsertCustomer(fromPunches.phone, fromPunches.name);
    }
  }

  if (!customer) {
    return NextResponse.json(
      {
        ok: false,
        code: "CUSTOMER_NOT_FOUND",
        message: "No customer found with this number. Ask them to sign in at the Customer portal first.",
      },
      { status: 404 },
    );
  }

  const progress = await getCustomerProgress(phone);

  return NextResponse.json({
    ok: true,
    data: {
      name: customer.name,
      phone: customer.phone,
      qr: buildQrPublicId(phone),
      level: progress.level,
      stage: progress.stage,
      totalPunches: progress.totalPunches,
      todayPunches: progress.todayPunches.length,
    },
  });
}
