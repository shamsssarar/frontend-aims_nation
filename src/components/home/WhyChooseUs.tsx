"use client";

import { motion } from "framer-motion";
import { Heart, FileText, ShieldCheck, BookOpen } from "lucide-react";

// --- BRAND COLORS ---
const theme = {
  greenText: "text-[#6A8D52]",
  yellowText: "text-[#E8AD31]",
  slate: "text-slate-900",
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
  return (
    <section className="py-24 bg-[#FDFDF9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* --- LEFT COLUMN: The Copy & Features --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring" as const, stiffness: 50, damping: 20 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold text-sm">
              <Heart className="h-4 w-4 fill-current" />
              The AiMS Promise
            </div>

            <h2
              className={`text-4xl md:text-5xl font-bold tracking-tight ${theme.slate}`}
            >
              Built by educators.
              <br />
              Trusted by parents.
            </h2>

            <p className="text-lg text-slate-600">
              We don't just teach subjects; we cultivate character. Our
              proprietary LMS dashboard keeps parents fully integrated into
              their child's daily progress, behavior, and achievements.
            </p>

            <div className="space-y-6 pt-4">
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
                  <div className="mt-1 bg-white p-3 rounded-xl shadow-sm border border-slate-100 h-12 w-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* --- RIGHT COLUMN: Interactive Glassmorphism Mockup --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring" as const, stiffness: 50, damping: 20 }}
            className="relative h-[500px] w-full bg-gradient-to-tr from-[#6A8D52]/20 to-[#E8AD31]/20 rounded-3xl overflow-hidden border border-white/50 shadow-2xl flex items-center justify-center"
          >
            {/* The Floating UI Card */}
            <motion.div
              {...floatMockup}
              className="w-[85%] h-[85%] bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-6 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-default"
            >
              {/* Fake Header Skeleton */}
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
              </div>

              {/* Fake Metric Cards */}
              <div className="flex gap-4">
                <div
                  className={`h-24 flex-1 bg-gradient-to-br from-[#6A8D52] to-[#4A6D32] rounded-xl p-4 text-white relative overflow-hidden shadow-inner`}
                >
                  <div className="text-3xl font-bold relative z-10">45</div>
                  <div className="text-xs opacity-80 relative z-10 mt-1">
                    Total Students
                  </div>
                  <BookOpen className="absolute -bottom-2 -right-2 h-16 w-16 opacity-20" />
                </div>
                <div
                  className={`h-24 flex-1 bg-gradient-to-br from-[#E8AD31] to-[#c79121] rounded-xl p-4 text-white relative overflow-hidden shadow-inner`}
                >
                  <div className="text-3xl font-bold relative z-10">A+</div>
                  <div className="text-xs opacity-80 relative z-10 mt-1">
                    Avg Behavior
                  </div>
                  <Heart className="absolute -bottom-2 -right-2 h-16 w-16 opacity-20 fill-current" />
                </div>
              </div>

              {/* Fake Roster List */}
              <div className="flex-1 bg-white/60 rounded-xl border border-white p-4 mt-2">
                <div className="h-3 w-24 bg-slate-200 rounded-full mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                        <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                      </div>
                      <div className="h-6 w-16 bg-green-100 rounded-full border border-green-200 relative overflow-hidden">
                        {/* Animated progress bar inside the pill */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="absolute inset-0 bg-green-200 opacity-50"
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
