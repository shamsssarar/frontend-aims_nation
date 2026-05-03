import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";

export function Footer() {
  return (
    // We keep the dark slate, but add a beautiful glowing top border
    <footer className="bg-slate-950 relative overflow-hidden pt-20 pb-10 z-10 rounded-t-[3rem]">
      {/* --- SUBTLE TOP GLOW --- */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6A8D52]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#6A8D52]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- MAIN FOOTER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-slate-800/60 pb-16">
          {/* Column 1 & 2: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              {/* 👉 REAL LOGO IMPLEMENTATION */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo2.png"
                  alt="AiMS Nation Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-[#E8AD31]">
                AiMS<span className="text-[#6A8D52]">Nation</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Guiding Futures With a Parent's Heart. The ultimate ecosystem for
              kids to master academics, robotics, arts, and life skills.
            </p>

            {/* Newsletter Input (Industry Standard Feature) */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-semibold">
                Subscribe to our newsletter
              </h4>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 max-w-sm focus-within:border-[#6A8D52] transition-colors">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-none outline-none text-white text-sm px-4 w-full placeholder:text-slate-500"
                />
                <button className="bg-[#6A8D52] hover:bg-[#567541] text-white p-2 rounded-full transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>


          {/* Column 4: Company */}
          <div className="lg:col-span-1 w-fit">
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  Careers{" "}
                  <span className="bg-[#E8AD31]/20 text-[#E8AD31] text-[10px] px-2 py-0.5 rounded-full font-bold">
                    HIRING
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="lg:col-span-1 bg- w-fit">
            <h4 className="text-white font-semibold mb-6">Get in Touch</h4>
            <ul className="space-y-5 text-sm text-slate-400">
              {/* Email Line */}
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-[#6A8D52] group-hover:text-[#6A8D52] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                aimsnation.bd@gmail.com
              </li>
              {/* Note: Update this to your actual address later! */}
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#E8AD31] group-hover:text-[#E8AD31] transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-slate-300 font-medium">
                    AiMS Nation Headquarters
                  </span>
                  <span>Block-E, House-49 (3rd Floor)</span>
                  <span>3B Road 11</span>
                  <span>Dhaka 1212, Bangladesh</span>
                </div>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-8">
              <Link
                href="https://www.facebook.com/profile.php?id=61577507590078"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#6A8D52] hover:text-white hover:border-[#6A8D52] transition-all"
              >
                <FaFacebook className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.instagram.com/aims_nation/"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#E8AD31] hover:text-white hover:border-[#E8AD31] transition-all"
              >
                <FaInstagram className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* --- BOTTOM COPYRIGHT BAR --- */}
        <div className="flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} AiMS Nation. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
