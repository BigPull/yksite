import path from "node:path";

/** Absolutes Verzeichnis für hochgeladene Bilder (Docker-Volume). */
export function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

/** Erlaubte Bild-MIME-Typen → Dateiendung. */
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

/** Verhindert Path-Traversal: nur einfache Dateinamen erlauben. */
export function sanitizeFilename(name: string): string | null {
  if (!name || name.includes("/") || name.includes("\\") || name.includes("..")) return null;
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return null;
  return name;
}
