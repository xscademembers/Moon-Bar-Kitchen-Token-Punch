import Link from "next/link";
import { CustomerSignOutButton } from "@/components/customer/customer-sign-out-button";
import { PhoneDisplay } from "@/components/customer/phone-display";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { upsertCustomer } from "@/lib/customers/customer-store";
import { BRAND_NAME, LOYALTY_JOURNEY_NAME } from "@/lib/brand";

const signedInOptions = [
  {
    title: "Dashboard",
    description: "Your QR code, today’s punch slots, level progress, and active rewards.",
    href: "/dashboard",
  },
  {
    title: LOYALTY_JOURNEY_NAME,
    description: "View all 10 levels and 5 stages per level with your current position.",
    href: "/customer/journey",
  },
  {
    title: "My Rewards",
    description: "See issued rewards, redemption status, and 30-day expiry countdown.",
    href: "/customer/rewards",
  },
];

export default async function CustomerPortalPage() {
  const session = await getCustomerSession();
  if (session) {
    await upsertCustomer(session.phone, session.name);
  }

  return (
    <main className="min-h-screen bg-[#070712] px-5 py-10">
      <section className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-200/70">Customer Portal</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{BRAND_NAME}</h1>

        {session ? (
          <>
            <p className="mt-3 text-slate-400">
              Signed in as <span className="text-white">{session.name}</span> (
              <PhoneDisplay className="text-violet-200" phone={session.phone} />
              ). Choose where to go next.
            </p>
            <div className="mt-10 space-y-4">
              {signedInOptions.map((option) => (
                <Link
                  className="block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-violet-300/30 hover:bg-white/[0.07]"
                  href={option.href}
                  key={option.title}
                >
                  <h2 className="text-lg font-medium text-white">{option.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{option.description}</p>
                </Link>
              ))}
              <CustomerSignOutButton />
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-slate-400">
              Sign in or register with your name and phone number to access your personal data.
            </p>
            <div className="mt-10 space-y-4">
              <Link
                className="block rounded-2xl border border-violet-300/30 bg-violet-400/10 p-5 transition hover:bg-violet-400/15"
                href="/customer/login"
              >
                <h2 className="text-lg font-medium text-white">Sign in / Register</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Enter your name and mobile number to access your {BRAND_NAME} loyalty account. No OTP required.
                </p>
              </Link>
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5">
                <p className="text-sm text-slate-500">
                  Dashboard, {LOYALTY_JOURNEY_NAME}, and My Rewards unlock after you sign in.
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
