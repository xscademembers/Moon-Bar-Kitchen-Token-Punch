"use client";

import { FormEvent, useState } from "react";

type AdminLoginFormProps = {
  nextPath: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });

    if (!response.ok) {
      setError("Invalid admin ID or password.");
      setLoading(false);
      return;
    }

    window.location.assign(nextPath);
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm text-slate-300">Admin ID</span>
        <input
          autoComplete="username"
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-sky-400"
          onChange={(event) => setUsername(event.target.value)}
          placeholder="admin"
          required
          type="text"
          value={username}
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-300">Password</span>
        <input
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none focus:border-sky-400"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <button
        className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing in..." : "Sign in to admin"}
      </button>
    </form>
  );
}
