"use client";

import { FormEvent, useState } from "react";
import { AdminPageShell, Panel, StatCard } from "@/components/admin/admin-page-shell";
import { PhoneDisplay } from "@/components/customer/phone-display";
import { normalizePhone } from "@/lib/phone";
import { resolveSlotFromHour } from "@/lib/journey/slots";
import { BRAND_NAME } from "@/lib/brand";

type CustomerProfile = {
  name: string;
  phone: string;
  qr: string;
  level: number;
  stage: number;
  totalPunches: number;
  todayPunches: number;
};

export default function StaffScanPage() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [punchResult, setPunchResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [punchLoading, setPunchLoading] = useState(false);
  const [todayPunchCount, setTodayPunchCount] = useState(0);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPunchResult(null);
    setLookupLoading(true);

    const digits = normalizePhone(phone);
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit mobile number (with or without +91).");
      setLookupLoading(false);
      return;
    }

    const response = await fetch("/api/staff/customer/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: digits }),
    });

    const result = await response.json().catch(() => null);
    setLookupLoading(false);

    if (!response.ok || !result?.ok) {
      setCustomer(null);
      setError(result?.message ?? "Customer not found.");
      return;
    }

    setCustomer(result.data);
  }

  async function handlePunch() {
    if (!customer?.phone) return;

    setPunchLoading(true);
    setError(null);

    const response = await fetch("/api/punch/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: customer.phone,
        name: customer.name,
        branchCode: "moon-bar",
      }),
    });

    const result = await response.json().catch(() => null);
    setPunchLoading(false);

    if (!response.ok || !result?.ok) {
      setError(result?.message ?? "Could not record punch. Try again.");
      return;
    }

    const slot = result.data.slotCode as string;
    setPunchResult(`Punch saved for ${slot} slot. Ask customer to refresh their dashboard.`);
    setTodayPunchCount((count) => count + 1);
    setCustomer((current) =>
      current
        ? {
            ...current,
            totalPunches: current.totalPunches + 1,
            todayPunches: current.todayPunches + 1,
          }
        : current,
    );
  }

  const currentSlot = resolveSlotFromHour(new Date().getHours());

  return (
    <AdminPageShell
      description="Enter the customer mobile number, validate their profile, and record a time-slot punch."
      title="Staff Punch"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard hint="This session" label="Punches" value={String(todayPunchCount)} />
        <StatCard hint="Current" label="Active slot" value={currentSlot} />
        <StatCard hint="Branch" label="Location" value={BRAND_NAME} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Find customer by phone">
          <form className="space-y-4" onSubmit={handleLookup}>
            <label className="block">
              <span className="text-sm text-slate-400">Customer mobile number</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-sky-400"
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. 6303654985 or +91 6303654985"
                value={phone}
              />
            </label>
            <p className="text-xs text-slate-500">
              Customer must sign in once at the Customer portal before staff can punch them.
            </p>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              className="w-full rounded-xl bg-sky-500 py-3 font-medium text-white hover:bg-sky-400 disabled:opacity-60"
              disabled={lookupLoading}
              type="submit"
            >
              {lookupLoading ? "Looking up..." : "Find customer"}
            </button>
          </form>
        </Panel>

        <Panel title="Customer profile">
          {customer ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase text-emerald-200/80">Found</p>
                <p className="mt-2 text-xl font-semibold">{customer.name}</p>
                <p className="mt-1 text-slate-300">
                  <PhoneDisplay phone={customer.phone} />
                </p>
                <p className="mt-1 text-sm text-slate-400">{customer.qr}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-4 text-sm text-slate-300">
                <p>
                  Level {customer.level} · Stage {customer.stage}
                </p>
                <p className="mt-1 text-slate-500">
                  {customer.todayPunches} punch{customer.todayPunches === 1 ? "" : "es"} today · {customer.totalPunches}{" "}
                  total
                </p>
                <p className="mt-1 text-slate-500">Current slot: {currentSlot}</p>
              </div>
              <button
                className="w-full rounded-xl bg-violet-500 py-3 font-medium text-white hover:bg-violet-400 disabled:opacity-60"
                disabled={punchLoading}
                onClick={handlePunch}
                type="button"
              >
                {punchLoading ? "Saving punch..." : "Record punch for current slot"}
              </button>
              {punchResult && (
                <p className="rounded-xl border border-sky-300/20 bg-sky-400/10 p-4 text-sm text-sky-100">
                  {punchResult}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <p className="text-slate-400">No customer loaded yet.</p>
              <p className="mt-2 text-sm text-slate-500">Enter mobile number and tap Find customer.</p>
            </div>
          )}
        </Panel>
      </div>
    </AdminPageShell>
  );
}
