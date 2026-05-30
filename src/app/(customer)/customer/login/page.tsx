import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/auth/customer-session";
import { CustomerLoginForm } from "@/components/customer/customer-login-form";

type CustomerLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CustomerLoginPage({ searchParams }: CustomerLoginPageProps) {
  const session = await getCustomerSession();
  if (session) redirect("/customer");

  const { error } = await searchParams;
  const invalidQr = error === "invalid_qr";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070712] px-5 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
        <Link className="text-sm text-violet-300 hover:text-white" href="/customer">
          ← Customer portal
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-white">Customer sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your name and mobile number. After sign in, you can view your dashboard, journey, and
          rewards.
        </p>
        {invalidQr && (
          <p className="mt-4 rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            This QR link is invalid or expired. Sign in manually below.
          </p>
        )}
        <CustomerLoginForm />
      </section>
    </main>
  );
}
