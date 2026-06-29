export function EmailFocus() {
  return (
    <section id="kontakt" className="scroll-mt-20 bg-ink-800/50">
      <div className="section">
        <div className="card mx-auto max-w-3xl border-accent/20 text-center">
          <span className="eyebrow">Kontakt</span>
          <h2 className="mt-3 text-2xl font-bold text-neutral-50 sm:text-3xl">
            Qualität braucht Fokus.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-neutral-300">
            Um maximale Präzision beim Bau unserer Systeme zu garantieren, kommunizieren wir
            ausschließlich digital. Jede Anfrage über unser System-Formular wird werktags innerhalb
            von 24 bis 48 Stunden ausführlich beantwortet.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#konfigurator" className="btn-primary">
              Anfrage starten
            </a>
            <a href="mailto:kontakt@yk-systems.de" className="btn-ghost">
              kontakt@yk-systems.de
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
