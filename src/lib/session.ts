/**
 * Session-Handling über signierte JWTs in einem httpOnly-Cookie.
 * Verwendet "jose", damit dieselbe Logik auch in der Edge-Middleware läuft
 * (dort ist kein Node-Crypto/Prisma verfügbar).
 */
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "yk_session";
const ISSUER = "yksystems";
const AUDIENCE = "yksystems-admin";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET fehlt oder ist zu kurz (min. 16 Zeichen).");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  sub: string; // AdminUser-ID
  email: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (!payload.sub) return null;
    return { sub: payload.sub, email: String(payload.email ?? "") };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 Stunden
