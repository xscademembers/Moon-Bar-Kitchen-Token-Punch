import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

const portals = [
  {
    title: "Customer",
    description: "Enter your phone number, view your QR identity, track moon levels, and manage rewards.",
    href: "/customer",
    accent: "from-violet-500/20 to-fuchsia-500/10 border-violet-300/25",
  },
  {
    title: "Admin",
    description: "Analytics, fraud monitoring, journey configuration, and staff punch & redeem operations.",
    href: "/admin/login",
    accent: "from-sky-500/20 to-indigo-500/10 border-sky-300/25",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-16">
      <main className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-violet-200/80">{BRAND_NAME}</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Choose your portal</h1>
        <p className="mx-auto mt-4 max-w-xl text-violet-100/75">
          QR-first loyalty for {BRAND_NAME}. Select Customer or Admin to continue.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {portals.map((portal) => (
            <Link
              className={`group rounded-[2rem] border bg-gradient-to-br p-8 text-left shadow-xl transition hover:scale-[1.02] hover:bg-white/[0.08] ${portal.accent}`}
              href={portal.href}
              key={portal.title}
            >
              <h2 className="text-2xl font-semibold text-white">{portal.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{portal.description}</p>
              <span className="mt-6 inline-block text-sm font-medium text-violet-200 group-hover:text-white">
                Enter {portal.title} →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
