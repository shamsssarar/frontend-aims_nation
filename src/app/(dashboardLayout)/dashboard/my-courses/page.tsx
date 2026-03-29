"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import { enrollmentService } from "@/services/enrollment.services";
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
import { Loader2, BookOpen, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { CourseMaterialsSheet } from "@/components/ui/courseMaterialsSheet";

export default function MyCoursesPage() {
  const { data: session, isPending: isAuthPending } = useSession();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  console.log("1. [Render] Component rendered. Current state:", enrollments);

  useEffect(() => {
    // 1. Wait for better-auth to finish its background checks
    console.log("2. [Effect] useEffect triggered by pathname:", pathname);
    if (isAuthPending) return;

    // 2. If auth is done, but somehow no user is found, stop the spinner
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    // 3. The Cleanup Flag (Crucial for Next.js Back Button caching!)
    let isMounted = true;

    const fetchMyCourses = async () => {
      try {
        setIsLoading(true);
        const data = await enrollmentService.getMyEnrollments();
        console.log("3. [API Success] Data received:", data);

        // Only update state if the user hasn't quickly navigated away again
        if (isMounted) {
          console.log("3. [API Success] Data received:", data);
          setEnrollments(data);
        }
      } catch (error) {
        console.error("4. [API Error] Failed:", error);
        console.error("Failed to fetch courses:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyCourses();

    // 4. Cleanup function runs when component unmounts (e.g. clicking 'Back')
    return () => {
      isMounted = false;
    };

    // 👉 Primitive dependencies only! React tracks strings perfectly.
  }, [session?.user?.id, isAuthPending]);

  if (isAuthPending || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check for null (Fetching state)
  // if (enrollments === null) {
  //   return (
  //     <div className="flex h-[60vh] items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }
  // 👉 STEP 4: The Empty State
  if (enrollments.length === 0) {
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

  // 👉 STEP 2: The Active Courses Grid
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
        {enrollments.map((enrollment, index) => (
          <motion.div
            key={enrollment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="flex flex-col h-full border-t-4 border-t-primary hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-xl">
                  {enrollment.course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {enrollment.course.description ||
                    "Dive into the curriculum and explore the advanced techniques offered in this module."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-muted-foreground bg-muted p-2 rounded-md w-fit border border-border">
                  <Clock className="mr-2 h-4 w-4 text-secondary" />
                  Status:{" "}
                  <span className="font-semibold ml-1 text-foreground">
                    {enrollment.status}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                {/* We will wire this button up to the Sheet in the next step! */}
                <Button
                  className="w-full bg-primary hover:bg-primary/90 group"
                  onClick={() => {
                    setSelectedCourseId(enrollment.courseId); // Note: Ensure this matches your Prisma schema (it might be enrollment.course.id)
                    setSelectedCourseTitle(enrollment.course.title);
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
