import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";
import {
  getCurrentSession,
  generateTotpSecret,
  buildTotpUri,
  verifyTotp,
} from "@/lib/auth";

/**
 * GET: Erzeugt (einmalig) ein TOTP-Secret, speichert es vorläufig und liefert
 * den QR-Code (Data-URL) zum Scannen. Nur mit gültiger Session erreichbar.
 */
export async function GET() {
  const session = await getCurrentSession();
  if (!session) return jsonError("Nicht authentifiziert.", 401);

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) return jsonError("Konto nicht gefunden.", 404);
  if (admin.twoFactorEnabled) {
    return jsonError("2FA ist bereits eingerichtet.", 400);
  }

  // Vorhandenes (noch nicht bestätigtes) Secret wiederverwenden oder neu erzeugen.
  let secret = admin.totpSecret;
  if (!secret) {
    secret = generateTotpSecret();
    await prisma.adminUser.update({ where: { id: admin.id }, data: { totpSecret: secret } });
  }

  const otpauthUri = buildTotpUri(admin.email, secret);
  const qrDataUrl = await QRCode.toDataURL(otpauthUri, { margin: 1, width: 240 });

  return NextResponse.json({ qrDataUrl, secret, otpauthUri });
}

const VerifySchema = z.object({ token: z.string().min(6).max(8) });

/**
 * POST: Bestätigt das Setup, indem ein gültiger TOTP-Code geprüft wird.
 * Erst danach wird 2FA endgültig aktiviert.
 */
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return jsonError("Nicht authentifiziert.", 401);

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin || !admin.totpSecret) {
    return jsonError("Kein Setup begonnen. Bitte QR-Code neu laden.", 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Ungültige Anfrage.");
  }
  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) return jsonError("Bitte einen 6-stelligen Code eingeben.");

  if (!verifyTotp(parsed.data.token, admin.totpSecret)) {
    return jsonError("Der Code ist ungültig. Bitte erneut versuchen.", 400);
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { twoFactorEnabled: true },
  });

  return NextResponse.json({ ok: true });
}
