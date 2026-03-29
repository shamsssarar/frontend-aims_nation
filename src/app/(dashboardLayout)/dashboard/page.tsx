"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
  }, [session, isAuthPending]); // Add isAuthPending to the dependency array! // This array means: "Run this effect whenever the session changes"

  // Show a loading state while auth or data is loading
  if (isAuthPending || isFetchingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}! 👋
        </h2>
        <p className="text-muted-foreground mt-2">
          Here is your live academic overview at AiMS Nation.
        </p>
      </div>

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

        <Card className="border-t-4 border-t-secondary shadow-sm">
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
              <p className="text-xs text-secondary font-medium mt-1">
                Requires action
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
    </div>
  );
}
