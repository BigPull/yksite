"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [needsToken, setNeedsToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token: token || undefined }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.needsSetup) {
        router.push("/admin/setup-2fa");
        return;
      }
      if (res.ok && data.ok) {
        router.push(redirect);
        router.refresh();
        return;
      }
      if (data.needsToken) {
        setNeedsToken(true);
        setError("Bitte gib zusätzlich deinen 6-stelligen 2FA-Code ein.");
        return;
      }
      setError(data.error || "Anmeldung fehlgeschlagen.");
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center text-2xl font-extrabold tracking-tight">
          <span className="text-neutral-50">YK</span>
          <span className="text-accent">systems</span>
        </Link>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <h1 className="text-xl font-bold text-neutral-50">Admin-Anmeldung</h1>
            <p className="mt-1 text-sm text-neutral-400">Geschützter Bereich · keine Registrierung.</p>
          </div>

          <div>
            <label className="field-label">E-Mail</label>
            <input
              type="email"
              required
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="field-label">Passwort</label>
            <input
              type="password"
              required
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {needsToken && (
            <div>
              <label className="field-label">2FA-Code (6-stellig)</label>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                className="field-input tracking-[0.4em]"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
              />
            </div>
          )}

          {error && <p className="text-sm text-amber-300">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Anmelden ..." : "Anmelden"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          ← <Link href="/" className="hover:text-accent">Zurück zur Website</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-neutral-400">Lädt ...</div>}>
      <LoginForm />
    </Suspense>
  );
}
