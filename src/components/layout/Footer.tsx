import Link from "next/link";
import { GraduationCap } from "lucide-react";

// --- BRAND COLORS ---
const theme = {
  green: "bg-[#6A8D52]",
  yellowText: "text-[#E8AD31]",
};

export function Footer() {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 rounded-t-[3rem] relative z-10 mt-[-2rem]">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- MAIN FOOTER CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-slate-800 pb-16">
          {/* Brand & Tagline */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${theme.green} text-white`}>
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                AiMS<span className={theme.yellowText}>Nation</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Guiding Futures With a Parent's Heart. The premier educational
              platform for the next generation of innovators, artists, and
              leaders.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-white transition-colors"
                >
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Student Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Careers (ATS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-400">
              <li>support@aimsnation.com</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM COPYRIGHT BAR --- */}
        <div className="flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} AiMS Nation. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
