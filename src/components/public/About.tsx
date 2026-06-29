export function About() {
  return (
    <section id="ueber-uns" className="section scroll-mt-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Über YKsystems</span>
          <h2 className="mt-3 text-3xl font-bold text-neutral-50 sm:text-4xl">
            Unsere Philosophie
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            YKsystems steht für individuell geplante Gaming-PCs, persönliche Beratung und hochwertige
            Verarbeitung. Unser Ziel ist es, für jedes Budget die passende Lösung zu finden und
            Systeme zu liefern, die langfristig überzeugen.
          </p>
        </div>

        <div className="card border-accent/20 bg-gradient-to-br from-ink-700 to-ink-800">
          <h3 className="text-lg font-semibold text-accent">Crafted. Tested. Delivered.</h3>
          <dl className="mt-6 space-y-5">
            <div className="flex justify-between border-b border-ink-500/50 pb-4">
              <dt className="text-neutral-400">Aufbau</dt>
              <dd className="font-semibold text-neutral-100">Manufaktur-Niveau</dd>
            </div>
            <div className="flex justify-between border-b border-ink-500/50 pb-4">
              <dt className="text-neutral-400">Qualitätssicherung</dt>
              <dd className="font-semibold text-neutral-100">24h-Stresstest</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">Beratung</dt>
              <dd className="font-semibold text-neutral-100">Persönlich & digital</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
