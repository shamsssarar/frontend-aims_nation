"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

// Sub-component for the animated counter
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Spring physics for smooth counting
  const spring = useSpring(0, { stiffness: 50, damping: 20, duration: 2000 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString() + suffix);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

const metrics = [
  { label: "Active Students", value: 450, suffix: "+" },
  { label: "Curated Modules", value: 85, suffix: "+" },
  { label: "Expert Mentors", value: 24, suffix: "" },
  { label: "Lines of Code Written", value: 120, suffix: "k+" }, // 120k+
];

export default function ImpactMetrics() {
  return (
    <section className="py-24 bg-primary dark:bg-[#141c10] relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight flex items-center">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <div className="text-sm md:text-base text-primary-foreground/80 dark:text-slate-300 font-medium uppercase tracking-wider">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}