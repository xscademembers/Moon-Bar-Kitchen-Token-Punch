"use client";

import { FormEvent, useState } from "react";

export function CustomerLoginForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const trimmedName = name.trim();
    const trimmedPhone = phone.replace(/\D/g, "");

    if (!trimmedName || trimmedPhone.length < 10) {
      setError("Enter a valid name and 10-digit mobile number.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/customer/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, phone: trimmedPhone }),
    });

    if (!response.ok) {
      setError("Could not sign in. Please try again.");
      setLoading(false);
      return;
    }

    window.location.assign("/customer");
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm text-slate-300">Full name</span>
        <input
          autoComplete="name"
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-violet-400"
          minLength={2}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Priya Sharma"
          required
          type="text"
          value={name}
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-300">Mobile number</span>
        <input
          autoComplete="tel"
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-violet-400"
          inputMode="tel"
          onChange={(event) => setPhone(event.target.value)}
          placeholder="e.g. 9876543210"
          required
          type="tel"
          value={phone}
        />
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <button
        className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing in..." : "Sign in & continue"}
      </button>
    </form>
  );
}
