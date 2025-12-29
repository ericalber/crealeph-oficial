"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const callbackUrl = "/app";
  const [email, setEmail] = useState("pr.erickalberto@hotmail.com");
  const [password, setPassword] = useState("crealephtest");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/app",
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-[70vh] max-w-screen-sm items-center px-4 py-20">
        <div className="w-full rounded-[var(--radius-lg)] border border-line bg-surface p-8 shadow-[var(--shadow-soft)]">
          <div className="space-y-3 text-left">
            <h1 className="text-3xl font-semibold text-ink">Sign in to CreAleph</h1>
            <p className="text-sm text-muted">Access your dashboard, robots and automations.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-[var(--radius-card)] border border-line bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-[#D62828] focus:ring-offset-1 focus:ring-offset-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-[var(--radius-card)] border border-line bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-[#D62828] focus:ring-offset-1 focus:ring-offset-white"
              />
            </div>
            {error ? <p className="text-sm font-semibold text-[#E02020]">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#D62828] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D62828]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="inline-flex w-full items-center justify-center rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-ink shadow-[var(--shadow-soft)] transition hover:-translate-y-[1px] hover:shadow-[var(--shadow-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D62828]"
            >
              Continue with Google
            </button>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-muted">
            <span>Need access?</span>
            <Link href="/contact" className="font-semibold text-brand hover:text-brand-600">
              Talk to our team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
