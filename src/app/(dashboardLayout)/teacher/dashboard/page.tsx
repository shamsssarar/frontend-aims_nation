"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import { teacherService } from "@/services/teacher.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Users, FileText, Calendar } from "lucide-react";

export default function TeacherOverviewPage() {
  const { data: session, isPending: isAuthPending } = useSession();
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthPending) return;
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        // This now properly receives the unwrapped Array from your service!
        const data = await teacherService.getMyClasses();
        setMyClasses(data as any[]);
      } catch (error) {
        console.error("Failed to fetch teacher classes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [session?.user?.id, isAuthPending]);

  if (isAuthPending || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 👉 DYNAMIC CALCULATIONS (No more hardcoded 3 and 45!)
  const totalClasses = myClasses.length;
  // Sum up all enrollments across all their assigned classes
  const totalStudents = myClasses.reduce((sum, course) => sum + (course._count?.enrollments || course.enrollments?.length || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {session?.user?.name || "Instructor"}!
        </h2>
        <p className="text-muted-foreground mt-2">
          Here is what is happening at AiMS Nation today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 👉 THE REAL CLASS COUNT */}
        <Card className="border-t-4 border-t-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground mt-1">Active this semester</p>
          </CardContent>
        </Card>

        {/* 👉 THE REAL STUDENT COUNT */}
        <Card className="border-t-4 border-t-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-accent opacity-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">0</div>
            <p className="text-xs text-muted-foreground mt-1">Weekly reports to write</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-muted-foreground opacity-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">No Schedule</div>
            <p className="text-xs text-muted-foreground mt-1">Check calendar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}