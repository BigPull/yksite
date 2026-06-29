/**
 * Versand der Konfigurator-Anfragen per E-Mail (SMTP via nodemailer).
 * Wenn keine SMTP-Konfiguration vorhanden ist, wird der Versand übersprungen
 * (die Anfrage bleibt in der DB gespeichert) – ideal für den Prototyp-Betrieb.
 */
import nodemailer from "nodemailer";

export interface InquiryEmailData {
  name: string;
  email: string;
  budget: string;
  usage: string;
  games?: string;
  resolution: string;
  refreshRate: string;
  aesthetics: string;
  notes?: string;
}

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_HOST.trim().length > 0);
}

function buildBody(d: InquiryEmailData): string {
  return [
    "Neue Custom-System-Anfrage über das YKsystems-Konfigurator-Formular:",
    "",
    `Name:               ${d.name}`,
    `E-Mail:             ${d.email}`,
    `Budget-Rahmen:      ${d.budget}`,
    `Einsatzzweck:       ${d.usage}`,
    `Gewünschte Spiele:  ${d.games || "—"}`,
    `Auflösung:          ${d.resolution}`,
    `Bildwiederholrate:  ${d.refreshRate}`,
    `Optik-Wunsch:       ${d.aesthetics}`,
    "",
    "Sonderwünsche:",
    d.notes?.trim() || "—",
    "",
    "— Automatisch generiert von der YKsystems-Plattform.",
  ].join("\n");
}

export async function sendInquiryEmail(data: InquiryEmailData): Promise<boolean> {
  if (!isSmtpConfigured()) {
    console.log("[mailer] SMTP nicht konfiguriert – Anfrage nur in DB gespeichert.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });

  const recipient = process.env.INQUIRY_RECIPIENT || "kontakt@yk-systems.de";

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "YKsystems <kontakt@yk-systems.de>",
    to: recipient,
    replyTo: data.email,
    subject: `Neue Custom-System-Anfrage von ${data.name}`,
    text: buildBody(data),
  });

  return true;
}
