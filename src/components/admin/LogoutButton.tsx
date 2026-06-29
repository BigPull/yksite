"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-md border border-ink-500 px-3 py-1.5 text-neutral-300 transition hover:border-accent/50 hover:text-accent"
    >
      Abmelden
    </button>
  );
}
