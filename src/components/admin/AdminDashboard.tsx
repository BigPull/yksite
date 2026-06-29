"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SystemEditorCard } from "./SystemEditorCard";
import type { AdminSystem, AdminInquiry } from "./types";

interface Props {
  initialSystems: AdminSystem[];
  inquiries: AdminInquiry[];
  inquiryCount: number;
}

export function AdminDashboard({ initialSystems, inquiries, inquiryCount }: Props) {
  const [systems, setSystems] = useState<AdminSystem[]>(initialSystems);
  const [tab, setTab] = useState<"systems" | "inquiries">("systems");
  const [creating, setCreating] = useState(false);
  const [reorderStatus, setReorderStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = systems.findIndex((s) => s.id === active.id);
    const newIndex = systems.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(systems, oldIndex, newIndex);
    setSystems(reordered);

    // Neue Reihenfolge sofort persistieren.
    setReorderStatus("saving");
    try {
      const res = await fetch("/api/systems/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((s) => s.id) }),
      });
      if (!res.ok) throw new Error();
      setReorderStatus("saved");
      setTimeout(() => setReorderStatus("idle"), 1500);
    } catch {
      setReorderStatus("error");
    }
  }

  async function createSystem() {
    setCreating(true);
    try {
      const res = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Neues System",
          tagline: "Kurzbeschreibung",
          description: "Beschreibung des Systems ...",
          performanceClass: "1080p",
          priceCents: 99900,
          availability: "IN_PRODUCTION",
          published: false,
        }),
      });
      const data = await res.json();
      if (res.ok && data.system) {
        setSystems((prev) => [
          ...prev,
          { ...data.system, createdAt: data.system.createdAt, updatedAt: data.system.updatedAt },
        ]);
      }
    } finally {
      setCreating(false);
    }
  }

  function updateSystem(updated: AdminSystem) {
    setSystems((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  function removeSystem(id: string) {
    setSystems((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Systeme per Drag-and-Drop sortieren, live bearbeiten und Anfragen einsehen.
          </p>
        </div>
        <div className="flex gap-2 rounded-lg border border-ink-500 bg-ink-800 p-1">
          <TabButton active={tab === "systems"} onClick={() => setTab("systems")}>
            Systeme ({systems.length})
          </TabButton>
          <TabButton active={tab === "inquiries"} onClick={() => setTab("inquiries")}>
            Anfragen ({inquiryCount})
          </TabButton>
        </div>
      </div>

      {tab === "systems" && (
        <>
          <div className="mb-5 flex items-center justify-between">
            <div className="text-xs text-neutral-500">
              {reorderStatus === "saving" && "Reihenfolge wird gespeichert ..."}
              {reorderStatus === "saved" && <span className="text-accent">✓ Reihenfolge gespeichert</span>}
              {reorderStatus === "error" && <span className="text-red-400">Fehler beim Speichern</span>}
            </div>
            <button onClick={createSystem} disabled={creating} className="btn-primary px-5 py-2 text-sm disabled:opacity-50">
              {creating ? "Erstellt ..." : "+ Neues System"}
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={systems.map((s) => s.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {systems.map((s) => (
                  <SystemEditorCard key={s.id} system={s} onChange={updateSystem} onDelete={removeSystem} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {systems.length === 0 && (
            <p className="rounded-lg border border-dashed border-ink-500 p-10 text-center text-neutral-500">
              Noch keine Systeme. Lege das erste über „+ Neues System“ an.
            </p>
          )}
        </>
      )}

      {tab === "inquiries" && (
        <div className="overflow-hidden rounded-xl border border-ink-500/60">
          {inquiries.length === 0 ? (
            <p className="p-10 text-center text-neutral-500">Noch keine Anfragen eingegangen.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-800 text-xs uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">E-Mail</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Zweck</th>
                  <th className="px-4 py-3">Auflösung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-500/50">
                {inquiries.map((i) => (
                  <tr key={i.id} className="hover:bg-ink-700/40">
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-400">
                      {new Date(i.createdAt).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-4 py-3 text-neutral-100">{i.name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${i.email}`} className="text-accent hover:underline">
                        {i.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-neutral-300">{i.budget}</td>
                    <td className="px-4 py-3 text-neutral-300">{i.usage}</td>
                    <td className="px-4 py-3 text-neutral-300">{i.resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
        active ? "bg-accent text-ink" : "text-neutral-300 hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
