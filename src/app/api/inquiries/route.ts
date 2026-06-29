import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";
import { sendInquiryEmail } from "@/lib/mailer";

const InquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  budget: z.string().min(1).max(60),
  usage: z.string().min(1).max(60),
  games: z.string().max(500).optional().default(""),
  resolution: z.string().min(1).max(40),
  refreshRate: z.string().min(1).max(60),
  aesthetics: z.string().min(1).max(60),
  notes: z.string().max(2000).optional().default(""),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "Datenschutz-Zustimmung ist erforderlich." }),
  }),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Ungültige Anfrage.");
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Validierung fehlgeschlagen.");
  }
  const d = parsed.data;

  // Strukturiert speichern (auch als Roh-Snapshot in payload für spätere Module).
  const inquiry = await prisma.inquiry.create({
    data: {
      name: d.name,
      email: d.email,
      budget: d.budget,
      usage: d.usage,
      games: d.games || null,
      resolution: d.resolution,
      refreshRate: d.refreshRate,
      aesthetics: d.aesthetics,
      notes: d.notes || null,
      payload: d,
    },
  });

  // Versand vorbereiten / durchführen (an kontakt@yk-systems.de).
  let emailSent = false;
  try {
    emailSent = await sendInquiryEmail(d);
    if (emailSent) {
      await prisma.inquiry.update({ where: { id: inquiry.id }, data: { emailSent: true } });
    }
  } catch (e) {
    console.error("[inquiries] Mailversand fehlgeschlagen:", e);
  }

  return NextResponse.json({ ok: true, id: inquiry.id, emailSent });
}
