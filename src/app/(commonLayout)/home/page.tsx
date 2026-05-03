// src/app/page.tsx (or wherever your main route is)
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { UniverseOfLearning } from "@/components/home/UniverseOfLearning";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Footer } from "@/components/layout/Footer";
import EcosystemJourney from "@/components/home/EcosystemJourney";
import FutureBentoGrid from "@/components/home/FutureBentoGrid";
import AiMSPreloader from "@/components/shared/AimsPreloader";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FDFDF9] selection:bg-[#E8AD31] selection:text-white overflow-hidden mt-20">
      <Hero />
      <EcosystemJourney />
      <FutureBentoGrid />
      <UniverseOfLearning />
      <WhyChooseUs />
      <FinalCTA />
    </main>
  );
}
