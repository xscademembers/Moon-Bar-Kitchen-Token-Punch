import { NextResponse } from "next/server";
import { parseQrSignInParams, buildQrSignInQuery } from "@/lib/auth/qr-sign-in";

/** Legacy redirect — forwards to the customer profile page for mobile-friendly sign-in. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const signIn = parseQrSignInParams(
    searchParams.get("qr"),
    searchParams.get("phone"),
    searchParams.get("name"),
  );

  if (!signIn) {
    return NextResponse.redirect(new URL("/customer/login?error=invalid_qr", request.url));
  }

  return NextResponse.redirect(
    new URL(`/customer/profile?${buildQrSignInQuery(signIn)}`, request.url),
  );
}
