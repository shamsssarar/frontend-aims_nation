"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookX, GraduationCap, Compass, Clock } from "lucide-react";
import { enrollmentService } from "@/services/enrollment.services";
import { paymentService } from "@/services/payment.services";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending: isAuthPending } = useSession();

  // State to hold our live database numbers
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  // State to track if the API is currently fetching
  const [isFetchingData, setIsFetchingData] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // 1. Wait for better-auth to finish loading the session state
    if (isAuthPending) return;

    // 2. If auth is done but no user exists, turn off the spinner to prevent a trap
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

        const [enrollments, Payments] = await Promise.all([
          enrollmentService.getMyEnrollments(),
          paymentService.getMyPayments(),
        ]);

        const activeCourses = enrollments.filter(
          (e) => e.status === "ACTIVE",
        ).length;
        const pendingPayments = Payments.filter(
          (i) => i.status === "PENDING",
        ).length;

        setActiveCoursesCount(activeCourses);
        setPendingPaymentsCount(pendingPayments);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        // 3. This is guaranteed to run now, releasing the loading state
        setIsFetchingData(false);
      }
    };

    fetchDashboardData();
  }, [session, isAuthPending, router]);

  // Show a loading state while auth or data is loading
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
          <GraduationCap className="mr-3 h-8 w-8 text-indigo-600" />
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

        <Card className="border-t-4 border-t-blue-500 shadow-sm opacity-50">
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
        
        {activeCoursesCount === 0 && pendingPaymentsCount === 0 ? (
          /* STATE 1: BRAND NEW STUDENT (NO COURSES, NO PAYMENTS) */
          <Card className="border-dashed border-2 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <BookX className="h-10 w-10 text-indigo-600" />
              </div>
              <CardTitle className="text-xl mb-2">Your classroom is currently empty</CardTitle>
              <CardDescription className="max-w-md mx-auto mb-6">
                You haven't enrolled in any courses yet. Once you enroll and your payment is verified, your study materials, live classes, and assignments will appear right here.
              </CardDescription>
              <Button 
                onClick={() => router.push('/courses')} 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Compass className="mr-2 h-4 w-4" /> Explore Available Courses
              </Button>
            </CardContent>
          </Card>
        ) : activeCoursesCount === 0 && pendingPaymentsCount > 0 ? (
          /* STATE 2: PAYMENT SUBMITTED, WAITING FOR ADMIN APPROVAL */
          <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Clock className="h-10 w-10 text-amber-600" />
              </div>
              <CardTitle className="text-xl mb-2 text-amber-900">Payment Verification in Progress</CardTitle>
              <CardDescription className="max-w-md mx-auto text-amber-700">
                We have received your enrollment request! Our admins are currently verifying your payment. Your course materials will unlock automatically once approved.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          /* STATE 3: UNLOCKED COURSES (We will build the actual course cards here later) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-indigo-100 bg-indigo-50/30">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">My Active Courses</h3>
                <p className="text-sm text-muted-foreground mb-4">You have {activeCoursesCount} unlocked courses. We will display your study modules here next!</p>
                <Button variant="outline" className="w-full">View Course Content</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}