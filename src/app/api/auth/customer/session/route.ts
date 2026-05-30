import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertCustomer } from "@/lib/customers/customer-store";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/auth/customer-session";
import { normalizePhone } from "@/lib/phone";

const sessionSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(10),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = sessionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  const session = { name: parsed.data.name.trim(), phone };

  await upsertCustomer(phone, session.name);

  const response = NextResponse.json({ ok: true, data: session });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(CUSTOMER_SESSION_COOKIE);
  return response;
}
