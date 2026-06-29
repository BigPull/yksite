/**
 * Auth-Helfer für die Admin-Anwendung (Server-seitig, Node-Runtime).
 * - Passwortprüfung (bcrypt)
 * - TOTP-Verifikation (otplib)
 * - Aktuelle Session aus dem Cookie lesen
 */
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "./prisma";
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "./session";

// Etwas Toleranz gegenüber Zeitabweichungen des Authenticators.
authenticator.options = { window: 1 };

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyTotp(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  return authenticator.verify({ token: token.replace(/\s/g, ""), secret });
}

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function buildTotpUri(email: string, secret: string): string {
  return authenticator.keyuri(email, "YKsystems", secret);
}

/** Liest die aktuelle Admin-Session aus dem Cookie (oder null). */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Liefert den vollständigen Admin-Datensatz der aktuellen Session. */
export async function getCurrentAdmin() {
  const session = await getCurrentSession();
  if (!session) return null;
  return prisma.adminUser.findUnique({ where: { id: session.sub } });
}
