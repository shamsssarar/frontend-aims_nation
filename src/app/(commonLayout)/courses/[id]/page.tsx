"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { courseService } from "@/services/courses.services";
import { useSession } from "@/lib/authClient";
import CourseRecommendations from "@/components/shared/CourseRecommendations";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  PlayCircle,
} from "lucide-react";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession() as any;

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Safely extract ID from params
  const courseId = params?.id as string;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        const res = (await courseService.getCourseById(courseId)) as any;

        // Handle standard Axios response structures securely
        const courseData = res?.data?.data || res?.data || res;
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourseDetails();
  }, [courseId]);

  const handleEnrollClick = () => {
    if (!session?.user) {
      router.push(`/login?redirect=/checkout/${courseId}`);
    } else {
      router.push(`/checkout/${courseId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-[#6A8D52] mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading course architecture...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950">
        <BookOpen className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">Course Not Found</h2>
        <Button
          onClick={() => router.push("/courses")}
          variant="link"
          className="mt-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
        </Button>
      </div>
    );
  }

  // Animation Variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* 1. THE HERO SECTION (Dark & Immersive) */}
      <div className="relative bg-slate-900 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[#6A8D52]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => router.push("/courses")}
            className="flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-[#E8AD31]/20 text-[#E8AD31] uppercase tracking-wider">
                <Star className="w-3 h-3 mr-1 fill-[#E8AD31]" /> Premium Catalog
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-xl line-clamp-3">
                {course.description ||
                  "Master the fundamentals and advanced techniques in this comprehensive curriculum designed by industry experts."}
              </p>

              <div className="flex items-center gap-6 pt-4 text-sm text-slate-400">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-[#6A8D52]" />{" "}
                  {course.maxCapacity || "Unlimited"} Seats
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-[#6A8D52]" /> Self-Paced
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-[#6A8D52]" />{" "}
                  Certificate Included
                </div>
              </div>
            </motion.div>

            {/* Hero Image/Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 group"
            >
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-slate-600" />
                </div>
              )}
              {/* Fake Play Button overlay for premium feel */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. THE MAIN CONTENT & STICKY PRICING CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Left Column: Details */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-12"
          >
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                About This Course
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed whitespace-pre-wrap">
                  {course.description ||
                    "Detailed description not provided yet."}
                </p>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                What you will learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard placeholder bullet points for premium feel */}
                {[
                  "Industry standard best practices",
                  "Hands-on real-world projects",
                  "Direct mentorship and guidance",
                  "Lifetime access to materials",
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#6A8D52] mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Right Column: The Sticky Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                Enrollment Fee
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  ৳{course.courseFee?.toLocaleString()}
                </span>
                <span className="text-lg text-slate-400 line-through">
                  ৳{(course.courseFee * 1.5).toLocaleString()}
                </span>
              </div>

              <Button
                onClick={handleEnrollClick}
                className="w-full py-6 text-lg font-bold bg-[#6A8D52] hover:bg-[#587843] text-white shadow-lg shadow-[#6A8D52]/25 hover:scale-[1.02] transition-all"
              >
                Enroll Now
              </Button>

              <p className="text-center text-xs text-slate-500 mt-4 mb-6 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 mr-1" /> 7-Day Money-Back
                Guarantee
              </p>

              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  This course includes:
                </h4>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center">
                    <PlayCircle className="w-4 h-4 mr-3 text-slate-400" />{" "}
                    On-demand video lectures
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-3 text-slate-400" />{" "}
                    Downloadable resources
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-slate-400" /> Access to
                    private community
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. THE AI RECOMMENDATION ENGINE */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          {/* We drop your previously built component right here */}
          <CourseRecommendations currentCourseId={courseId} />
        </motion.div>
      </div>
    </div>
  );
}
