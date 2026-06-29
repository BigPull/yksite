"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Availability } from "@prisma/client";
import { AVAILABILITY_OPTIONS } from "@/lib/format";
import type { AdminSystem } from "./types";

interface Props {
  system: AdminSystem;
  onChange: (updated: AdminSystem) => void;
  onDelete: (id: string) => void;
}

/**
 * Eine sortierbare, live editierbare System-Karte im Admin-Dashboard.
 * Der "Griff" (⠿) startet das Drag-and-Drop; die Felder selbst bleiben bedienbar.
 */
export function SystemEditorCard({ system, onChange, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: system.id,
  });

  const [draft, setDraft] = useState<AdminSystem>(system);
  const [priceEuro, setPriceEuro] = useState((system.priceCents / 100).toString());
  const [highlightsText, setHighlightsText] = useState(system.highlights.join("\n"));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto" as const,
  };

  function patch<K extends keyof AdminSystem>(key: K, value: AdminSystem[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setStatus("idle");
    const priceCents = Math.round(parseFloat(priceEuro.replace(",", ".")) * 100) || 0;
    const highlights = highlightsText
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/systems/${system.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          tagline: draft.tagline,
          description: draft.description,
          performanceClass: draft.performanceClass,
          availability: draft.availability,
          published: draft.published,
          imagePath: draft.imagePath,
          priceCents,
          highlights,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const updated: AdminSystem = {
        ...data.system,
        createdAt: data.system.createdAt,
        updatedAt: data.system.updatedAt,
      };
      onChange(updated);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.path) {
        patch("imagePath", data.path);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`System "${system.name}" wirklich löschen?`)) return;
    const res = await fetch(`/api/systems/${system.id}`, { method: "DELETE" });
    if (res.ok) onDelete(system.id);
  }

  return (
    <div ref={setNodeRef} style={style} className="card border-ink-500/70">
      <div className="mb-4 flex items-center justify-between">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-md border border-ink-500 px-2 py-1 text-neutral-400 hover:text-accent active:cursor-grabbing"
          title="Zum Verschieben ziehen"
          aria-label="Verschieben"
        >
          ⠿ ziehen
        </button>
        <label className="flex items-center gap-2 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => patch("published", e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          Veröffentlicht
        </label>
      </div>

      {/* Bild */}
      <div className="mb-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-ink-500 bg-ink-800">
          {draft.imagePath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.imagePath} alt={draft.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-accent/30">
              <span className="text-4xl font-extrabold">YK</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <label className="cursor-pointer text-xs text-accent hover:underline">
            {uploading ? "Lädt ..." : "Bild hochladen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
          {draft.imagePath && (
            <button onClick={() => patch("imagePath", null)} className="text-xs text-neutral-500 hover:text-red-400">
              entfernen
            </button>
          )}
        </div>
      </div>

      {/* Felder */}
      <div className="space-y-3">
        <Field label="Name">
          <input className="field-input py-2" value={draft.name} onChange={(e) => patch("name", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <input className="field-input py-2" value={draft.tagline} onChange={(e) => patch("tagline", e.target.value)} />
        </Field>
        <Field label="Beschreibung">
          <textarea
            className="field-input min-h-[70px] py-2"
            value={draft.description}
            onChange={(e) => patch("description", e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Performance Klasse">
            <input
              className="field-input py-2"
              value={draft.performanceClass}
              onChange={(e) => patch("performanceClass", e.target.value)}
              placeholder="1440p"
            />
          </Field>
          <Field label="Preis (€)">
            <input
              className="field-input py-2"
              inputMode="decimal"
              value={priceEuro}
              onChange={(e) => setPriceEuro(e.target.value)}
            />
          </Field>
        </div>
        <Field label="Verfügbarkeit">
          <select
            className="field-input py-2"
            value={draft.availability}
            onChange={(e) => patch("availability", e.target.value as Availability)}
          >
            {AVAILABILITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Highlights (eine Zeile pro Eintrag)">
          <textarea
            className="field-input min-h-[70px] py-2"
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button onClick={handleDelete} className="text-sm text-neutral-500 hover:text-red-400">
          Löschen
        </button>
        <div className="flex items-center gap-3">
          {status === "saved" && <span className="text-xs text-accent">✓ Gespeichert</span>}
          {status === "error" && <span className="text-xs text-red-400">Fehler</span>}
          <button onClick={save} disabled={saving} className="btn-primary px-5 py-2 text-sm disabled:opacity-50">
            {saving ? "Speichert ..." : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-400">{label}</label>
      {children}
    </div>
  );
}
