import Link from "next/link";
import { redirect } from "next/navigation";
import { CustomerQrCode } from "@/components/moon-ui/customer-qr-code";
import { PhoneDisplay } from "@/components/customer/phone-display";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { upsertCustomer } from "@/lib/customers/customer-store";
import { getAppBaseUrl } from "@/lib/app-url";
import { buildQrProfileUrl, buildQrPublicId } from "@/lib/journey/qr-identity";
import { getCustomerProgress } from "@/lib/journey/punch-store";
import { getSlotStatus, type SlotStatus } from "@/lib/journey/progress";
import { resolveCurrentSlot } from "@/lib/journey/slots";
import { BRAND_NAME } from "@/lib/brand";

export const dynamic = "force-dynamic";

const SLOT_WINDOWS = [
  { label: "Morning", code: "morning" as const, time: "05:00 - 11:59" },
  { label: "Afternoon", code: "afternoon" as const, time: "12:00 - 17:59" },
  { label: "Night", code: "night" as const, time: "18:00 - 04:59" },
];

const SLOT_STATUS_STYLES: Record<SlotStatus, string> = {
  Completed: "bg-emerald-400/15 text-emerald-100",
  Available: "bg-violet-400/20 text-violet-100",
  Missed: "bg-white/5 text-slate-500",
  Upcoming: "bg-white/10 text-slate-400",
};

export default async function CustomerDashboardPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/customer/login");

  const { name: displayName, phone } = session;
  await upsertCustomer(phone, displayName);
  const progress = await getCustomerProgress(phone);
  const qrPublicId = buildQrPublicId(phone);
  const appBaseUrl = await getAppBaseUrl();
  const qrProfileUrl = buildQrProfileUrl(appBaseUrl, phone, displayName);
  const needsNetworkUrl =
    appBaseUrl.includes("localhost") || appBaseUrl.includes("127.0.0.1");
  const { hour: currentHour, slot: currentSlot } = resolveCurrentSlot();

  const punchSlots = SLOT_WINDOWS.map((slot) => ({
    ...slot,
    status: getSlotStatus(slot.code, progress.todayPunches, currentSlot, currentHour),
  }));

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_35%),#070712] px-5 py-8 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link className="inline-flex text-sm text-violet-300 hover:text-white" href="/customer">
          ← Back to customer portal
        </Link>
        <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-purple-950/30 backdrop-blur md:flex-row md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-violet-200/80">{BRAND_NAME}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
              Welcome, {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Signed in as <PhoneDisplay phone={phone} />. You are at Level {progress.level}, Stage {progress.stage} with{" "}
              {progress.totalPunches} total punch{progress.totalPunches === 1 ? "" : "es"} collected.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 px-5 py-4 text-sm text-violet-100">
            <p className="text-violet-200/70">Current Rank</p>
            <p className="mt-1 text-2xl font-semibold">
              Level {progress.level} / Stage {progress.stage}
            </p>
            <p className="mt-2 text-xs text-violet-200/60">
              {progress.totalPunches} punch{progress.totalPunches === 1 ? "" : "es"} collected
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Progress</p>
                <h2 className="mt-2 text-2xl font-semibold">Moon Level Path</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                {progress.progressPercent}% Complete
              </span>
            </div>

            <div className="mt-8">
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                  const stageNumber = index + 1;
                  const isCurrent = stageNumber === progress.stage;
                  const isCompleted = stageNumber < progress.stage;
                  const isRewardStage = stageNumber === 5;

                  return (
                    <div
                      className={`rounded-2xl border p-4 text-center ${
                        isCurrent
                          ? "border-violet-300/40 bg-violet-400/15 text-white"
                          : isCompleted
                            ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
                            : isRewardStage
                              ? "border-amber-300/25 bg-amber-400/10 text-amber-100"
                              : "border-white/10 bg-white/[0.04] text-slate-500"
                      }`}
                      key={stageNumber}
                    >
                      <p className="text-xs">{isRewardStage ? "Stage · Reward" : "Stage"}</p>
                      <p className="mt-1 text-xl font-semibold">{stageNumber}</p>
                      {isCurrent && (
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-violet-200">
                          {isRewardStage ? "Reward stage" : "Current"}
                        </p>
                      )}
                      {isRewardStage && !isCurrent && (
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-amber-200/90">Unlock reward</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">QR Identity</p>
            <div className="mt-5 rounded-3xl border border-dashed border-violet-200/25 bg-white/[0.04] p-6">
              {needsNetworkUrl && (
                <p className="mb-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs leading-5 text-amber-100">
                  For phone scanning, set{" "}
                  <code className="text-amber-50">NEXT_PUBLIC_APP_URL=http://YOUR-PC-IP:3000</code> in{" "}
                  <code className="text-amber-50">.env.local</code>, then restart npm run dev.
                </p>
              )}
              <CustomerQrCode profileUrl={qrProfileUrl} qrPublicId={qrPublicId} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-xl font-semibold">Today&apos;s Punch Slots</h2>
            <div className="mt-5 space-y-3">
              {punchSlots.map((slot) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={slot.label}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{slot.label}</p>
                    <span className={`rounded-full px-3 py-1 text-xs ${SLOT_STATUS_STYLES[slot.status]}`}>
                      {slot.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{slot.time}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-xl font-semibold">Active Rewards</h2>
            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
              <p className="text-sm text-slate-400">No rewards yet.</p>
              <p className="mt-2 text-xs text-slate-500">
                Collect punches and reach stage milestones to unlock rewards.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="mt-5 space-y-3">
              {progress.recentActivity.map((item) => (
                <div className="flex gap-3 rounded-2xl bg-white/[0.04] p-4" key={item}>
                  <span className="mt-1 size-2 rounded-full bg-fuchsia-300" />
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
