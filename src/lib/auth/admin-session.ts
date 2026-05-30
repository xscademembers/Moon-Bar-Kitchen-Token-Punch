import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "moon_admin_session";

export type AdminSession = {
  username: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    const username = parsed.username?.trim();
    if (!username) return null;
    return { username };
  } catch {
    return null;
  }
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  return username === expectedUsername && password === expectedPassword;
}
