import Link from "next/link";
import { QrAutoSignIn } from "@/components/customer/qr-auto-sign-in";
import { parseQrSignInParams } from "@/lib/auth/qr-sign-in";

type CustomerProfilePageProps = {
  searchParams: Promise<{ qr?: string; phone?: string; name?: string }>;
};

/** QR scans open this page — validates params, signs in, then opens the dashboard. */
export default async function CustomerProfilePage({ searchParams }: CustomerProfilePageProps) {
  const { qr, phone, name } = await searchParams;
  const signIn = parseQrSignInParams(qr, phone, name);

  if (signIn) {
    return <QrAutoSignIn name={signIn.name} phone={signIn.phone} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070712] px-5 py-10 text-white">
      <section className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        <h1 className="text-2xl font-semibold">Profile not found</h1>
        <p className="mt-3 text-sm text-slate-400">
          This QR link is invalid or incomplete. Sign in from the customer portal to get a valid QR code.
        </p>
        <Link className="mt-6 inline-block rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium" href="/customer/login">
          Go to sign in
        </Link>
      </section>
    </main>
  );
}
