import AboutHero from "@/components/about/AboutHero";
import CorePillars from "@/components/about/CorePillars";
import CultureVibe from "@/components/about/CultureVibe";
import ImpactMetrics from "@/components/about/ImpactMetrics";
import OriginStory from "@/components/about/OriginStory";

import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = {
  title: "About Us | AiMS Nation",
  description:
    "Discover the mission, vision, and educators behind AiMS Nation's revolutionary learning ecosystem.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <AboutHero />
      <OriginStory />
      <CorePillars />
      <ImpactMetrics />
      <CultureVibe />
      <FinalCTA />
    </main>
  );
}
