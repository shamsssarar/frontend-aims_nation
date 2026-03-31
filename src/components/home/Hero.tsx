"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  BookOpen,
  Code2,
  Palette,
  ArrowRight,
  Star,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- ANIMATION VARIANTS ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 15 },
  },
};

// Generates a smooth, continuous floating effect
const floatAnimation = (delay: number) => ({
  animate: {
    y: ["0%", "-15%", "0%"],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  },
});

// --- BRAND COLORS ---
const theme = {
  greenText: "text-[#6A8D52]",
  yellowText: "text-[#E8AD31]",
  slate: "text-slate-900",
};

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 lg:pt-12 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
      {/* --- BACKGROUND GLOWS (Parallax illusion) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#E8AD31]/10 rounded-full blur-3xl animate-pulse duration-1000" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#6A8D52]/10 rounded-full blur-3xl" />
      </div>

      {/* --- FLOATING 3D-LIKE ICONS (Hidden on mobile to keep text clear) --- */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden hidden lg:block">
        <motion.div
          {...floatAnimation(0)}
          className="absolute top-[20%] left-[15%] p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40"
        >
          <Code2 className={`h-8 w-8 ${theme.yellowText}`} />
        </motion.div>
        <motion.div
          {...floatAnimation(1.5)}
          className="absolute top-[30%] right-[15%] p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40"
        >
          <Palette className={`h-8 w-8 ${theme.greenText}`} />
        </motion.div>
        <motion.div
          {...floatAnimation(0.8)}
          className="absolute bottom-[20%] left-[25%] p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40"
        >
          <BookOpen className="h-8 w-8 text-indigo-500" />
        </motion.div>
        <motion.div
          {...floatAnimation(2.2)}
          className="absolute bottom-[30%] right-[25%] p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40"
        >
          <Music className="h-8 w-8 text-rose-500" />
        </motion.div>
      </div>

      {/* --- MAIN HERO CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm"
          >
            <Star className={`h-4 w-4 ${theme.yellowText} fill-current`} />
            <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
              Admissions Now Open for 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className={`text-6xl md:text-8xl font-black tracking-tight ${theme.yellowText} leading-[1.1]`}
          >
            Grow Their Mind. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A8D52] to-[#4A6D32]">
              Fuel Their Future.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto"
          >
            Guiding Futures With a Parent's Heart. The ultimate ecosystem for
            kids to master academics, robotics, arts, and life skills.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              asChild
              className="h-14 px-8 text-lg rounded-full bg-[#6A8D52] hover:bg-[#587843] text-white shadow-xl shadow-[#6A8D52]/20 group transition-all hover:scale-105"
            >
              <Link href="/courses">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 px-8 text-lg rounded-full bg-white/50 backdrop-blur-md border-slate-200 text-slate-700 hover:bg-white shadow-sm transition-all hover:scale-105"
            >
              <Link href="/careers">Apply to Teach</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
