"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const breathingGlow: Variants = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.1, 1],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function AboutHero() {
  return (
    <section className="relative pt-26 pb-20 md:pt-30 md:pb-32 overflow-hidden flex items-center justify-center min-h-[70vh]">
      {/* --- BACKGROUND AMBIENCE --- */}
      <motion.div
        variants={breathingGlow}
        animate="animate"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        variants={breathingGlow}
        animate="animate"
        transition={{ delay: 4 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 dark:bg-secondary/15 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 font-semibold text-sm border border-slate-300/50 dark:border-slate-700/50 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Our Mission & Vision
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]"
        >
          Rewiring the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8AB071]">
            Future
          </span>{" "}
          <br className="hidden md:block" /> of Education.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
            },
          }}
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed"
        >
          AiMS Nation is more than an institution. We are a comprehensive
          ecosystem designed to bridge the gap between traditional academics and
          real-world mastery.
        </motion.p>
      </div>

      {/* Fade out to the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
