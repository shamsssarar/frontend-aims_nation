"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { Heart, FileText, ShieldCheck, BookOpen } from "lucide-react";

// --- BRAND COLORS ---
const theme = {
  greenText: "text-[#6A8D52]",
  yellowText: "text-[#E8AD31]",
  slate: "text-slate-900",
};

// --- ANIMATION VARIANTS ---
// Left column staggering
const textContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  },
};

// Right column sliding in
const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 100, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

// Generates a subtle floating effect for the dashboard mockup
const floatMockup = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewAmount, setViewAmount] = useState(0.2);

  useEffect(() => {
    // Dynamic viewport threshold for desktop vs mobile
    const handleResize = () => {
      setViewAmount(window.innerWidth >= 768 ? 0.2 : 0.2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // 👉 DARK MODE FIX: Replaced bg-[#FDFDF9] with responsive dark bg
    <section ref={containerRef} className="py-24 bg-[#FDFDF9] dark:bg-slate-900 transition-colors duration-300 overflow-hidden relative">
      
      {/* Background grounding glow to signal the end of the page */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/5 dark:bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT COLUMN: The Copy & Features --- */}
          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: viewAmount }}
            className="space-y-8"
          >
            <motion.div variants={fadeUpVariant}>
              {/* 👉 DARK MODE FIX: Pill colors */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-semibold text-sm border border-rose-200/50 dark:border-rose-900/50">
                <Heart className="h-4 w-4 fill-current" />
                The AiMS Promise
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUpVariant}
              className={`text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300`}
            >
              Built by educators.
              <br />
              Trusted by parents.
            </motion.h2>

            <motion.p 
              variants={fadeUpVariant}
              className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300"
            >
              We don't just teach subjects; we cultivate character. Our
              proprietary LMS dashboard keeps parents fully integrated into
              their child's daily progress, behavior, and achievements.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="space-y-6 pt-4">
              {[
                {
                  title: "Weekly Performance Reports",
                  desc: "Transparent grading and behavioral tracking sent directly to your portal.",
                  icon: <FileText className={theme.greenText} />,
                },
                {
                  title: "Vetted Expert Teachers",
                  desc: "A rigorous ATS pipeline ensures only the most passionate mentors reach our classrooms.",
                  icon: <ShieldCheck className={theme.yellowText} />,
                },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 group">
                  {/* 👉 DARK MODE FIX: Feature icons */}
                  <div className="mt-1 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-12 w-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* --- RIGHT COLUMN: Interactive Glassmorphism Mockup --- */}
          <motion.div
            variants={slideFromRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: viewAmount }}
            // 👉 DARK MODE FIX: Dimmed the background gradient slightly for dark mode
            className="relative h-[500px] w-full bg-gradient-to-tr from-[#6A8D52]/20 to-[#E8AD31]/20 dark:from-[#6A8D52]/10 dark:to-[#E8AD31]/10 rounded-3xl overflow-hidden border border-white/50 dark:border-white/5 shadow-2xl flex items-center justify-center"
          >
            {/* The Floating UI Card */}
            <motion.div
              {...floatMockup}
              // 👉 DARK MODE FIX: Frosted dark glass for the mockup card
              className="w-[85%] h-[85%] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white dark:border-slate-700 p-6 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-default"
            >
              {/* Fake Header Skeleton */}
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors duration-300"></div>
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors duration-300"></div>
              </div>

              {/* Fake Metric Cards */}
              <div className="flex gap-4">
                <div className={`h-24 flex-1 bg-gradient-to-br from-[#6A8D52] to-[#4A6D32] rounded-xl p-4 text-white relative overflow-hidden shadow-inner`}>
                  <div className="text-3xl font-bold relative z-10">45</div>
                  <div className="text-xs opacity-80 relative z-10 mt-1">
                    Total Students
                  </div>
                  <BookOpen className="absolute -bottom-2 -right-2 h-16 w-16 opacity-20" />
                </div>
                <div className={`h-24 flex-1 bg-gradient-to-br from-[#E8AD31] to-[#c79121] rounded-xl p-4 text-white relative overflow-hidden shadow-inner`}>
                  <div className="text-3xl font-bold relative z-10">A+</div>
                  <div className="text-xs opacity-80 relative z-10 mt-1">
                    Avg Behavior
                  </div>
                  <Heart className="absolute -bottom-2 -right-2 h-16 w-16 opacity-20 fill-current" />
                </div>
              </div>

              {/* Fake Roster List */}
              {/* 👉 DARK MODE FIX: Roster list background and skeletons */}
              <div className="flex-1 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white dark:border-slate-700 p-4 mt-2 transition-colors duration-300">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-600 rounded-full mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                      {/* 👉 DARK MODE FIX: Green pill container */}
                      <div className="h-6 w-16 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800 relative overflow-hidden">
                        {/* Animated progress bar inside the pill */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          // Keeps the progress bar animation firing when scrolling into view
                          viewport={{ once: false }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="absolute inset-0 bg-green-300 dark:bg-green-600 opacity-50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}