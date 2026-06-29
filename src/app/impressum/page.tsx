import type { Metadata } from "next";
import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <strong>YKsystems</strong>
        <br />
        Inhaber: Yakaria Michael Yoboua
        <br />
        Grabenstr. 2a
        <br />
        65385 Rüdesheim am Rhein
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail:{" "}
        <a href="mailto:kontakt@yk-systems.de" className="text-accent underline">
          kontakt@yk-systems.de
        </a>
      </p>
      <p className="text-sm text-neutral-400">
        Qualität braucht Fokus. Um maximale Präzision beim Bau unserer Systeme zu garantieren,
        kommunizieren wir ausschließlich digital. Jede Anfrage über unser System-Formular wird
        werktags innerhalb von 24 bis 48 Stunden ausführlich beantwortet.
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>
        USt-ID: <strong>DE458719505</strong>
      </p>

      <h2>Bankverbindung</h2>
      <p>
        Qonto
        <br />
        IBAN: DE93 1001 0123 2370 0897 89
        <br />
        BIC: QNTODEB2XXX
      </p>

      <h2>Hinweis zur Kleinunternehmerregelung</h2>
      <p>
        Umsatzsteuer wird nicht ausgewiesen, da der Verkäufer Kleinunternehmer im Sinne des UStG
        ist.
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </LegalLayout>
  );
}
