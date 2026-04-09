// src/components/careers/Process.tsx
import { FileText, Users, Presentation, CheckCircle } from "lucide-react";

const steps = [
  {
    title: "1. Submit Profile",
    description:
      "Fill out the application below with your resume and teaching specialty.",
    icon: FileText,
  },
  {
    title: "2. In-Person Interview",
    description:
      "Visit our institution for a face-to-face chat with our Admin team to align on core values.",
    icon: Users, // 👉 Changed to the new icon
  },
  {
    title: "3. Demo Class",
    description:
      "Showcase your teaching style with a short 10-minute mock lesson.",
    icon: Presentation,
  },
  {
    title: "4. Welcome Aboard",
    description:
      "Get your platform access, build your courses, and start earning!",
    icon: CheckCircle,
  },
];

export function Process() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Our Hiring Process
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            We value your time. Our streamlined process is designed to get
            passionate educators onto the platform quickly.
          </p>
        </div>

        {/* The Timeline Container */}
        <div className="relative">
          {/* The connecting horizontal line (Desktop only) */}
          <div
            className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-800"
            aria-hidden="true"
          ></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center pt-8 md:pt-0">
                {/* 👉 FIXED: Adjusted the line to start exactly at the bottom of the icon (6rem) and reach exactly to the next step (-2.5rem) */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-[6rem] bottom-[-2.5rem] left-1/2 w-0.5 -translate-x-1/2 bg-slate-200 dark:bg-slate-800 z-0"></div>
                )}

                {/* The Icon Circle (No changes here) */}
                <div className="relative z-10 mx-auto w-24 h-24 bg-white dark:bg-slate-900 rounded-full border-4 border-slate-50 dark:border-slate-950 shadow-xl flex items-center justify-center mb-4 ring-1 ring-slate-200 dark:ring-slate-800 group hover:ring-[#6A8D52] dark:hover:ring-[#6A8D52] transition-all">
                  <step.icon className="w-10 h-10 text-[#6A8D52] group-hover:scale-110 transition-transform" />
                </div>

                {/* 👉 FIXED: Wrapped the text in a z-10 container with a solid background! 
                    This perfectly hides the line behind the text so it never overlaps! */}
                <div className="relative z-10 bg-slate-50 dark:bg-slate-950 py-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
