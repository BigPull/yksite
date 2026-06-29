import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdmin } from "@/lib/api";

export async function GET() {
  const { admin, response } = await requireAdmin();
  if (!admin) return response;

  const systems = await prisma.system.findMany({ orderBy: { orderIndex: "asc" } });
  return NextResponse.json({ systems });
}

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  tagline: z.string().max(200).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  performanceClass: z.string().max(60).optional().default(""),
  priceCents: z.number().int().min(0).optional().default(0),
  availability: z.enum(["IN_STOCK", "IN_PRODUCTION", "SOLD_OUT"]).optional().default("IN_PRODUCTION"),
  imagePath: z.string().max(300).nullable().optional(),
  highlights: z.array(z.string().max(120)).optional().default([]),
  published: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  const { admin, response } = await requireAdmin();
  if (!admin) return response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Ungültige Anfrage.");
  }
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Validierung fehlgeschlagen.");

  // Neues System ans Ende einsortieren.
  const last = await prisma.system.findFirst({ orderBy: { orderIndex: "desc" } });
  const orderIndex = (last?.orderIndex ?? -1) + 1;

  const system = await prisma.system.create({
    data: { ...parsed.data, orderIndex },
  });
  return NextResponse.json({ system });
}
