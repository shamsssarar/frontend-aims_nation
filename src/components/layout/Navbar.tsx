"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  User,
  Sun, // 👉 Imported Sun
  Moon,
  LogOut, // 👉 Imported Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/authClient";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes"; // 👉 Re-enabled useTheme
import { signOut } from "@/lib/authClient";
import { useRouter } from "next/navigation";
const theme = {
  green: "bg-[#6A8D52]",
  greenText: "text-[#6A8D52]",
  secondaryText: "text-[#E8AD31]",
};

export function Navbar({ transparent = true }: { transparent?: boolean }) {
  const { data: session, isPending } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  // 👉 Theme & Hydration State
  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true); // Tells Next.js it's safe to render the theme button

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardRoute = () => {
    if (!session?.user) return "/login";
    return "/dashboard";
  };

  // 👉 ADDED: dark:bg-slate-950/80 and dark:border-slate-800 for dark mode frosted glass!
  const navClasses = `fixed top-0 w-full transition-all duration-300 z-50 ${
    isScrolled || !transparent
      ? "backdrop-blur-xl bg-white/80 dark:bg-slate-950 shadow-sm  dark:border-slate-800"
      : "bg-transparent dark:bg-slate-950"
  }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
      className={navClasses}
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
            <span className={theme.secondaryText}>AiMS</span>
            <span className={theme.greenText}>Nation</span>
          </span>
        </Link>

        {/* DESKTOP LINKS - Added dark:text-slate-300 so they are visible in dark mode! */}
        <div className="hidden md:flex gap-8 font-medium text-slate-600 dark:text-slate-300">
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
        <div className="flex items-center gap-2 md:gap-4">
          {/* 👉 THEME TOGGLE BUTTON */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(currentTheme === "dark" ? "light" : "dark")
              }
              className="rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {isPending ? (
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
          ) : session?.user ? (
            <div className="relative">
              {/* Account Button - Added dark mode styles */}
              <Button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                variant="outline"
                className="flex items-center gap-2 rounded-full border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors px-3 md:px-4"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:block font-medium text-sm">
                  My Account
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                />
              </Button>

              {/* Dropdown Menu - Added dark mode styles */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl py-2 flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Email Header */}
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {session.user.email}
                    </p>
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/my-profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#6A8D52] dark:hover:text-[#6A8D52] flex items-center transition-colors"
                  >
                    <User className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                    My Profile
                  </Link>

                  {/* Dashboard Link */}
                  <Link
                    href={getDashboardRoute()}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#6A8D52] dark:hover:text-[#6A8D52] flex items-center transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                    Dashboard
                  </Link>

                  {/* 👉 NEW: Sign Out Button */}
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false); // Close the menu instantly
                        await signOut(); // Clear the better-auth session
                        router.push("/login"); // Redirect to login page
                        router.refresh(); // Force Next.js to update the UI
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-red-500 dark:text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:flex text-slate-700 dark:text-slate-300 hover:text-[#6A8D52] dark:hover:text-[#6A8D52] hover:bg-[#6A8D52]/10 transition-colors"
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
