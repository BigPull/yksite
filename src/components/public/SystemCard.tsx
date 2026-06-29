import type { Availability } from "@prisma/client";
import { formatPrice, AVAILABILITY_LABEL, availabilityBadgeClass } from "@/lib/format";

export interface SystemCardData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  performanceClass: string;
  priceCents: number;
  currency: string;
  availability: Availability;
  imagePath: string | null;
  highlights: string[];
}

export function SystemCard({ system }: { system: SystemCardData }) {
  return (
    <article className="card card-hover group flex flex-col overflow-hidden p-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-800">
        {system.imagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={system.imagePath}
            alt={system.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-accent/30">
            <span className="text-5xl font-extrabold tracking-tighter">YK</span>
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full border bg-ink/80 px-3 py-1 text-xs font-medium backdrop-blur ${availabilityBadgeClass(
            system.availability
          )}`}
        >
          {AVAILABILITY_LABEL[system.availability]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {system.performanceClass && (
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Performance Klasse · {system.performanceClass}
          </span>
        )}
        <h3 className="mt-2 text-xl font-bold text-neutral-50">{system.name}</h3>
        <p className="mt-1 text-sm text-neutral-400">{system.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">{system.description}</p>

        {system.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {system.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                <span className="mt-1 text-accent">▹</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-ink-500/60 pt-4">
          <div>
            <div className="text-xs text-neutral-500">ab</div>
            <div className="text-2xl font-bold text-neutral-50">
              {formatPrice(system.priceCents, system.currency)}
            </div>
          </div>
          <a href="#konfigurator" className="btn-ghost px-4 py-2 text-sm">
            Anfragen
          </a>
        </div>
      </div>
    </article>
  );
}
