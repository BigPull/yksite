/**
 * Seed-Skript für YKsystems.
 *
 * - Legt den Admin-Benutzer aus der .env an (falls noch keiner existiert).
 * - Befüllt die drei Standard-System-Klassen (Entry / Performance / Apex),
 *   sofern die Tabelle leer ist.
 *
 * Wird idempotent ausgeführt: Mehrfacher Aufruf verändert vorhandene Daten nicht.
 */
import { PrismaClient, Availability } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("[seed] ADMIN_EMAIL/ADMIN_PASSWORD nicht gesetzt – Admin wird übersprungen.");
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] Admin '${email}' existiert bereits.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({
    data: { email, passwordHash },
  });
  console.log(`[seed] Admin '${email}' angelegt. 2FA-Einrichtung erfolgt beim ersten Login.`);
}

async function seedSystems() {
  const count = await prisma.system.count();
  if (count > 0) {
    console.log(`[seed] ${count} Systeme vorhanden – Seeding übersprungen.`);
    return;
  }

  const systems = [
    {
      name: "Entry Engine",
      tagline: "Der ideale Einstieg in modernes Gaming",
      description:
        "Ausgewogen abgestimmt für flüssiges 1080p-Gaming. Ein sorgfältig zusammengestelltes System für alle, die den Schritt in die PC-Welt mit Sorgfalt gehen wollen.",
      performanceClass: "1080p",
      priceCents: 79900,
      availability: Availability.IN_STOCK,
      highlights: ["Aktuelle Mittelklasse-GPU", "Schnelle NVMe-SSD", "Leiser Luftkühler"],
      orderIndex: 0,
    },
    {
      name: "Performance Engine",
      tagline: "Hohe Leistung für anspruchsvolle Spieler",
      description:
        "Kraftvolle WQHD-Performance für hohe Bildraten in 1440p. Premium-Komponenten für ein System, das auch zukünftige Titel souverän meistert.",
      performanceClass: "1440p",
      priceCents: 134900,
      availability: Availability.IN_PRODUCTION,
      highlights: ["High-End-GPU", "Schneller Mehrkern-Prozessor", "Optimiertes Airflow-Gehäuse"],
      orderIndex: 1,
    },
    {
      name: "Apex Engine",
      tagline: "Maximale Performance für höchste Ansprüche",
      description:
        "Kompromisslose Leistung für 4K-Gaming und Streaming auf höchstem Niveau. Manufaktur-Niveau in Auswahl, Aufbau und Kühlung.",
      performanceClass: "4K & Streaming",
      priceCents: 219900,
      availability: Availability.IN_PRODUCTION,
      highlights: ["Flaggschiff-GPU", "Custom-Loop-ready", "Premium-Netzteil & Speicher"],
      orderIndex: 2,
    },
  ];

  for (const s of systems) {
    await prisma.system.create({ data: s });
  }
  console.log(`[seed] ${systems.length} System-Klassen angelegt.`);
}

async function main() {
  await seedAdmin();
  await seedSystems();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("[seed] Fehler:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
