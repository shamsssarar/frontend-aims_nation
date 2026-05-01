"use client";

import { motion, Variants } from "framer-motion";
import { HeartHandshake, Cpu, Paintbrush } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 20 } 
  },
};

const pillars = [
  {
    icon: HeartHandshake,
    title: "Empathy-First Mentorship",
    description: "We believe a child's emotional well-being is the foundation of learning. Our educators are trained to mentor with patience, understanding, and a parent's heart.",
    color: "text-rose-500",
    bgGlow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]",
    borderColor: "group-hover:border-rose-500/50"
  },
  {
    icon: Cpu,
    title: "Future-Proof Technology",
    description: "We don't just teach kids how to use technology; we teach them how to build it. From advanced robotics to modern web development, they learn the tools of tomorrow.",
    color: "text-[#E8AD31]", // AiMS Yellow
    bgGlow: "group-hover:shadow-[0_0_40px_rgba(232,173,49,0.15)]",
    borderColor: "group-hover:border-[#E8AD31]/50"
  },
  {
    icon: Paintbrush,
    title: "Creative Freedom",
    description: "Logic without creativity is robotic. We deeply integrate the arts and culinary skills to ensure our students develop imagination, taste, and independent thought.",
    color: "text-[#6A8D52]", // AiMS Green
    bgGlow: "group-hover:shadow-[0_0_40px_rgba(106,141,82,0.15)]",
    borderColor: "group-hover:border-[#6A8D52]/50"
  }
];

export default function CorePillars() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Our Educational Pillars
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            The core philosophies that drive every curriculum, class, and interaction at AiMS Nation.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className={`group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all duration-500 cursor-default ${pillar.bgGlow} ${pillar.borderColor}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-950">
                  <Icon className={`w-7 h-7 ${pillar.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}