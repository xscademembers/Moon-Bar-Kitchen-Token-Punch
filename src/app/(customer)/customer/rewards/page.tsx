import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/auth/customer-session";

export default async function CustomerRewardsPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/customer/login");

  return (
    <main className="min-h-screen bg-[#070712] px-5 py-10">
      <section className="mx-auto max-w-3xl">
        <Link className="text-sm text-violet-300 hover:text-white" href="/customer">
          ← Customer portal
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-white">My Rewards</h1>
        <p className="mt-2 text-slate-400">
          {session.name}, your rewards will appear here after you collect punches.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
          <p className="text-slate-400">No rewards yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Collect punches and progress through moon stages to unlock your first reward.
          </p>
        </div>
      </section>
    </main>
  );
}
