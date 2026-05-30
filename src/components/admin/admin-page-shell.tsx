"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AdminPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminPageShell({ title, description, children }: AdminPageShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%),#070712] px-5 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <Link className="text-sm text-sky-300 hover:text-white" href="/admin">
          ← Admin portal
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-sky-200/70">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 max-w-3xl text-slate-400">{description}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
