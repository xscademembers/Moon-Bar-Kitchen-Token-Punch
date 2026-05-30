import Link from "next/link";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { Panel, StatCard } from "@/components/admin/admin-page-shell";
import { getTodayPunchCount } from "@/lib/journey/punch-store";

export const dynamic = "force-dynamic";

const adminOptions = [
  {
    title: "Staff Punch",
    description: "Find customer by mobile number and create time-slot punches.",
    href: "/staff/scan",
  },
  {
    title: "Staff Redeem",
    description: "Redeem customer rewards once with confirmation and audit trail.",
    href: "/staff/redeem",
  },
  {
    title: "Analytics",
    description: "DAU/WAU/MAU, retention cohorts, journey drop-off, and reward funnel metrics.",
    href: "/admin/analytics",
  },
  {
    title: "Fraud Monitor",
    description: "Duplicate scans, velocity anomalies, suspicious staff activity, and blocked attempts.",
    href: "/admin/fraud",
  },
  {
    title: "Configuration",
    description: "Slot windows, stage thresholds, reward catalog, and secret reward rules.",
    href: "/admin/config",
  },
];

export default async function AdminPortalPage() {
  let todayPunches = 0;

  try {
    todayPunches = await getTodayPunchCount();
  } catch (error) {
    console.error("Could not load today's punch count from Supabase:", error);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%),#070712] px-5 py-10 text-white">
      <section className="mx-auto max-w-4xl">
        <Link className="text-sm text-sky-300 hover:text-white" href="/">
          ← Back to home
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-sky-200/70">Admin Portal</p>
        <h1 className="mt-2 text-3xl font-semibold">Operations & Control</h1>
        <p className="mt-3 text-slate-400">Analytics, fraud, config, and staff punch/redeem tools.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard hint="Today" label="Active customers" value="0" />
          <StatCard hint="Today" label="Punches" value={String(todayPunches)} />
          <StatCard hint="Issued" label="Rewards" value="0" />
          <StatCard hint="Blocked" label="Fraud alerts" value="0" />
        </div>

        <Panel title="Quick overview">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Journey progress</p>
              <p className="mt-1 font-medium">Most customers at Level 1 · Stage 1</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Today&apos;s slots</p>
              <p className="mt-1 font-medium">Morning · Afternoon · Night windows active</p>
            </div>
          </div>
        </Panel>

        <div className="mt-8 space-y-4">
          {adminOptions.map((option) => (
            <Link
              className="block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-sky-300/30 hover:bg-white/[0.07]"
              href={option.href}
              key={option.title}
            >
              <h2 className="text-lg font-medium text-white">{option.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{option.description}</p>
            </Link>
          ))}
          <AdminSignOutButton />
        </div>
      </section>
    </main>
  );
}
