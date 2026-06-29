import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdmin } from "@/lib/api";

const UpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  performanceClass: z.string().max(60).optional(),
  priceCents: z.number().int().min(0).optional(),
  availability: z.enum(["IN_STOCK", "IN_PRODUCTION", "SOLD_OUT"]).optional(),
  imagePath: z.string().max(300).nullable().optional(),
  highlights: z.array(z.string().max(120)).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { admin, response } = await requireAdmin();
  if (!admin) return response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Ungültige Anfrage.");
  }
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Validierung fehlgeschlagen.");

  const existing = await prisma.system.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("System nicht gefunden.", 404);

  const system = await prisma.system.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ system });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { admin, response } = await requireAdmin();
  if (!admin) return response;

  const existing = await prisma.system.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("System nicht gefunden.", 404);

  await prisma.system.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
