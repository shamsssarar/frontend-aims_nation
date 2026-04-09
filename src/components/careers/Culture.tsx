// src/components/careers/Culture.tsx
import { Briefcase, GraduationCap, Sparkles, Globe, HeartHandshake, Laptop } from "lucide-react";

const perks = [
  {
    name: "Flexible Scheduling",
    description: "Teach on your own time. Set your availability and manage classes easily through your portal.",
    icon: Briefcase,
  },
  {
    name: "Modern Curriculum",
    description: "From Advanced Robotics to Culinary Arts, teach subjects that actually excite students.",
    icon: GraduationCap,
  },
  {
    name: "Powerful Tools",
    description: "Our platform handles billing, enrollment, and file hosting. You just focus on teaching.",
    icon: Sparkles,
  },
  {
    name: "Work from Anywhere",
    description: "100% remote teaching capabilities. Connect with students whether you are in Dhaka or abroad.",
    icon: Globe,
  },
  {
    name: "Supportive Community",
    description: "Join a network of passionate educators. Share resources, tips, and grow together.",
    icon: HeartHandshake,
  },
  {
    name: "Tech-First Approach",
    description: "Utilize state-of-the-art virtual whiteboards, coding environments, and live video tools.",
    icon: Laptop,
  },
];

export function Culture() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Why teach at AiMS Nation?
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            We handle the logistics, the marketing, and the tech. You bring the passion, the knowledge, and the mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, index) => (
            <div 
              key={index} 
              className="bg-slate-50 dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#6A8D52] dark:hover:border-[#6A8D52] transition-colors group"
            >
              <div className="w-12 h-12 bg-[#6A8D52]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <perk.icon className="w-6 h-6 text-[#6A8D52]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {perk.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}