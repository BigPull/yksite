const FAQS = [
  {
    q: "Wie läuft eine Custom-Anfrage ab?",
    a: "Du füllst unser Konfigurator-Formular aus. Wir prüfen deine Angaben und melden uns werktags innerhalb von 24 bis 48 Stunden mit einer persönlichen Empfehlung und einem unverbindlichen Angebot.",
  },
  {
    q: "Warum gibt es keine Telefonnummer?",
    a: "Qualität braucht Fokus. Um maximale Präzision beim Bau unserer Systeme zu garantieren, kommunizieren wir ausschließlich digital – so bleibt jede Anfrage nachvollziehbar dokumentiert.",
  },
  {
    q: "Welche Komponenten verbaut ihr?",
    a: "Ausschließlich ausgewählte Markenhardware, abgestimmt auf Leistung, Stabilität und Langlebigkeit. Die konkrete Auswahl stimmen wir individuell auf dein Budget und deinen Einsatzzweck ab.",
  },
  {
    q: "Wird mein System getestet?",
    a: "Ja. Jedes System wird vor dem Versand ausgiebig geprüft, kalibriert und durchläuft einen 24-Stunden-Stresstest.",
  },
  {
    q: "Wie wird mein PC geliefert?",
    a: "Wahlweise sicher verpackter Versand oder persönliche Abholung nach Absprache.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section scroll-mt-20">
      <div className="mb-12 max-w-2xl">
        <span className="eyebrow">Fragen & Antworten</span>
        <h2 className="mt-3 text-3xl font-bold text-neutral-50 sm:text-4xl">FAQ</h2>
      </div>

      <div className="mx-auto max-w-3xl divide-y divide-ink-500/60 rounded-xl border border-ink-500/60">
        {FAQS.map((f, i) => (
          <details key={i} className="group p-5 [&_summary]:list-none">
            <summary className="flex cursor-pointer items-center justify-between text-left font-semibold text-neutral-100">
              {f.q}
              <span className="ml-4 text-accent transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
