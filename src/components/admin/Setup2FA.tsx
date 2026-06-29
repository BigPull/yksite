"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Setup2FA() {
  const router = useRouter();
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/2fa/setup")
      .then((r) => r.json())
      .then((data) => {
        if (data.qrDataUrl) {
          setQr(data.qrDataUrl);
          setSecret(data.secret);
        } else {
          setError(data.error || "QR-Code konnte nicht geladen werden.");
        }
      })
      .catch(() => setError("Netzwerkfehler beim Laden des QR-Codes."))
      .finally(() => setLoading(false));
  }, []);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setError(data.error || "Code ungültig.");
    } catch {
      setError("Netzwerkfehler.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="card">
      {loading ? (
        <p className="text-neutral-400">QR-Code wird geladen ...</p>
      ) : (
        <>
          {qr && (
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="2FA QR-Code" className="rounded-lg bg-white p-2" width={220} height={220} />
              <div className="w-full rounded-md border border-ink-500 bg-ink-800 p-3 text-center">
                <p className="text-xs text-neutral-500">Manueller Schlüssel (falls Scan nicht möglich)</p>
                <code className="mt-1 block break-all text-sm text-accent">{secret}</code>
              </div>
            </div>
          )}

          <form onSubmit={verify} className="mt-6 space-y-4">
            <div>
              <label className="field-label">6-stelligen Code eingeben</label>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                className="field-input text-center text-lg tracking-[0.5em]"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
              />
            </div>
            {error && <p className="text-sm text-amber-300">{error}</p>}
            <button
              type="submit"
              disabled={verifying || token.length !== 6}
              className="btn-primary w-full disabled:opacity-50"
            >
              {verifying ? "Wird geprüft ..." : "2FA aktivieren"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
