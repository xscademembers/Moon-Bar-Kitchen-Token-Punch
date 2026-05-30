import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminSession } from "@/lib/auth/admin-session";

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function sanitizeNextPath(next?: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/admin";
  }
  if (next.startsWith("/admin/login")) {
    return "/admin";
  }
  return next;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const { next } = await searchParams;
  const nextPath = sanitizeNextPath(next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%),#070712] px-5 py-10 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
        <Link className="text-sm text-sky-300 hover:text-white" href="/">
          ← Home
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-sky-200/70">Admin Portal</p>
        <h1 className="mt-2 text-2xl font-semibold">Staff sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Only authorized staff can access punch, redeem, analytics, and configuration tools.
        </p>
        <AdminLoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
