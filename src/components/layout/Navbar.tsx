"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/authClient"; // 👉 Import your auth hook!

const theme = {
  green: "bg-[#6A8D52]",
  greenText: "text-[#6A8D52]",
  secondaryText: "text-[#E8AD31]", // The Gold/Yellow color
  slate: "text-slate-900",
};

export function Navbar() {
  // 👉 Fetch the current logged-in user session
  const { data: session, isPending } = useSession();

  // 👉 Determine the correct dashboard route based on their role
  const getDashboardRoute = () => {
    if (!session?.user) return "/login";
    // TODO: Update user schema to include role field, or fetch role from API
    return "/dashboard"; // Default to student dashboard
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div
            className={`p-2 rounded-xl ${theme.green} text-white shadow-lg group-hover:scale-105 transition-transform`}
          >
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            {/* 👉 AiMS is now the secondary color */}
            <span className={theme.secondaryText}>AiMS</span>
            <span className={theme.greenText}>Nation</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 font-medium text-slate-600">
          {/* 👉 Changed "Our Philosophy" to "Contact" */}
          {["Courses", "Contact", "Careers"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="hover:text-[#6A8D52] transition-colors relative group"
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 w-0 h-0.5 ${theme.green} transition-all group-hover:w-full`}
              ></span>
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-full"></div>
          ) : session?.user ? (
            // 👉 IF LOGGED IN: Show dynamic dashboard button
            <Button
              asChild
              className={`${theme.green} hover:bg-[#587843] text-white shadow-lg shadow-[#6A8D52]/30 rounded-full px-6 transition-all hover:scale-105`}
            >
              <Link href={getDashboardRoute()}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            // 👉 IF LOGGED OUT: Show normal public buttons
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:flex text-slate-700 hover:text-[#6A8D52] hover:bg-[#6A8D52]/10 transition-colors"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className={`${theme.green} hover:bg-[#587843] text-white shadow-lg shadow-[#6A8D52]/30 rounded-full px-6 transition-all hover:scale-105`}
              >
                <Link href="/courses">Enroll Now</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
