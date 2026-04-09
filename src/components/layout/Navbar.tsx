"use client";
import Image from "next/image";
import logo2 from "../../../public/logo2.png";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  User,
  Sun,
  Moon,
  LogOut,
  Menu, // 👉 Imported Menu (Hamburger)
  X, // 👉 Imported X (Close)
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/authClient";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 👉 State is ready!
  const router = useRouter();

  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

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

  const navClasses = `fixed top-0 w-full transition-all duration-300 z-50 ${
    isScrolled || !transparent
      ? "backdrop-blur-xl bg-white/80 dark:bg-slate-950 shadow-sm dark:border-slate-800"
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
          {/* 👉 1. Removed the green background box so the white JPEG blends better */}
          {/* 👉 2. Increased size slightly to w-12 h-12 so the tree is visible */}
          <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src={logo2}
              alt="AiMS Nation Logo"
              fill // 👉 FIX: Replaces width/height. Tells Next.js to fill the parent w-12 h-12 box perfectly!
              sizes="48px" // Helps Next.js optimize the exact size
              priority={true}
              // 👉 FIX: Removed quality={90} to clear the console warning
              className="object-contain mix-blend-multiply dark:mix-blend-normal"
              // Note: mix-blend-multiply magically makes white backgrounds invisible in light mode!
            />
          </div>

          {/* 3. Dynamic Text */}
          <span className="text-2xl font-extrabold tracking-tight">
            <span className={theme.secondaryText}>AiMS</span>
            <span className={theme.greenText}>Nation</span>
          </span>
        </Link>
        {/* DESKTOP LINKS */}
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
          {/* THEME TOGGLE BUTTON */}
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
            <div className="hidden md:block h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
          ) : session?.user ? (
            <div className="relative">
              {/* Account Button */}
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

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl py-2 flex flex-col z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/my-profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#6A8D52] dark:hover:text-[#6A8D52] flex items-center transition-colors"
                  >
                    <User className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                    My Profile
                  </Link>
                  <Link
                    href={getDashboardRoute()}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#6A8D52] dark:hover:text-[#6A8D52] flex items-center transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                    Dashboard
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await signOut();
                        router.push("/login");
                        router.refresh();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-red-500 dark:text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 👉 WRAPPED DESKTOP BUTTONS: Hidden on mobile! */
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className="text-slate-700 dark:text-slate-300 hover:text-[#6A8D52] dark:hover:text-[#6A8D52] hover:bg-[#6A8D52]/10 transition-colors"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className={`${theme.green} hover:bg-[#587843] text-white shadow-lg shadow-[#6A8D52]/30 rounded-full px-6 transition-all hover:scale-105`}
              >
                <Link href="/register">Enroll Now</Link>
              </Button>
            </div>
          )}

          {/* 👉 MOBILE HAMBURGER TOGGLE BUTTON */}
          <button
            className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-[#6A8D52] transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* 👉 THE NEW MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shadow-xl flex flex-col px-6 py-4 animate-in slide-in-from-top-2">
          {/* Mobile Main Links */}
          <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-4">
            {["Courses", "Contact", "Careers"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-[#6A8D52] dark:hover:text-[#6A8D52] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Buttons (Only show if logged out) */}
          {!session?.user && !isPending && (
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                asChild
                className="w-full justify-center border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className={`w-full justify-center ${theme.green} hover:bg-[#587843] text-white shadow-lg shadow-[#6A8D52]/30`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/register">Enroll Now</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </motion.nav>
  );
}
