const STEPS = [
  { n: 1, t: "Anfrage senden", d: "Du schilderst uns dein Budget und deine Wünsche." },
  { n: 2, t: "Beratung erhalten", d: "Wir melden uns mit einer fundierten Empfehlung." },
  { n: 3, t: "Angebot prüfen", d: "Du erhältst ein transparentes, unverbindliches Angebot." },
  { n: 4, t: "Auftrag bestätigen", d: "Erst nach deiner Freigabe geht es weiter." },
  { n: 5, t: "PC wird gebaut und getestet", d: "Sorgfältiger Aufbau inkl. 24h-Stresstest." },
  { n: 6, t: "Versand oder Abholung", d: "Sicher verpackt zu dir oder zur Abholung bereit." },
];

export function Timeline() {
  return (
    <section className="bg-ink-800/50">
      <div className="section">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Der Ablauf</span>
          <h2 className="mt-3 text-3xl font-bold text-neutral-50 sm:text-4xl">So funktioniert es</h2>
        </div>

        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink-500/60 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="card-hover bg-ink-700/60 p-6 transition-colors hover:bg-ink-600/60"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/50 font-mono text-sm font-bold text-accent">
                  {s.n}
                </span>
                <h3 className="font-semibold text-neutral-50">{s.t}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
