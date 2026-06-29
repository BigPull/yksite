"use client";

import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  budget: string;
  usage: string;
  games: string;
  resolution: string;
  refreshRate: string;
  aesthetics: string;
  notes: string;
  privacy: boolean;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  budget: "",
  usage: "",
  games: "",
  resolution: "",
  refreshRate: "",
  aesthetics: "",
  notes: "",
  privacy: false,
};

const BUDGETS = ["Unter 800€", "800€–1200€", "1200€–1600€", "1600€–2000€", "Über 2000€"];
const USAGES = ["Gaming", "Gaming & Streaming", "Content Creation", "Office"];
const RESOLUTIONS = ["1080p", "1440p", "4K", "Nicht sicher"];
const REFRESH = ["60 Hz", "120–165 Hz", "240 Hz+", "Noch kein Monitor vorhanden"];
const AESTHETICS = ["Schlicht", "Dezentes RGB", "Viel RGB", "Weißes System", "Keine Präferenz"];

const TOTAL_STEPS = 6;

/** Wiederverwendbarer Auswahl-Chip (Radio-Verhalten). */
function ChoiceGrid({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-md border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
              active
                ? "border-accent bg-accent/10 text-accent"
                : "border-ink-500 bg-ink-800 text-neutral-300 hover:border-accent/50"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function Configurator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email);
      case 2:
        return !!form.budget;
      case 3:
        return !!form.usage;
      case 4:
        return !!form.resolution && !!form.refreshRate;
      case 5:
        return !!form.aesthetics;
      case 6:
        return true;
      default:
        return false;
    }
  }

  const next = () => canProceed() && setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  async function handleSubmit() {
    if (!form.privacy) {
      setErrorMsg("Bitte stimme der Datenschutzerklärung zu.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Die Anfrage konnte nicht gesendet werden.");
      }
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Unbekannter Fehler.");
    }
  }

  if (status === "success") {
    return (
      <section id="konfigurator" className="section scroll-mt-20">
        <div className="card mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent text-accent">
            ✓
          </div>
          <h2 className="mt-6 text-2xl font-bold text-neutral-50">Anfrage erhalten.</h2>
          <p className="mt-4 leading-relaxed text-neutral-300">
            Vielen Dank, {form.name.split(" ")[0]}. Wir melden uns werktags innerhalb von 24 bis 48
            Stunden mit einer persönlichen Empfehlung unter <strong>{form.email}</strong>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="konfigurator" className="section scroll-mt-20">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">Konfigurator</span>
        <h2 className="mt-3 text-3xl font-bold text-neutral-50 sm:text-4xl">Custom System anfragen</h2>
        <p className="mt-3 text-neutral-400">
          In sechs kurzen Schritten zu deinem unverbindlichen Angebot.
        </p>
      </div>

      <div className="card mx-auto max-w-2xl">
        {/* Fortschrittsbalken */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-neutral-400">
            <span>
              Schritt {step} von {TOTAL_STEPS}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-600">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Schritte */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="field-label">Name</label>
              <input
                className="field-input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Vor- und Nachname"
              />
            </div>
            <div>
              <label className="field-label">E-Mail-Adresse</label>
              <input
                type="email"
                className="field-input"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="name@beispiel.de"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="field-label">Budget-Rahmen</label>
            <ChoiceGrid options={BUDGETS} value={form.budget} onChange={(v) => set("budget", v)} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="field-label">Einsatzzweck</label>
              <ChoiceGrid options={USAGES} value={form.usage} onChange={(v) => set("usage", v)} />
            </div>
            <div>
              <label className="field-label">Gewünschte Spiele (optional)</label>
              <input
                className="field-input"
                value={form.games}
                onChange={(e) => set("games", e.target.value)}
                placeholder="z.B. Cyberpunk 2077, Valorant, Flight Simulator"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="field-label">Auflösung</label>
              <ChoiceGrid
                options={RESOLUTIONS}
                value={form.resolution}
                onChange={(v) => set("resolution", v)}
              />
            </div>
            <div>
              <label className="field-label">Monitor-Bildwiederholrate</label>
              <ChoiceGrid
                options={REFRESH}
                value={form.refreshRate}
                onChange={(v) => set("refreshRate", v)}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <label className="field-label">Optik-Wunsch</label>
            <ChoiceGrid
              options={AESTHETICS}
              value={form.aesthetics}
              onChange={(v) => set("aesthetics", v)}
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <div>
              <label className="field-label">Sonderwünsche (optional)</label>
              <textarea
                className="field-input min-h-[120px] resize-y"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Besondere Anforderungen, gewünschte Komponenten, Termine ..."
              />
            </div>
            <label className="flex items-start gap-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={form.privacy}
                onChange={(e) => set("privacy", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <span>
                Ich habe die{" "}
                <a href="/datenschutz" target="_blank" className="text-accent underline">
                  Datenschutzerklärung
                </a>{" "}
                gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung der Anfrage zu.
              </span>
            </label>
          </div>
        )}

        {errorMsg && <p className="mt-5 text-sm text-red-400">{errorMsg}</p>}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="rounded-md px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-neutral-200 disabled:opacity-30"
          >
            Zurück
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={next}
              disabled={!canProceed()}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Weiter
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "submitting" || !form.privacy}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "submitting" ? "Wird gesendet ..." : "Unverbindliches Angebot anfordern"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
