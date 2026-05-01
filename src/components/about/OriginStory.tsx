"use client";

import { motion, Variants } from "framer-motion";
import { Target, Users, Zap } from "lucide-react";

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

export default function OriginStory() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 relative z-20 rounded-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.4)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- LEFT COLUMN: The Narrative --- */}
          <motion.div
            variants={textContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.h2 variants={slideUp} className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              Built by educators. <br />
              <span className="text-secondary">Driven by innovation.</span>
            </motion.h2>

            <motion.div variants={slideUp} className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                The traditional classroom was built for a world that no longer exists. We saw brilliant students graduating without the practical logic, creative problem-solving, or emotional intelligence required to thrive in the modern tech landscape.
              </p>
              <p>
                AiMS Nation was founded to change that paradigm. By blending rigorous core academics with hands-on robotics, deep creative arts, and essential life skills, we treat every child not as a standardized test score, but as a future innovator.
              </p>
            </motion.div>

            <motion.div variants={slideUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <Target className="w-8 h-8 text-primary" />
                <h4 className="font-bold text-slate-900 dark:text-white">Precision Learning</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tailored modules adapting to individual growth.</p>
              </div>
              <div className="space-y-2">
                <Users className="w-8 h-8 text-secondary" />
                <h4 className="font-bold text-slate-900 dark:text-white">Parental Integration</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total transparency via our custom LMS dashboard.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* --- RIGHT COLUMN: The Visual Anchor --- */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="relative h-[600px] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center group"
          >
            {/* Abstract Background Inside the Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-secondary/20 dark:from-primary/10 dark:via-slate-950 dark:to-secondary/10" />
            
            {/* Animated Centerpiece */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-3/4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/50 dark:border-slate-700"
            >
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                "Education is not the learning of facts, but the training of the mind to think."
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">— Our Core Philosophy</p>
            </motion.div>

            {/* Decorative Grid Lines */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}