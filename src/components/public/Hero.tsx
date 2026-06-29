export function Hero() {
  return (
    <section className="glow-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
        <span className="eyebrow animate-fade-up">Crafted in Germany · Manufaktur-Niveau</span>
        <h1 className="animate-fade-up mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-neutral-50 sm:text-6xl">
          Leistung, die zu dir passt.{" "}
          <span className="text-accent">Beratung, die den Unterschied macht.</span>
        </h1>
        <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
          Ob Gaming-Einstieg, leistungsstarkes WQHD-System oder individueller High-End-PC. Wir
          unterstützen dich bei der Auswahl und bauen dein System mit Sorgfalt, hochwertigen
          Komponenten und persönlicher Beratung.
        </p>
        <div className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row">
          <a href="#system-klassen" className="btn-primary">
            Gaming-PCs entdecken
          </a>
          <a href="#konfigurator" className="btn-ghost">
            Custom-PC anfragen
          </a>
        </div>
      </div>
    </section>
  );
}
