import { AdminPageShell, Panel, StatCard } from "@/components/admin/admin-page-shell";
import { BRAND_NAME } from "@/lib/brand";

const stageDropOff = [
  { stage: "Level 1 · Stage 1", customers: 0, dropOff: "—" },
  { stage: "Level 1 · Stage 2", customers: 0, dropOff: "0%" },
  { stage: "Level 1 · Stage 3", customers: 0, dropOff: "0%" },
];

const rewardFunnel = [
  { step: "Issued", count: 0 },
  { step: "Redeemed", count: 0 },
  { step: "Expired", count: 0 },
];

export default function AdminAnalyticsPage() {
  return (
    <AdminPageShell
      description={`Track visits, retention, journey progression, and reward performance across ${BRAND_NAME}.`}
      title="Analytics"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard hint="Daily active users" label="DAU" value="0" />
        <StatCard hint="Weekly active users" label="WAU" value="0" />
        <StatCard hint="Monthly active users" label="MAU" value="0" />
        <StatCard hint="7-day return rate" label="Retention" value="0%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Journey drop-off by stage">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Stage</th>
                  <th className="pb-3 pr-4 font-medium">Customers</th>
                  <th className="pb-3 font-medium">Drop-off</th>
                </tr>
              </thead>
              <tbody>
                {stageDropOff.map((row) => (
                  <tr className="border-t border-white/10" key={row.stage}>
                    <td className="py-3 pr-4">{row.stage}</td>
                    <td className="py-3 pr-4">{row.customers}</td>
                    <td className="py-3">{row.dropOff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">Data updates when Supabase is connected.</p>
        </Panel>

        <Panel title="Reward funnel">
          <div className="space-y-3">
            {rewardFunnel.map((item) => (
              <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-4" key={item.step}>
                <span className="text-slate-300">{item.step}</span>
                <span className="text-xl font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Visit trends">
          <div className="flex h-40 items-end gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={day}>
                <div className="w-full rounded-t-md bg-sky-400/20" style={{ height: "8%" }} />
                <span className="text-xs text-slate-500">{day}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">No punch data recorded yet this week.</p>
        </Panel>
      </div>
    </AdminPageShell>
  );
}
