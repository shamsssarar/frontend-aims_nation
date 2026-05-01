"use client";

import { motion } from "framer-motion";
import { 
  Trophy, Code, Palette, ChefHat, 
  MessagesSquare, Rocket, Music, Microscope 
} from "lucide-react";

// The "Moments" that make up the AiMS Culture
const topRow = [
  { title: "Annual Robotics Regionals", icon: Rocket, color: "text-blue-500", bg: "bg-blue-500/10 dark:bg-blue-500/20" },
  { title: "Midnight Hackathons", icon: Code, color: "text-[#6A8D52]", bg: "bg-[#6A8D52]/10 dark:bg-[#6A8D52]/20" },
  { title: "Debate Championships", icon: MessagesSquare, color: "text-rose-500", bg: "bg-rose-500/10 dark:bg-rose-500/20" },
  { title: "Culinary Showcases", icon: ChefHat, color: "text-orange-500", bg: "bg-orange-500/10 dark:bg-orange-500/20" },
];

const bottomRow = [
  { title: "Art & Design Exhibitions", icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10 dark:bg-purple-500/20" },
  { title: "Science Fairs", icon: Microscope, color: "text-teal-500", bg: "bg-teal-500/10 dark:bg-teal-500/20" },
  { title: "Music & Theatre Galas", icon: Music, color: "text-pink-500", bg: "bg-pink-500/10 dark:bg-pink-500/20" },
  { title: "Innovation Awards", icon: Trophy, color: "text-[#E8AD31]", bg: "bg-[#E8AD31]/10 dark:bg-[#E8AD31]/20" },
];

// Duplicating the arrays to create the seamless infinite scrolling effect
const seamlessTop = [...topRow, ...topRow, ...topRow];
const seamlessBottom = [...bottomRow, ...bottomRow, ...bottomRow];

export default function CultureVibe() {
  return (
    // 👉 The overflow-hidden is crucial here so the marquees don't break the page width
    <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
        >
          Life at <span className="text-primary">AiMS Nation</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          Education isn't just about what happens at the desk. It's about the community, the competitions, and the memories we build together.
        </motion.p>
      </div>

      {/* --- THE INFINITE MARQUEE ZONE --- */}
      {/* 👉 We apply a slight rotation (-rotate-3) to the whole container for that modern edgy look */}
      <div className="relative -mx-10 transform -rotate-3 scale-105">
        
        {/* Top Row (Scrolls Left) */}
        <div className="flex w-[300vw] mb-6">
          <motion.div
            animate={{ x: [0, "-33.33%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex gap-6 whitespace-nowrap"
          >
            {seamlessTop.map((item, index) => (
              <CultureCard key={index} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Bottom Row (Scrolls Right) */}
        <div className="flex w-[300vw] justify-end">
          <motion.div
            // 👉 Notice the animation goes from -33.33% to 0, reversing the direction!
            animate={{ x: ["-33.33%", 0] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
            className="flex gap-6 whitespace-nowrap"
          >
            {seamlessBottom.map((item, index) => (
              <CultureCard key={index} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Gradient overlays to fade out the edges smoothly */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none z-10" />
      </div>

    </section>
  );
}

// Sub-component for the individual culture cards
function CultureCard({ item }: { item: any }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-8 py-6 rounded-2xl shadow-sm hover:shadow-lg dark:shadow-none transition-shadow cursor-default">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}>
        <Icon className={`w-6 h-6 ${item.color}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
        {item.title}
      </h3>
    </div>
  );
}