"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import { enrollmentService } from "@/services/enrollment.services";
import { paymentService } from "@/services/payment.services"; // 👉 Imported the payment service!
import { Enrollment } from "@/types/Enrollment.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Clock, ArrowRight, Lock } from "lucide-react"; // 👉 Added Lock icon
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { CourseMaterialsSheet } from "@/components/ui/courseMaterialsSheet";

export default function MyCoursesPage() {
  const { data: session, isPending: isAuthPending } = useSession();
  
  // 👉 Split state into Active and Pending
  const [activeEnrollments, setActiveEnrollments] = useState<Enrollment[]>([]);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  useEffect(() => {
    if (isAuthPending) return;

    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchMyCoursesData = async () => {
      try {
        setIsLoading(true);
        
        // 👉 Fetch BOTH enrollments and payments, just like the dashboard!
        const [enrollmentsRes, paymentsRes] = await Promise.all([
          enrollmentService.getMyEnrollments(),
          paymentService.getMyPayments(),
        ]);

        if (isMounted) {
          const enrollments = (enrollmentsRes as any)?.data?.data || (enrollmentsRes as any)?.data || enrollmentsRes || [];
          const payments = (paymentsRes as any)?.data?.data || (paymentsRes as any)?.data || paymentsRes || [];

          // Filter out exactly what we need
          const active = enrollments.filter((e: any) => e.status === "ACTIVE");
          const pending = payments.filter((p: any) => p.status === "PENDING");

          setActiveEnrollments(active);
          setPendingCourses(pending);
        }
      } catch (error) {
        console.error("Failed to fetch courses data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyCoursesData();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, isAuthPending]);

  if (isAuthPending || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 👉 The Empty State only shows if BOTH active and pending are zero
  if (activeEnrollments.length === 0 && pendingCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          No Active Courses
        </h2>
        <p className="text-muted-foreground max-w-md">
          You aren't enrolled in any classes yet. Browse our catalog to start
          your learning journey at AiMS Nation.
        </p>
        <Button
          className="mt-4 bg-primary hover:bg-primary/90"
          onClick={() => (window.location.href = "/courses")}
        >
          Browse Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          My Learning
        </h2>
        <p className="text-muted-foreground mt-2">
          Access your enrolled classes and study materials here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* 👉 1. MAP THROUGH ACTIVE COURSES (Normal styling) */}
        {activeEnrollments.map((enrollment, index) => (
          <motion.div
            key={`active-${enrollment.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="flex flex-col h-full border-t-4 border-t-primary hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-xl">
                  {enrollment.course?.title || "Course Name"}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {enrollment.course?.description ||
                    "Dive into the curriculum and explore the advanced techniques offered in this module."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-muted-foreground bg-primary/10 p-2 rounded-md w-fit border border-primary/20">
                  <BookOpen className="mr-2 h-4 w-4 text-primary" />
                  Status:{" "}
                  <span className="font-semibold ml-1 text-primary">
                    ACTIVE
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group"
                  onClick={() => {
                    setSelectedCourseId(enrollment.courseId);
                    setSelectedCourseTitle(enrollment.course?.title || "Course");
                    setIsSheetOpen(true);
                  }}
                >
                  View Materials
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {/* 👉 2. MAP THROUGH PENDING COURSES (Locked styling, lower opacity) */}
        {pendingCourses.map((payment, index) => (
          <motion.div
            key={`pending-${payment.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (activeEnrollments.length + index) * 0.1 }}
          >
            <Card className="flex flex-col h-full border-t-4 border-t-amber-400 bg-slate-50/70 opacity-80">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2 text-xl text-slate-700">
                    {payment.course?.title || "Course Request"}
                  </CardTitle>
                  <Lock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                </div>
                <CardDescription className="line-clamp-2 mt-2 text-amber-700/80">
                  Your payment is currently being verified by an administrator. Materials will unlock automatically upon approval.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-amber-700 bg-amber-100/50 p-2 rounded-md w-fit border border-amber-200">
                  <Clock className="mr-2 h-4 w-4 text-amber-600" />
                  Status:{" "}
                  <span className="font-semibold ml-1">
                    VERIFYING
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                {/* Disabled button for pending courses */}
                <Button
                  disabled
                  className="w-full bg-slate-200 text-slate-500 border-none cursor-not-allowed"
                >
                  <Lock className="mr-2 h-4 w-4" /> Locked
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

      </div>

      <CourseMaterialsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        courseId={selectedCourseId}
        courseTitle={selectedCourseTitle}
      />
    </div>
  );
}