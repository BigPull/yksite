import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/public/SiteNav";
import { Hero } from "@/components/public/Hero";
import { Pillars } from "@/components/public/Pillars";
import { SystemClasses } from "@/components/public/SystemClasses";
import { Timeline } from "@/components/public/Timeline";
import { About } from "@/components/public/About";
import { Configurator } from "@/components/public/Configurator";
import { EmailFocus } from "@/components/public/EmailFocus";
import { Faq } from "@/components/public/Faq";
import { SiteFooter } from "@/components/public/SiteFooter";

// Immer frische Daten aus der DB (Live-Edit im Admin wirkt sofort).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const systems = await prisma.system.findMany({
    where: { published: true },
    orderBy: { orderIndex: "asc" },
  });

  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Pillars />
        <SystemClasses systems={systems} />
        <Timeline />
        <About />
        <Configurator />
        <EmailFocus />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
