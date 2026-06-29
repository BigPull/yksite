import { NextResponse } from "next/server";
import { getCurrentAdmin } from "./auth";

/** Standardisierte JSON-Fehlerantwort. */
export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Stellt sicher, dass ein authentifizierter Admin mit aktivem 2FA vorliegt.
 * Gibt entweder den Admin oder eine fertige Fehlerantwort zurück.
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { admin: null, response: jsonError("Nicht authentifiziert.", 401) };
  }
  if (!admin.twoFactorEnabled) {
    return { admin: null, response: jsonError("2FA-Einrichtung erforderlich.", 403) };
  }
  return { admin, response: null as NextResponse | null };
}
