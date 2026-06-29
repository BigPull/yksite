import Link from "next/link";
import { SiteFooter } from "./SiteFooter";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-ink-500/60 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-neutral-50">YK</span>
            <span className="text-accent">systems</span>
          </Link>
          <Link href="/" className="text-sm text-neutral-300 hover:text-accent">
            ← Zur Startseite
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <h1 className="text-3xl font-bold text-neutral-50 sm:text-4xl">{title}</h1>
        <div className="prose-invert mt-8 space-y-6 text-neutral-300 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-neutral-100 [&_strong]:text-neutral-100">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
