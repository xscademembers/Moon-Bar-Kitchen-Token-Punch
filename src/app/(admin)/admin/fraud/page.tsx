import { AdminPageShell, Panel, StatCard } from "@/components/admin/admin-page-shell";

const fraudRules = [
  "Max 1 punch per slot per customer per day",
  "Duplicate QR scan lock (rolling 60s window)",
  "Rate limit on scan and redeem endpoints",
  "Staff outlier detection per shift",
  "Immutable audit log for punch & redeem",
];

const recentAlerts = [
  { status: "Clear", message: "No duplicate scans detected today", time: "Live" },
  { status: "Clear", message: "No velocity anomalies on punch endpoints", time: "Live" },
  { status: "Clear", message: "No suspicious staff activity flagged", time: "Live" },
];

export default function AdminFraudPage() {
  return (
    <AdminPageShell
      description="Monitor blocked scans, duplicate attempts, velocity spikes, and suspicious staff behavior."
      title="Fraud Monitor"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Blocked today" value="0" />
        <StatCard label="Duplicate scans" value="0" />
        <StatCard label="Velocity flags" value="0" />
        <StatCard label="Staff anomalies" value="0" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Live alerts">
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                className="flex items-start justify-between gap-4 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4"
                key={alert.message}
              >
                <div>
                  <p className="text-sm font-medium text-emerald-100">{alert.status}</p>
                  <p className="mt-1 text-sm text-slate-300">{alert.message}</p>
                </div>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Active fraud rules">
          <ul className="space-y-3">
            {fraudRules.map((rule) => (
              <li className="flex gap-3 rounded-xl bg-white/[0.04] p-4 text-sm text-slate-300" key={rule}>
                <span className="mt-1 size-2 shrink-0 rounded-full bg-sky-300" />
                {rule}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AdminPageShell>
  );
}
