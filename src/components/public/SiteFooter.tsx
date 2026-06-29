import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-500/60 bg-ink-800">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <div className="text-lg font-extrabold">
            <span className="text-neutral-50">YK</span>
            <span className="text-accent">systems</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-400">
            Individuell geplante Gaming-PCs auf Manufaktur-Niveau. Crafted. Tested. Delivered.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Navigation
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-neutral-400">
            <li>
              <a href="#system-klassen" className="hover:text-accent">
                System-Klassen
              </a>
            </li>
            <li>
              <a href="#konfigurator" className="hover:text-accent">
                Konfigurator
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-accent">
                FAQ
              </a>
            </li>
            <li>
              <a href="#kontakt" className="hover:text-accent">
                Kontakt
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Rechtliches
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/impressum" className="hover:text-accent">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-accent">
                Datenschutz
              </Link>
            </li>
            <li>
              <a href="mailto:kontakt@yk-systems.de" className="hover:text-accent">
                kontakt@yk-systems.de
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-500/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} YKsystems · Inhaber: Yakaria Michael Yoboua</span>
          <span>
            Umsatzsteuer wird nicht ausgewiesen, da der Verkäufer Kleinunternehmer im Sinne des UStG
            ist.
          </span>
        </div>
      </div>
    </footer>
  );
}
