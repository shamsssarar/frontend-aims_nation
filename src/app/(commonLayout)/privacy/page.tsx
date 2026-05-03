"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 px-6 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Last updated: May 2026
          </p>
        </motion.div>

        {/* Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800"
        >
          <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Introduction</h2>
              <p>
                At AiMS Nation, we take your privacy and the security of your children's data with the utmost seriousness. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our Learning Management System (LMS) portal.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                <li><strong className="text-slate-800 dark:text-slate-200">Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Student Data:</strong> Academic progress, behavioral metrics, and project submissions collected strictly for the purpose of parental reporting and mentorship.</li>
                <li><strong className="text-slate-800 dark:text-slate-200">Derivative Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, browser type, and access times.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Use of Your Information</h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                <li>Create and manage your parent/student account.</li>
                <li>Deliver personalized Socratic AI tutoring.</li>
                <li>Compile anonymous statistical data and analysis for use internally.</li>
                <li>Send you a weekly performance report regarding your child's progress.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Data Security</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at:
                <br /><br />
                <strong className="text-slate-900 dark:text-white">AiMS Nation Headquarters</strong><br />
                Block-E, House-49 (3rd Floor)<br />
                3B Road 11<br />
                Dhaka 1212, Bangladesh<br />
                <a href="mailto:aimsnation.bd@gmail.com" className="text-primary hover:underline">aimsnation.bd@gmail.com</a>
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </main>
  );
}