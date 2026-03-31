"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring" as const, stiffness: 40, damping: 20 }}
          className="relative rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {/* --- GORGEOUS BACKGROUND GRADIENT --- */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#6A8D52] z-0" />

          {/* --- ABSTRACT GLOWS --- */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8AD31]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 z-0" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6A8D52]/40 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 z-0" />

          {/* --- CONTENT --- */}
          <div className="relative z-10 px-8 py-20 md:py-28 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                type: "spring" as const,
                stiffness: 200,
                damping: 15,
              }}
              className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20 shadow-xl"
            >
              <Sparkles className="h-10 w-10 text-[#E8AD31]" />
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 max-w-3xl leading-tight">
              Ready to shape your child's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8AD31] to-[#fde047]">
                brilliant future?
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
              Admissions for the 2026 academic year are now open. Join the AiMS
              Nation family today and watch them thrive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-lg rounded-full bg-[#E8AD31] hover:bg-[#c79121] text-slate-900 font-bold shadow-xl shadow-[#E8AD31]/20 group transition-all hover:scale-105"
              >
                <Link href="/courses">
                  Secure Their Spot
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-10 text-lg rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 shadow-sm transition-all hover:scale-105"
              >
                <Link href="/contact">Talk to an Advisor</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
