import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { uploadDir, sanitizeFilename } from "@/lib/uploads";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

/**
 * Liefert hochgeladene Bilder aus dem Upload-Volume aus.
 * Öffentlich lesbar (Produktbilder), aber gegen Path-Traversal abgesichert.
 */
export async function GET(_request: Request, { params }: { params: { path: string[] } }) {
  const segments = params.path ?? [];
  // Nur ein einzelner, sicherer Dateiname ist erlaubt.
  if (segments.length !== 1) {
    return new NextResponse("Not found", { status: 404 });
  }
  const safe = sanitizeFilename(segments[0]);
  if (!safe) return new NextResponse("Not found", { status: 404 });

  const filePath = path.join(uploadDir(), safe);
  try {
    await stat(filePath);
    const data = await readFile(filePath);
    const ext = safe.split(".").pop()?.toLowerCase() ?? "";
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
