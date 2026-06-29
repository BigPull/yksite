import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "YKsystems – High-Performance-Gaming-Systeme & Custom PCs",
    template: "%s | YKsystems",
  },
  description:
    "YKsystems fertigt maßgeschneiderte Gaming-PCs auf Manufaktur-Niveau. Persönliche Beratung, hochwertige Komponenten, getestet vor Versand.",
  keywords: ["Gaming PC", "Custom PC", "YKsystems", "High-End", "Konfigurator"],
};

export const viewport: Viewport = {
  themeColor: "#121212",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen bg-ink font-sans text-neutral-100">{children}</body>
    </html>
  );
}
