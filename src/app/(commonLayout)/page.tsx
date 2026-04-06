// src/app/(commonLayout)/page.tsx
import { Hero } from "@/components/home/Hero";
import { UniverseOfLearning } from "@/components/home/UniverseOfLearning";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen dark:bg-slate-950 transition-colors bg-[#FDFDF9] selection:bg-[#E8AD31] selection:text-white overflow-hidden">
      {/* Default behavior (frosted glass) */}

      <Hero />
      <UniverseOfLearning />
      <WhyChooseUs />
      <FinalCTA />
    </main>
  );
}
