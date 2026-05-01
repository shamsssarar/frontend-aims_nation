"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { BookOpen, Code2, Palette, ChefHat, Languages } from "lucide-react";

// --- BRAND COLORS ---
const theme = {
  greenText: "text-[#6A8D52]",
  greenBorder: "border-[#6A8D52]",
  yellowText: "text-[#E8AD31]",
};

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

export function UniverseOfLearning() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewAmount, setViewAmount] = useState(0.2);

  useEffect(() => {
    // If the screen is wider than 768px (Desktop), set it to 0.70 (70%)
    const handleResize = () => {
      setViewAmount(window.innerWidth >= 768 ? 0.20 : 0.2);
    };

    // Check immediately on load
    handleResize();

    // Listen for window resizing
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // 👉 ADDED: ref={containerRef} and overflow-hidden for the slide effect
    <section 
      ref={containerRef}
      className="py-24 bg-white dark:bg-slate-950 relative z-20 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- SECTION HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          // 👉 once: false triggers the exit animation
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            Our Universe of Learning
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
            Carefully curated modules designed to build holistic, real-world
            skills through interactive play and structured discovery.
          </p>
        </motion.div>

        {/* --- BENTO BOX GRID (Animated Container) --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          // 👉 DYNAMIC VIEWPORT AMOUNT
          viewport={{ once: false, amount: viewAmount }}
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]"
        >
          {/* Card 1: Robotics (Large Feature) - Slides from LEFT */}
          <CourseCard
            variants={slideFromLeft}
            className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 text-white dark:border dark:border-slate-800 group"
            title="Advanced Robotics & Coding"
            description="Building logic from the ground up. Students program microcontrollers, build mechanical arms, and bring their code to life."
            icon={<Code2 className={`h-8 w-8 ${theme.yellowText}`} />}
            hoverEffect="hover:shadow-[0_0_40px_rgba(232,173,49,0.2)] dark:hover:shadow-[0_0_40px_rgba(232,173,49,0.15)]"
          />

          {/* Card 2: Arts - Slides from RIGHT */}
          <CourseCard
            variants={slideFromRight}
            className="md:col-span-1 md:row-span-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 group"
            title="Creative Drawing"
            description="Unlocking imagination through color theory and sketching."
            icon={
              <Palette className="h-8 w-8 text-rose-500 dark:text-rose-400" />
            }
            textColor="text-rose-950 dark:text-rose-100"
            descColor="text-rose-700/80 dark:text-rose-300/80"
            hoverEffect="hover:border-rose-300 dark:hover:border-rose-700/50"
          />

          {/* Card 3: Academics - Slides from LEFT */}
          <CourseCard
            variants={slideFromLeft}
            className="md:col-span-1 md:row-span-1 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 group"
            title="Core Academics"
            description="Mastering school fundamentals with personalized mentorship."
            icon={
              <BookOpen className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            }
            textColor="text-indigo-950 dark:text-indigo-100"
            descColor="text-indigo-700/80 dark:text-indigo-300/80"
            hoverEffect="hover:border-indigo-300 dark:hover:border-indigo-700/50"
          />

          {/* Card 4: Cooking - Slides from LEFT */}
          <CourseCard
            variants={slideFromLeft}
            className="md:col-span-1 md:row-span-1 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 group"
            title="Culinary Arts"
            description="Life skills in the kitchen. Safety, nutrition, and delicious fun."
            icon={
              <ChefHat className="h-8 w-8 text-orange-500 dark:text-orange-400" />
            }
            textColor="text-orange-950 dark:text-orange-100"
            descColor="text-orange-700/80 dark:text-orange-300/80"
            hoverEffect="hover:border-orange-300 dark:hover:border-orange-700/50"
          />

          {/* Card 5: Languages - Slides from RIGHT */}
          <CourseCard
            variants={slideFromRight}
            className={`md:col-span-1 md:row-span-1 bg-[#6A8D52]/10 dark:bg-[#6A8D52]/15 border ${theme.greenBorder}/20 dark:border-[#6A8D52]/30 group`}
            title="Arabic & Languages"
            description="Connecting to roots and expanding global communication."
            icon={
              <Languages
                className={`h-8 w-8 ${theme.greenText} dark:text-[#8AB071]`}
              />
            }
            textColor="text-[#4A6D32] dark:text-[#A3C68B]"
            descColor="text-[#6A8D52] dark:text-[#8AB071]/80"
            hoverEffect={`hover:border-[#6A8D52]/50 dark:hover:border-[#6A8D52]/60`}
          />
        </motion.div>
      </div>
    </section>
  );
}

// --- SUB-COMPONENT FOR CARDS ---
interface CourseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  textColor?: string;
  descColor?: string;
  hoverEffect?: string;
  variants: Variants; // 👉 ADDED: Make variants a required prop!
}

function CourseCard({
  title,
  description,
  icon,
  className,
  textColor = "text-white",
  descColor = "text-slate-300",
  hoverEffect,
  variants, // 👉 DESTRUCTURED
}: CourseCardProps) {
  return (
    <motion.div
      // 👉 ASSIGNED DYNAMICALLY
      variants={variants}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative p-8 rounded-3xl overflow-hidden cursor-pointer transition-all duration-200 ${className} ${hoverEffect}`}
    >
      <div className="relative z-10 h-full flex flex-col">
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/10 dark:border-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
          {icon}
        </div>

        <div className="mt-auto space-y-3">
          <h3
            className={`text-2xl font-bold ${textColor} transition-colors duration-300`}
          >
            {title}
          </h3>
          <p
            className={`text-sm leading-relaxed ${descColor} transition-colors duration-300`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}