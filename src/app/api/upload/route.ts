import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { jsonError, requireAdmin } from "@/lib/api";
import { uploadDir, ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/uploads";

export const runtime = "nodejs";

/**
 * Nimmt ein Bild (multipart/form-data, Feld "file") entgegen, speichert es im
 * Upload-Volume und liefert den öffentlichen Pfad (/api/media/<datei>) zurück.
 */
export async function POST(request: Request) {
  const { admin, response } = await requireAdmin();
  if (!admin) return response;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return jsonError("Keine Datei übermittelt.");
  }

  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) {
    return jsonError("Nicht unterstütztes Bildformat (erlaubt: JPG, PNG, WEBP, AVIF, GIF).");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError("Datei ist zu groß (max. 8 MB).");
  }

  const dir = uploadDir();
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({ path: `/api/media/${filename}` });
}
