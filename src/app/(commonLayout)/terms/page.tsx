"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 px-6 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E8AD31]/5 dark:bg-[#E8AD31]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E8AD31]/10 dark:bg-[#E8AD31]/20 text-[#E8AD31] mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Terms of Service
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and AiMS Nation ("we," "us" or "our"), concerning your access to and use of the AiMS Nation website and Learning Management System.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Educational Platform License</h2>
              <p>
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the platform strictly for personal, non-commercial educational purposes. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
                <li>Copy, modify, or distribute any part of the proprietary curriculum.</li>
                <li>Use the AI Socratic Tutor for purposes outside of the provided educational scopes.</li>
                <li>Attempt to bypass any measures of the Site designed to prevent or restrict access.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. User Accounts & Responsibilities</h2>
              <p>
                To access the student and parent dashboards, you may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine it is inappropriate.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Code of Conduct</h2>
              <p>
                AiMS Nation fosters a safe, inclusive environment. Any form of harassment, bullying, or disruption of the learning environment—whether physical or digital—will result in immediate review and potential suspension of account access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Modifications</h2>
              <p>
                We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Terms.
              </p>
            </section>

            <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm">
                By using our services, you acknowledge that you have read and understood these Terms and agree to be bound by them. For any legal inquiries, please contact us at <a href="mailto:aimsnation.bd@gmail.com" className="text-[#E8AD31] hover:underline">aimsnation.bd@gmail.com</a>.
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </main>
  );
}