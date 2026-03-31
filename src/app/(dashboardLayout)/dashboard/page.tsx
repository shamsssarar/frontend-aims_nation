"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  BookX,
  GraduationCap,
  Compass,
  Clock,
  BookOpen,
} from "lucide-react";
import { enrollmentService } from "@/services/enrollment.services";
import { paymentService } from "@/services/payment.services";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending: isAuthPending } = useSession();

  // State to hold our live database numbers
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  // 👉 NEW: State to actually hold the course data so we can map over it!
  const [myCourses, setMyCourses] = useState<any[]>([]);

  // State to track if the API is currently fetching
  const [isFetchingData, setIsFetchingData] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (isAuthPending) return;

    if (!session?.user) {
      setIsFetchingData(false);
      return;
    }
    const role = (session.user as any).role?.toUpperCase();

    if (role === "TEACHER") {
      router.push("/teacher/dashboard");
      return;
    } else if (role === "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsFetchingData(true);

        const [enrollmentsRes, paymentsRes] = await Promise.all([
          enrollmentService.getMyEnrollments(),
          paymentService.getMyPayments(),
        ]);

        // Handle variations in how axios might return the data (res.data.data vs res)
        const enrollments =
          (enrollmentsRes as any)?.data?.data ||
          (enrollmentsRes as any)?.data ||
          enrollmentsRes ||
          [];
        const payments =
          (paymentsRes as any)?.data?.data ||
          (paymentsRes as any)?.data ||
          paymentsRes ||
          [];

        const activeEnrollmentsList = enrollments.filter(
          (e: any) => e.status === "ACTIVE",
        );
        const pendingPaymentsList = payments.filter(
          (i: any) => i.status === "PENDING",
        );

        setActiveCoursesCount(activeEnrollmentsList.length);
        setPendingPaymentsCount(pendingPaymentsList.length);

        // 👉 NEW: Save the actual array of active courses to state!
        setMyCourses(activeEnrollmentsList);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchDashboardData();
  }, [session, isAuthPending, router]);

  if (isAuthPending || isFetchingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
          <GraduationCap className="mr-3 h-8 w-8 text-primary" />
          Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}! 👋
        </h2>
        <p className="text-muted-foreground mt-2">
          Here is your live academic overview at AiMS Nation.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {activeCoursesCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {pendingPaymentsCount}
            </div>
            {pendingPaymentsCount > 0 && (
              <p className="text-xs text-amber-600 font-medium mt-1">
                Awaiting Admin Verification
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-slate-300 shadow-sm opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Study Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* DYNAMIC CLASSROOM SECTION */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl font-semibold tracking-tight">My Classroom</h2>

        {/* STATE 1: BRAND NEW STUDENT (Nothing Active, Nothing Pending) */}
        {activeCoursesCount === 0 && pendingPaymentsCount === 0 && (
          <Card className="border-dashed border-2 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <BookX className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl mb-2">
                Your classroom is currently empty
              </CardTitle>
              <CardDescription className="max-w-md mx-auto mb-6">
                You haven't enrolled in any courses yet.
              </CardDescription>
              <Button
                onClick={() => router.push("/courses")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Compass className="mr-2 h-4 w-4" /> Explore Available Courses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* STATE 2: SHOW PENDING WARNING (Even if they have other active courses) */}
        {pendingPaymentsCount > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 shadow-sm mb-6">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Clock className="h-10 w-10 text-amber-600" />
              </div>
              <CardTitle className="text-xl mb-2 text-amber-900">
                Payment Verification in Progress
              </CardTitle>
              <CardDescription className="max-w-md mx-auto text-amber-700">
                You have {pendingPaymentsCount} pending enrollment request(s).
                Our admins are currently verifying your payment.
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* STATE 3: UNLOCKED COURSES */}
        {activeCoursesCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((enrollment) => (
              <Card
                key={enrollment.id}
                className="border-primary/20 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-primary/20">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900">
                    {enrollment.course?.title || "Course Details Hidden"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center">
                    Enrolled:{" "}
                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </p>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() =>
                      router.push(
                        `/dashboard/my-courses/${enrollment.courseId}`,
                      )
                    }
                  >
                    Enter Classroom
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
