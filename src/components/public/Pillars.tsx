const PILLARS = [
  {
    no: "01",
    title: "Persönliche Beratung",
    text: "Wir helfen bei der Auswahl der passenden Hardware für dein Budget und deine Anforderungen.",
  },
  {
    no: "02",
    title: "Hochwertige Komponenten",
    text: "Ausgewählte Markenhardware für Leistung, Stabilität und Langlebigkeit.",
  },
  {
    no: "03",
    title: "Professioneller Zusammenbau",
    text: "Sauberes Kabelmanagement und sorgfältige Montage.",
  },
  {
    no: "04",
    title: "Getestet vor Versand",
    text: "Jedes System wird vor dem Versand ausgiebig geprüft, kalibriert und durchläuft einen 24h-Stresstest.",
  },
];

export function Pillars() {
  return (
    <section className="section">
      <div className="mb-12 max-w-2xl">
        <span className="eyebrow">Warum YKsystems</span>
        <h2 className="mt-3 text-3xl font-bold text-neutral-50 sm:text-4xl">
          Mehr als nur ein Gaming-PC
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <div key={p.no} className="card card-hover">
            <div className="font-mono text-2xl font-bold text-accent">{p.no}</div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-50">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
