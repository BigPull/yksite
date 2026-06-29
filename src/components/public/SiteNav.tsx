"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#system-klassen", label: "System-Klassen" },
  { href: "#konfigurator", label: "Konfigurator" },
  { href: "#ueber-uns", label: "Über uns" },
  { href: "#faq", label: "FAQ" },
  { href: "#kontakt", label: "Kontakt" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-500/60 bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-neutral-50">YK</span>
          <span className="text-accent">systems</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-neutral-300 transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
          <a href="#konfigurator" className="btn-primary px-5 py-2 text-sm">
            Custom-PC anfragen
          </a>
        </div>

        <button
          className="text-accent md:hidden"
          aria-label="Menü"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-500/60 md:hidden">
          <div className="flex flex-col gap-1 px-5 py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-neutral-200 hover:bg-ink-600 hover:text-accent"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
