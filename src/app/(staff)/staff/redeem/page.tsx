"use client";

import { FormEvent, useState } from "react";
import { AdminPageShell, Panel } from "@/components/admin/admin-page-shell";
import { PhoneDisplay } from "@/components/customer/phone-display";
import { buildQrPublicId } from "@/lib/journey/qr-identity";

export default function StaffRedeemPage() {
  const [phone, setPhone] = useState("");
  const [lookupDone, setLookupDone] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return;
    setLookupDone(true);
    setRedeemed(false);
  }

  const qrId = phone ? buildQrPublicId(phone) : "—";

  return (
    <AdminPageShell
      description="Look up a customer and redeem their active reward once with staff confirmation."
      title="Staff Redeem"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Customer lookup">
          <form className="space-y-4" onSubmit={handleLookup}>
            <label className="block">
              <span className="text-sm text-slate-400">Customer mobile number</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-sky-400"
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. 9876543210"
                value={phone}
              />
            </label>
            <button className="w-full rounded-xl bg-sky-500 py-3 font-medium text-white hover:bg-sky-400" type="submit">
              Find customer rewards
            </button>
          </form>
        </Panel>

        <Panel title="Redeem reward">
          {lookupDone ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-white/[0.04] p-4">
                <p className="text-sm text-slate-400">Customer QR</p>
                <p className="mt-1 font-medium">{qrId}</p>
                <p className="mt-1 text-sm text-slate-500">
                  <PhoneDisplay phone={phone} />
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
                <p className="text-slate-400">No active rewards to redeem.</p>
                <p className="mt-2 text-sm text-slate-500">Customer has not unlocked any rewards yet.</p>
              </div>
              <button
                className="w-full rounded-xl border border-white/20 py-3 text-slate-500"
                disabled
                type="button"
              >
                Redeem (no rewards available)
              </button>
              {redeemed && (
                <p className="text-sm text-emerald-300">Reward marked as redeemed and logged for audit.</p>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <p className="text-slate-400">Look up a customer to view redeemable rewards.</p>
            </div>
          )}
        </Panel>
      </div>
    </AdminPageShell>
  );
}
