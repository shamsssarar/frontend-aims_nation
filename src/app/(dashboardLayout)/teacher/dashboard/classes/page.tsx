"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { teacherService } from "@/services/teacher.services";
import { TeacherCourse } from "@/types/teacher.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherDashboardPage() {
  const pathname = usePathname();
  const [classes, setClasses] = useState<TeacherCourse[] | null>(null);

  useEffect(() => {
    // Fire the fetch immediately using our cache-busting pattern
    teacherService
      .getMyClasses()
      .then((data) => {
        if (data && Array.isArray(data)) setClasses(data);
      })
      .catch((error) => {
        console.error("Failed to fetch teacher classes:", error);
        setClasses([]); // Fallback to empty state on error
      });
  }, [pathname]);

  // STATE 1: Loading
  if (classes === null) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // STATE 2: Empty (No classes assigned yet)
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <ClipboardList className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          No Classes Assigned
        </h2>
        <p className="text-muted-foreground max-w-md">
          You have not been assigned to teach any classes yet. Please contact
          the administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  // STATE 3: The Teacher Grid
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          My Classroom Hub
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage your schedule, students, and course materials.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="flex flex-col h-full border-t-4 border-t-primary hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="line-clamp-1 text-xl">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {course.description || "No description provided."}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                {/* Logistics Info */}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {course.schedule || "TBD"}
                  </span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 text-secondary" />
                  <span>{course.roomNumber || "Unassigned Room"}</span>
                </div>

                {/* Capacity Meter */}
                <div className="pt-2 border-t mt-3 flex items-center justify-between">
                  <div className="flex items-center text-sm text-foreground font-medium">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    Students: {course._count.enrollments} / {course.maxCapacity}
                  </div>
                  {/* Visual warning if class is full */}
                  {course._count.enrollments >= course.maxCapacity && (
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                      FULL
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                {/* This button will route to the specific class dashboard (The Spoke) */}
                <Button
                  className="w-full bg-primary hover:bg-primary/90 group"
                  asChild
                >
                  <Link href={`/teacher/dashboard/classes/${course.id}`}>
                    Manage Class
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
