"use client";

import { motion } from "framer-motion";
import { BookOpen, Code2, Palette, ChefHat, Languages } from "lucide-react";

// --- BRAND COLORS ---
const theme = {
  greenText: "text-[#6A8D52]",
  greenBorder: "border-[#6A8D52]",
  yellowText: "text-[#E8AD31]",
  slate: "text-slate-900",
};

export function UniverseOfLearning() {
  return (
    <section className="py-24 bg-white relative z-20 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- SECTION HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tight ${theme.slate}`}
          >
            Our Universe of Learning
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Carefully curated modules designed to build holistic, real-world
            skills through interactive play and structured discovery.
          </p>
        </motion.div>

        {/* --- BENTO BOX GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Card 1: Robotics (Large Feature) */}
          <CourseCard
            className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white group"
            title="Advanced Robotics & Coding"
            description="Building logic from the ground up. Students program microcontrollers, build mechanical arms, and bring their code to life."
            icon={<Code2 className={`h-8 w-8 ${theme.yellowText}`} />}
            hoverEffect="group-hover:shadow-[0_0_30px_rgba(232,173,49,0.3)]"
          />

          {/* Card 2: Arts */}
          <CourseCard
            className="md:col-span-1 md:row-span-1 bg-rose-50 border border-rose-100 group"
            title="Creative Drawing"
            description="Unlocking imagination through color theory and sketching."
            icon={<Palette className="h-8 w-8 text-rose-500" />}
            textColor="text-rose-950"
            descColor="text-rose-700/80"
            hoverEffect="group-hover:border-rose-300"
          />

          {/* Card 3: Academics */}
          <CourseCard
            className="md:col-span-1 md:row-span-1 bg-indigo-50 border border-indigo-100 group"
            title="Core Academics"
            description="Mastering school fundamentals with personalized mentorship."
            icon={<BookOpen className="h-8 w-8 text-indigo-500" />}
            textColor="text-indigo-950"
            descColor="text-indigo-700/80"
            hoverEffect="group-hover:border-indigo-300"
          />

          {/* Card 4: Cooking */}
          <CourseCard
            className="md:col-span-1 md:row-span-1 bg-orange-50 border border-orange-100 group"
            title="Culinary Arts"
            description="Life skills in the kitchen. Safety, nutrition, and delicious fun."
            icon={<ChefHat className="h-8 w-8 text-orange-500" />}
            textColor="text-orange-950"
            descColor="text-orange-700/80"
            hoverEffect="group-hover:border-orange-300"
          />

          {/* Card 5: Languages */}
          <CourseCard
            className={`md:col-span-1 md:row-span-1 bg-[#6A8D52]/10 border ${theme.greenBorder}/20 group`}
            title="Arabic & Languages"
            description="Connecting to roots and expanding global communication."
            icon={<Languages className={`h-8 w-8 ${theme.greenText}`} />}
            textColor="text-[#4A6D32]"
            descColor="text-[#6A8D52]"
            hoverEffect={`group-hover:border-[#6A8D52]/50`}
          />
        </div>
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
}

function CourseCard({
  title,
  description,
  icon,
  className,
  textColor = "text-white",
  descColor = "text-slate-300",
  hoverEffect,
}: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      className={`relative p-8 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${className} ${hoverEffect}`}
    >
      <div className="relative z-10 h-full flex flex-col">
        {/* Icon Wrapper with subtle glass effect */}
        <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/5">
          {icon}
        </div>

        {/* Text Content */}
        <div className="mt-auto space-y-3">
          <h3 className={`text-2xl font-bold ${textColor}`}>{title}</h3>
          <p className={`text-sm leading-relaxed ${descColor}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Decorative gradient overlay that fades in on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
