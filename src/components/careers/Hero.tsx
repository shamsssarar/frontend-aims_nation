// src/components/careers/Hero.tsx
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-200 dark:border-slate-800">
      {/* Optional subtle background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#6A8D52]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold text-[#6A8D52] bg-[#6A8D52]/10 ring-1 ring-inset ring-[#6A8D52]/20 mb-8 uppercase tracking-wider">
          Careers at AiMS Nation
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Shape the Future of <br className="hidden md:block" />
          <span className="text-[#6A8D52]">Education.</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          We are on a mission to build the ultimate ecosystem for kids to master academics, robotics, arts, and life skills. Join us and teach what you love.
        </p>
        
        {/* Call to Action (Scrolls to the form) */}
        <div className="flex justify-center gap-4">
          <a
            href="#application-form"
            className="inline-flex items-center justify-center rounded-full bg-[#6A8D52] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6A8D52]/30 hover:bg-[#587843] transition-all hover:scale-105"
          >
            View Open Roles <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
}