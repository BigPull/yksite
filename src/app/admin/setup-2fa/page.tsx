import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { Setup2FA } from "@/components/admin/Setup2FA";

export const dynamic = "force-dynamic";

export default async function Setup2FAPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");
  // Bereits eingerichtet → direkt ins Dashboard.
  if (admin.twoFactorEnabled) redirect("/admin");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-neutral-50">Zwei-Faktor-Authentisierung einrichten</h1>
      <p className="mt-2 text-neutral-400">
        Zur Absicherung deines Kontos ist 2FA verpflichtend. Scanne den QR-Code mit einer
        Authenticator-App (z.B. Google Authenticator) und bestätige mit dem angezeigten 6-stelligen
        Code.
      </p>
      <div className="mt-8">
        <Setup2FA />
      </div>
    </div>
  );
}
