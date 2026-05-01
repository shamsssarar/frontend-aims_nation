"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- ANIMATION VARIANTS ---
// A heavy, cinematic fade-in instead of a bouncy slide
const solidReveal: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

// Slowly breathing ambient glows
const breathingGlow: Variants = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    scale: [1, 1.05, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function FinalCTA() {
  return (
    // 👉 DARK MODE FIX: Matches the previous section's background for a seamless flow
    <section className="py-24 relative overflow-hidden bg-[#FDFDF9] dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={solidReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          // 👉 BORDER ENHANCEMENT: Added a subtle border to give it a glass-edge feel
          className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          {/* --- GORGEOUS BACKGROUND GRADIENT (Remains dark/striking in both modes) --- */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#6A8D52] z-0" />

          {/* --- ABSTRACT BREATHING GLOWS --- */}
          <motion.div
            variants={breathingGlow}
            animate="animate"
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8AD31]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 z-0"
          />
          <motion.div
            variants={breathingGlow}
            animate="animate"
            transition={{ delay: 4 }} // Offsets the breathing rhythm
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6A8D52]/40 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 z-0"
          />

          {/* --- CONTENT --- */}
          <div className="relative z-10 px-8 py-20 md:py-28 flex flex-col items-center text-center">
            {/* The Sparkle Icon (With a slow, infinite rotation) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20 shadow-xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-10 w-10 text-[#E8AD31]" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 max-w-3xl leading-tight"
            >
              Ready to shape your child's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8AD31] to-[#fde047]">
                brilliant future?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10"
            >
              Admissions for the 2026 academic year are now open. Join the AiMS
              Nation family today and watch them thrive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-lg rounded-full bg-[#E8AD31] hover:bg-[#c79121] text-slate-900 font-bold shadow-xl shadow-[#E8AD31]/20 group transition-all hover:scale-105"
              >
                <Link href="/courses">
                  Secure Their Spot
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10 text-lg rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 shadow-sm transition-all hover:scale-105"
              >
                <Link href="/contact">Talk to an Advisor</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
