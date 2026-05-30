"use client";

import { useEffect, useState } from "react";
import { BRAND_NAME } from "@/lib/brand";

type QrAutoSignInProps = {
  name: string;
  phone: string;
};

export function QrAutoSignIn({ name, phone }: QrAutoSignInProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function signIn() {
      const response = await fetch("/api/auth/customer/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (cancelled) return;

      if (!response.ok) {
        setError("Could not sign you in. Please try again from the customer portal.");
        return;
      }

      window.location.assign("/dashboard");
    }

    signIn();

    return () => {
      cancelled = true;
    };
  }, [name, phone]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070712] px-5 py-10 text-white">
      <section className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-red-200">{error}</h1>
            <a className="mt-6 inline-block rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium" href="/customer/login">
              Go to sign in
            </a>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.35em] text-violet-200/80">{BRAND_NAME}</p>
            <h1 className="mt-4 text-2xl font-semibold">Opening your dashboard…</h1>
            <p className="mt-3 text-sm text-slate-400">Welcome back, {name}.</p>
            <div className="mx-auto mt-8 size-10 animate-spin rounded-full border-2 border-violet-300/30 border-t-violet-300" />
          </>
        )}
      </section>
    </main>
  );
}
