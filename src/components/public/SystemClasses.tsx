import { SystemCard, type SystemCardData } from "./SystemCard";

export function SystemClasses({ systems }: { systems: SystemCardData[] }) {
  return (
    <section id="system-klassen" className="section scroll-mt-20">
      <div className="mb-12 max-w-2xl">
        <span className="eyebrow">Unsere Engines</span>
        <h2 className="mt-3 text-3xl font-bold text-neutral-50 sm:text-4xl">System-Klassen</h2>
        <p className="mt-3 text-neutral-400">
          Drei abgestimmte Ausgangspunkte – jedes System wird individuell für dich gebaut.
        </p>
      </div>

      {systems.length === 0 ? (
        <p className="text-neutral-500">Aktuell sind keine Systeme veröffentlicht.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {systems.map((s) => (
            <SystemCard key={s.id} system={s} />
          ))}
        </div>
      )}
    </section>
  );
}
