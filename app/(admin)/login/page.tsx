"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="flex flex-col gap-1">
            <span className="dot bg-mining" />
            <span className="dot bg-cream/90" />
            <span className="dot bg-energy" />
          </span>
          <div>
            <p className="font-serif text-gold text-[18px] leading-tight">SIREXE Concierge</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-cream/50">Panel administration</p>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="bg-ink2 rounded-2xl p-8 border border-cream/10">
          <h1 className="font-serif text-cream text-[22px] mb-6">Connexion</h1>

          {error && (
            <div className="bg-err/10 border border-err/30 text-err text-[13px] rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-cream/50 mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sirexe.com"
                required
                className="w-full bg-ink border border-cream/10 rounded-xl px-4 py-3 text-[13px] text-cream placeholder:text-cream/30 focus:border-gold focus:ring-1 focus:ring-gold/30"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.22em] text-cream/50 mb-2 block">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-ink border border-cream/10 rounded-xl px-4 py-3 text-[13px] text-cream placeholder:text-cream/30 focus:border-gold focus:ring-1 focus:ring-gold/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gold hover:bg-gold2 text-ink font-medium rounded-full py-3 text-[14px] btn-press disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-cream/30 text-[11px] mt-6">
          SIREXE Concierge · Panel admin · 2026
        </p>
      </div>
    </div>
  );
}
