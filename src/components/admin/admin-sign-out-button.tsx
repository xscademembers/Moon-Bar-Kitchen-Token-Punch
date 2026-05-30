"use client";

export function AdminSignOutButton() {
  async function handleSignOut() {
    await fetch("/api/auth/admin/session", { method: "DELETE" });
    window.location.assign("/admin/login");
  }

  return (
    <button
      className="w-full rounded-2xl border border-red-300/20 bg-red-400/10 p-5 text-left transition hover:bg-red-400/15"
      onClick={handleSignOut}
      type="button"
    >
      <p className="font-medium text-red-100">Sign out</p>
      <p className="mt-1 text-sm text-red-200/70">End admin session and lock staff tools.</p>
    </button>
  );
}
