import type { Metadata } from "next";
import { LegalLayout } from "@/components/public/LegalLayout";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        <br />
        <strong>YKsystems</strong>, Inhaber: Yakaria Michael Yoboua, Grabenstr. 2a, 65385 Rüdesheim
        am Rhein. E-Mail:{" "}
        <a href="mailto:kontakt@yk-systems.de" className="text-accent underline">
          kontakt@yk-systems.de
        </a>
        .
      </p>

      <h2>2. Erhebung und Verarbeitung von Anfragedaten</h2>
      <p>
        Wenn du unser System-Formular (Konfigurator) nutzt, verarbeiten wir die von dir angegebenen
        Daten (Name, E-Mail-Adresse, Budget, Einsatzzweck, gewünschte Auflösung,
        Bildwiederholrate, Optik-Wunsch sowie etwaige Freitextangaben), um deine Anfrage zu
        bearbeiten und dir ein individuelles Angebot zu erstellen. Rechtsgrundlage ist Art. 6 Abs.
        1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen) sowie deine Einwilligung nach Art.
        6 Abs. 1 lit. a DSGVO.
      </p>

      <h2>3. Speicherung</h2>
      <p>
        Deine Anfragedaten werden auf unserem eigenen, self-hosted Server (VPS) gespeichert und
        ausschließlich zur Bearbeitung deiner Anfrage verwendet. Eine Weitergabe an Dritte zu
        Werbezwecken findet nicht statt.
      </p>

      <h2>4. Speicherdauer</h2>
      <p>
        Wir speichern deine Daten so lange, wie es für die Bearbeitung deiner Anfrage erforderlich
        ist, bzw. bis zum Ablauf gesetzlicher Aufbewahrungsfristen.
      </p>

      <h2>5. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit sowie das Recht, eine erteilte Einwilligung jederzeit zu widerrufen.
        Wende dich hierzu an{" "}
        <a href="mailto:kontakt@yk-systems.de" className="text-accent underline">
          kontakt@yk-systems.de
        </a>
        . Zudem steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.
      </p>

      <h2>6. Hosting & technische Daten</h2>
      <p>
        Diese Anwendung wird self-hosted betrieben. Beim Aufruf der Website können technisch
        notwendige Daten (z.B. IP-Adresse, Zeitpunkt des Zugriffs) serverseitig verarbeitet werden,
        um den sicheren Betrieb zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
    </LegalLayout>
  );
}
