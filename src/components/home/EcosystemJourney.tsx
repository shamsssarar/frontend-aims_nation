"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, Cpu, Palette, Utensils } from "lucide-react";

const milestones = [
  {
    title: "Core Academics",
    description: "Mastering school fundamentals with personalized mentorship and AI-driven insights.",
    icon: BookOpen,
    align: "left",
  },
  {
    title: "Robotics & Tech",
    description: "Building the future. Hands-on engineering, coding, and logical problem solving.",
    icon: Cpu,
    align: "right",
  },
  {
    title: "Arts & Creativity",
    description: "Expressing imagination through digital design, painting, and visual storytelling.",
    icon: Palette,
    align: "left",
  },
  {
    title: "Culinary & Life Skills",
    description: "Essential real-world skills. Safety, nutrition, and the joy of cooking.",
    icon: Utensils,
    align: "right",
  },
];

export default function EcosystemJourney() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    // 👉 ADDED: dark:bg-slate-950 for the main section background
    <section ref={containerRef} className="relative py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // 👉 ADDED: dark:text-white
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            The AiMS <span className="text-primary">Ecosystem</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            // 👉 ADDED: dark:text-slate-400
            className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            A complete journey to grow their mind and fuel their future.
          </motion.p>
        </div>

        {/* The Journey Timeline */}
        <div className="relative">
          
          {/* The Static Background Line */}
          {/* 👉 ADDED: dark:bg-slate-800 */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 transform md:-translate-x-1/2 rounded-full" />

          {/* The Animated Scroll Line (Primary Color stays the same, it glows perfectly in dark mode!) */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-primary transform md:-translate-x-1/2 rounded-full origin-top shadow-[0_0_15px_rgba(22,163,74,0.5)]" 
          />

          {/* The Milestones */}
          <div className="space-y-24">
            {milestones.map((item, index) => {
              const Icon = item.icon;
              const isLeft = item.align === "left";

              return (
                <div key={index} className="relative flex items-center md:justify-between w-full">
                  
                  {/* Left Side Content */}
                  <div className={`hidden md:block w-5/12 ${!isLeft ? "md:invisible" : ""}`}>
                    <CardContent item={item} direction={-50} />
                  </div>

                  {/* The Center Node / Glowing Dot */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    // 👉 ADDED: dark:border-slate-950 to blend the ring into the dark background
                    className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-secondary shadow-xl z-10"
                  >
                    <Icon className="w-5 h-5 text-slate-900" />
                  </motion.div>

                  {/* Right Side Content / Mobile Content */}
                  <div className={`w-full pl-20 md:pl-0 md:w-5/12 ${isLeft ? "md:hidden" : ""}`}>
                     <CardContent item={item} direction={50} isMobileRight={isLeft} />
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

// Sub-component for the actual Cards
function CardContent({ item, direction, isMobileRight = false }: { item: any, direction: number, isMobileRight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      // 👉 ADDED: dark:bg-slate-900, dark:border-slate-800, dark:shadow-black/50
      className={`bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-300 ${isMobileRight ? 'block md:hidden' : ''}`}
    >
      {/* 👉 ADDED: dark:text-white */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
      {/* 👉 ADDED: dark:text-slate-400 */}
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{item.description}</p>
    </motion.div>
  );
}