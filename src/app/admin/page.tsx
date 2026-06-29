import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");
  // Erzwinge 2FA-Einrichtung beim allerersten Login.
  if (!admin.twoFactorEnabled) redirect("/admin/setup-2fa");

  const [systems, inquiries, inquiryCount] = await Promise.all([
    prisma.system.findMany({ orderBy: { orderIndex: "asc" } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.inquiry.count(),
  ]);

  return (
    <AdminDashboard
      initialSystems={systems.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      }))}
      inquiries={inquiries.map((i) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        budget: i.budget,
        usage: i.usage,
        resolution: i.resolution,
        notes: i.notes,
        createdAt: i.createdAt.toISOString(),
      }))}
      inquiryCount={inquiryCount}
    />
  );
}
