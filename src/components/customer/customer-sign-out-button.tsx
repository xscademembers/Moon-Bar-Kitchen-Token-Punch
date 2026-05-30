"use client";

export function CustomerSignOutButton() {
  async function handleSignOut() {
    await fetch("/api/auth/customer/session", { method: "DELETE" });
    window.location.assign("/customer");
  }

  return (
    <button
      className="w-full rounded-2xl border border-red-300/20 bg-red-400/10 p-5 text-left transition hover:bg-red-400/15"
      onClick={handleSignOut}
      type="button"
    >
      <h2 className="text-lg font-medium text-red-100">Sign out</h2>
      <p className="mt-1 text-sm text-red-200/70">End your session and return to sign in.</p>
    </button>
  );
}
