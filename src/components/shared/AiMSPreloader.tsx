"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// We added a special trigger string "_LOGO_" at the very beginning
const words = [
  "_LOGO_",
  "DISCOVER.",
  "LEARN.",
  "BUILD.",
  "CREATE.",
  "INNOVATE.",
  "AIMS NATION",
];

export default function AiMSPreloader() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // --- DYNAMIC TIMING LOGIC ---
    // We want the logo and the final name to stay on screen longer than the rapid flash words
    let delayTime = 250; // Default for rapid flash words (DISCOVER, LEARN, etc.)

    if (words[index] === "_LOGO_") {
      delayTime = 1000; // Hold the logo on screen for 1 second
    } else if (words[index] === "AIMS NATION") {
      delayTime = 1200; // Hold the final brand name for 1.4 seconds
    }

    // The Sequence Logic
    if (index < words.length - 1) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, delayTime);
      return () => clearTimeout(timer);
    } else {
      // When the sequence ends, drop the curtain
      const timer = setTimeout(() => {
        setShow(false);
      }, delayTime);
      return () => clearTimeout(timer);
    }
  }, [index, isMounted]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          // Smooth fade out for the white curtain
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }} // Changed back to easeInOut for a smooth crossfade
          className="fixed inset-0 z-[99999] bg-white flex items-center justify-center overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          {/* The Container - Made slightly taller to accommodate the logo */}
          <div className="relative z-10 flex items-center justify-center h-60 overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={index}
                // Everything (Logo AND Text) uses this smooth vertical conveyor belt motion
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center justify-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-slate-900"
              >
                {/* 1. Show the Logo if it's the first step */}
                {words[index] === "_LOGO_" ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.5 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative w-32 h-32 md:w-36 md:h-36 lg:w-48 lg:h-48"
                  >
                    <Image
                      src="/logo2.png"
                      alt="AiMS Nation Logo"
                      fill
                      className="object-contain drop-shadow-xl"
                      priority
                    />
                  </motion.div>
                ) : words[index] === "AIMS NATION" ? (
                  <span className="tracking-tight text-[#E8AD31]">
                    AiMS<span className="text-[#4A6D32]">Nation</span>
                  </span>
                ) : (
                  words[index]
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
