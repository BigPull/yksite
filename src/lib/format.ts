import type { Availability } from "@prisma/client";

export function formatPrice(priceCents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  IN_STOCK: "Sofort lieferbar",
  IN_PRODUCTION: "In Produktion",
  SOLD_OUT: "Ausverkauft",
};

export const AVAILABILITY_OPTIONS: { value: Availability; label: string }[] = [
  { value: "IN_STOCK", label: "Sofort lieferbar" },
  { value: "IN_PRODUCTION", label: "In Produktion" },
  { value: "SOLD_OUT", label: "Ausverkauft" },
];

/** Tailwind-Klassen für den Verfügbarkeits-Badge. */
export function availabilityBadgeClass(a: Availability): string {
  switch (a) {
    case "IN_STOCK":
      return "border-accent/40 text-accent";
    case "IN_PRODUCTION":
      return "border-amber-400/40 text-amber-300";
    case "SOLD_OUT":
      return "border-red-500/40 text-red-300";
  }
}
