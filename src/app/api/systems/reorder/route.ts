import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdmin } from "@/lib/api";

const ReorderSchema = z.object({
  // Liste aller System-IDs in der neuen Reihenfolge.
  order: z.array(z.string()).min(1),
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
  const parsed = ReorderSchema.safeParse(body);
  if (!parsed.success) return jsonError("Ungültige Reihenfolge.");

  // Reihenfolge atomar in einer Transaktion persistieren.
  await prisma.$transaction(
    parsed.data.order.map((id, index) =>
      prisma.system.update({ where: { id }, data: { orderIndex: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
