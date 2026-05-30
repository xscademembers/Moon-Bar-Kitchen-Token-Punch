import { AdminPageShell, Panel } from "@/components/admin/admin-page-shell";

const slotWindows = [
  { slot: "Morning", window: "05:00 – 11:59", maxPunches: 1 },
  { slot: "Afternoon", window: "12:00 – 17:59", maxPunches: 1 },
  { slot: "Night", window: "18:00 – 04:59", maxPunches: 1 },
];

const journeyRules = [
  { level: 1, stages: 5, pointsPerPunch: 1 },
  { level: 2, stages: 5, pointsPerPunch: 1 },
  { level: 3, stages: 5, pointsPerPunch: 1 },
];

const rewardsCatalog = [
  { code: "MOON-LATTE", title: "Moon Latte Upgrade", kind: "Standard" },
  { code: "CRATER-BONUS", title: "Secret Crater Bonus", kind: "Secret" },
  { code: "STREAK-3", title: "3-Day Streak Reward", kind: "Standard" },
];

export default function AdminConfigPage() {
  return (
    <AdminPageShell
      description="Manage punch slot windows, level/stage progression, rewards catalog, and secret reward settings."
      title="Configuration"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Time slot windows">
          <div className="space-y-3">
            {slotWindows.map((row) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4" key={row.slot}>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{row.slot}</p>
                  <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs text-sky-100">Active</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{row.window}</p>
                <p className="mt-2 text-xs text-slate-500">Max {row.maxPunches} punch per customer/day</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Journey rules (10 levels × 5 stages)">
          <div className="space-y-3">
            {journeyRules.map((row) => (
              <div className="rounded-xl bg-white/[0.04] p-4" key={row.level}>
                <p className="font-medium">Level {row.level}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {row.stages} stages · {row.pointsPerPunch} point per valid punch
                </p>
              </div>
            ))}
            <p className="text-xs text-slate-500">Levels 4–10 follow the same 5-stage structure.</p>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Rewards catalog">
          <div className="space-y-3">
            {rewardsCatalog.map((reward) => (
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-4" key={reward.code}>
                <div>
                  <p className="font-medium">{reward.title}</p>
                  <p className="text-xs text-slate-500">{reward.code}</p>
                </div>
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-100">{reward.kind}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Reward & secret settings">
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-xl bg-white/[0.04] p-4">
              <p className="font-medium text-white">Reward expiry</p>
              <p className="mt-1 text-slate-400">30 days from issue date</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-4">
              <p className="font-medium text-white">Redemption</p>
              <p className="mt-1 text-slate-400">One-time redeem only per reward instance</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-4">
              <p className="font-medium text-white">Secret rewards</p>
              <p className="mt-1 text-slate-400">Hybrid: milestone triggers + weighted random with daily cap</p>
            </div>
          </div>
        </Panel>
      </div>
    </AdminPageShell>
  );
}
