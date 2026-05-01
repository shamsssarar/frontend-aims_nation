// src/app/(commonLayout)/page.tsx
import { Hero } from "@/components/home/Hero";
import { UniverseOfLearning } from "@/components/home/UniverseOfLearning";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FinalCTA } from "@/components/home/FinalCTA";
import EcosystemJourney from "@/components/home/EcosystemJourney";
import FutureBentoGrid from "@/components/home/FutureBentoGrid";
import AiMSPreloader from "@/components/shared/AiMSPreloader";

export default function LandingPage() {
  return (
    <main className="min-h-screen dark:bg-slate-950 transition-colors bg-[#FDFDF9] selection:bg-[#E8AD31] selection:text-white overflow-hidden mt-20">
      {/* Default behavior (frosted glass) */}
      <AiMSPreloader />
      <Hero />
      <EcosystemJourney />
      <FutureBentoGrid />
      <UniverseOfLearning />
      <WhyChooseUs />
      <FinalCTA />
    </main>
  );
}
