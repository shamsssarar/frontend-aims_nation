"use client";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { Terminal, Cpu, Sparkles, Bot, Code2 } from "lucide-react";

// --- STRICTLY TYPED DIRECTIONAL VARIANTS ---
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Elements coming from the LEFT
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -150, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

// Elements coming from the RIGHT
const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 150, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function FutureBentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [viewAmount, setViewAmount] = useState(0.2);

  useEffect(() => {
    // If the screen is wider than 768px (Desktop), set it to 0.75 (75%)
    const handleResize = () => {
      setViewAmount(window.innerWidth >= 768 ? 0.4 : 0.2);
    };

    // Check immediately on load
    handleResize();

    // Listen for window resizing
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      ref={containerRef}
      // overflow-hidden is CRITICAL here so the sliding elements don't cause horizontal scrolling on your page
      className="relative py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300"
    >
      <motion.div
        style={{ y: backgroundY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header slides down from the top */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          // 👉 once: false means it will fade out when you scroll past it!
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.2 }}
          className="text-center mb-20 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built for the <span className="text-primary">Future</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Interactive tools, real-world coding, and AI assistance baked
            directly into the learning experience.
          </p>
        </motion.div>

        {/* --- THE BENTO GRID --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          // 👉 NOW IT IS DYNAMIC! 75% on Desktop, 20% on Mobile
          viewport={{ once: false, amount: viewAmount }}
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6"
        >
          {/* 1. THE TERMINAL CARD (Slides from LEFT) */}
          <motion.div
            variants={slideFromLeft}
            className="md:col-span-2 md:row-span-1 relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-black/40 transition-shadow duration-500"
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Terminal className="text-slate-700 dark:text-slate-300 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Real-World Engineering
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We don't just use drag-and-drop. Students write actual code in
                  modern environments, preparing them for real tech careers.
                </p>
              </div>

              <div className="flex-1 w-full bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-inner overflow-hidden relative group-hover:border-primary/50 transition-colors duration-500">
                <div className="flex gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="font-mono text-sm text-slate-400 space-y-1">
                  <p>
                    <span className="text-pink-500">import</span> {"{ "}Grow
                    {" }"} <span className="text-pink-500">from</span>{" "}
                    <span className="text-green-400">'@aims/core'</span>;
                  </p>
                  <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <span className="text-blue-400">const</span> student ={" "}
                    <span className="text-yellow-200">Grow</span>.mind();
                  </p>
                  <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                    student.<span className="text-blue-300">buildFuture</span>
                    ();
                  </p>
                  <p className="text-primary font-bold animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-500">
                    {"> Success: Future Secured_"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. THE HARDWARE CARD (Slides from RIGHT) */}
          <motion.div
            variants={slideFromRight}
            className="md:col-span-1 md:row-span-1 relative group bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 group-hover:opacity-20 transition-opacity duration-500">
              <Cpu className="w-32 h-32 text-slate-900 dark:text-white" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                <Code2 className="text-secondary dark:text-yellow-500 w-6 h-6" />
              </div>
              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Robotics Lab
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Physical computing, microcontrollers, and hands-on mechanical
                  engineering.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. THE MAGIC CARD (Slides from LEFT) */}
          <motion.div
            variants={slideFromLeft}
            className="md:col-span-1 md:row-span-1 relative group bg-secondary/10 dark:bg-secondary/5 border border-secondary/20 dark:border-secondary/10 rounded-3xl p-8 overflow-hidden shadow-xl"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="w-12 h-12 bg-secondary/20 dark:bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors duration-500">
                <Sparkles className="text-secondary dark:text-yellow-500 group-hover:text-white w-6 h-6" />
              </div>
              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Creative Arts
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Where logic meets imagination. Digital design, storytelling,
                  and visual media.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. THE AI TUTOR CARD (Slides from RIGHT) */}
          <motion.div
            variants={slideFromRight}
            className="md:col-span-2 md:row-span-1 relative group bg-primary dark:bg-primary/20 border border-primary dark:border-primary/30 rounded-3xl p-8 overflow-hidden shadow-xl"
          >
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 dark:bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="flex-1 space-y-4 text-white">
                <div className="w-12 h-12 bg-white/20 dark:bg-primary/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">24/7 AI Tutor</h3>
                <p className="text-white/80 dark:text-primary-foreground/80">
                  Stuck on a problem at 2 AM? Our custom-trained AiMS Assistant
                  is always online to guide students with Socratic questioning.
                </p>
              </div>

              <div className="flex-1 w-full flex flex-col gap-3">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl rounded-tr-none p-3 text-sm text-white self-end max-w-[80%] border border-white/10">
                  I'm stuck on this math logic...
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-3 text-sm text-slate-800 dark:text-slate-200 self-start max-w-[90%] shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                  Let's break it down! What is the first step you tried? 🤖
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
