import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/admin-session";

function isAdminAuthed(request: NextRequest) {
  const raw = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { username?: string };
    return Boolean(parsed.username?.trim());
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/auth/admin")) {
    if (pathname === "/admin/login" && isAdminAuthed(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const isProtectedPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isProtectedStaff = pathname === "/staff" || pathname.startsWith("/staff/");
  const isProtectedApi =
    pathname === "/api/punch/create" ||
    pathname.startsWith("/api/staff/") ||
    pathname === "/api/scan/validate";

  if (!isProtectedPage && !isProtectedStaff && !isProtectedApi) {
    return NextResponse.next();
  }

  if (isAdminAuthed(request)) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ ok: false, code: "UNAUTHORIZED", message: "Admin login required." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/staff",
    "/staff/:path*",
    "/api/punch/:path*",
    "/api/staff/:path*",
    "/api/scan/:path*",
  ],
};
