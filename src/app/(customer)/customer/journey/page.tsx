import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { LOYALTY_JOURNEY_NAME } from "@/lib/brand";

export default async function CustomerJourneyPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/customer/login");

  return (
    <main className="min-h-screen bg-[#070712] px-5 py-10">
      <section className="mx-auto max-w-4xl">
        <Link className="text-sm text-violet-300 hover:text-white" href="/customer">
          ← Customer portal
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-white">{LOYALTY_JOURNEY_NAME} Map</h1>
        <p className="mt-2 text-slate-400">
          {session.name}, you are at Level 1 · Stage 1. Complete punches to unlock the next stages.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 10 }, (_, level) => (
            <div
              className={`rounded-2xl border p-4 ${
                level === 0
                  ? "border-violet-300/40 bg-violet-400/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
              key={level}
            >
              <p className="text-xs text-violet-300">Level {level + 1}</p>
              <p className="mt-1 text-sm text-slate-400">
                {level === 0 ? "Current · 5 stages" : "Locked"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
