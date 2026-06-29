import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  // Middleware schützt bereits /admin; dies ist die zweite Verteidigungslinie.
  if (!admin) redirect("/login");

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-ink-500/60 bg-ink-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-lg font-extrabold tracking-tight">
              <span className="text-neutral-50">YK</span>
              <span className="text-accent">systems</span>
            </Link>
            <span className="rounded-full border border-accent/30 px-2.5 py-0.5 text-xs text-accent">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="text-neutral-400 hover:text-accent">
              Website ansehen ↗
            </Link>
            <span className="hidden text-neutral-500 sm:inline">{admin.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
