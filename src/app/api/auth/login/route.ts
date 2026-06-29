import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";
import { verifyPassword, verifyTotp } from "@/lib/auth";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  token: z.string().optional(), // 6-stelliger TOTP-Code
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Ungültige Anfrage.");
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return jsonError("E-Mail und Passwort erforderlich.");
  const { email, password, token } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  // Einheitliche Fehlermeldung gegen User-Enumeration.
  const invalid = () => jsonError("E-Mail oder Passwort ist falsch.", 401);
  if (!admin) return invalid();

  const passwordOk = await verifyPassword(password, admin.passwordHash);
  if (!passwordOk) return invalid();

  // Fall A: 2FA noch nicht eingerichtet → eingeschränkte Session für das Setup ausstellen.
  if (!admin.twoFactorEnabled || !admin.totpSecret) {
    const sessionToken = await createSessionToken({ sub: admin.id, email: admin.email });
    const res = NextResponse.json({ ok: true, needsSetup: true });
    res.cookies.set(SESSION_COOKIE, sessionToken, cookieOpts());
    return res;
  }

  // Fall B: 2FA aktiv → TOTP-Code zwingend erforderlich.
  if (!token) {
    return NextResponse.json({ ok: false, needsToken: true }, { status: 401 });
  }
  if (!verifyTotp(token, admin.totpSecret)) {
    return jsonError("Der 2FA-Code ist ungültig.", 401);
  }

  const sessionToken = await createSessionToken({ sub: admin.id, email: admin.email });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken, cookieOpts());
  return res;
}

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
