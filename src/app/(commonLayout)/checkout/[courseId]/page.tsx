"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient"; // 👉 Added session to confirm user identity
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
  ShieldCheck,
  CreditCard,
  Receipt,
  Lock,
  UserCircle2,
  CheckCircle2,
} from "lucide-react";
import { courseService } from "@/services/courses.services";
import { paymentService } from "@/services/payment.services";
import Image from "next/image"; // 👉 Added for course thumbnail
import { enrollmentService } from "@/services/enrollment.services";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { data: session } = useSession(); // Fetching current user

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyOwnsCourse, setAlreadyOwnsCourse] = useState(false);

  useEffect(() => {
    const fetchCourseAndCheckEnrollment = async () => {
      try {
        const [courseRes, myEnrollments] = await Promise.all([
          courseService.getCourseById(courseId),
          session?.user
            ? enrollmentService.getMyEnrollments()
            : Promise.resolve([]),
        ]);
        const data =
          (courseRes as any)?.data?.data ||
          (courseRes as any)?.data ||
          courseRes;
        setCourse(data);

        if (session?.user && myEnrollments.length > 0) {
          const alreadyEnrolled = myEnrollments.some(
            (enrollment: any) => enrollment.courseId === courseId,
          );

          if (alreadyEnrolled) {
            // 👉 FIXED: No more alert(). Just update the state and stop loading!
            setAlreadyOwnsCourse(true);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourseAndCheckEnrollment();
  }, [courseId, router, session?.user]);

  const handleSSLCommerzPayment = async () => {
    setIsSubmitting(true);
    try {
      const result = await paymentService.initSSLCommerzPayment(courseId);
      const targetUrl = (result as any)?.data?.url || (result as any)?.url;

      if (targetUrl && (result as any)?.success !== false) {
        window.location.href = targetUrl;
      } else {
        console.error("Failed to generate payment link:", result);
        alert("Could not initiate payment. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong with the payment gateway!");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#6A8D52]" />
        <p className="text-slate-500 font-medium animate-pulse">
          Verifying course access...
        </p>
      </div>
    );
  }

  // 👉 2. NEW: The Premium "Already Owned" UI
  if (alreadyOwnsCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="max-w-md w-full border-[#6A8D52]/20 shadow-xl bg-white dark:bg-slate-900 text-center py-8">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-[#6A8D52]/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-[#6A8D52]" />
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">
              You're Already Enrolled!
            </CardTitle>
            <CardDescription className="text-base mt-2">
              You have already purchased{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {course?.title}
              </span>
              . There is no need to checkout again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push(`/dashboard/courses/${courseId}`)}
              className="w-full bg-[#6A8D52] hover:bg-[#587843] text-white py-6 text-lg mt-4"
            >
              Go to Course Dashboard →
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck className="w-12 h-12 mx-auto text-[#6A8D52] mb-4" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Secure Checkout
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Complete your enrollment to instantly unlock your AiMS Nation
            course.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* LEFT COLUMN: ORDER SUMMARY (Takes up 3/5 width on desktop) */}
          <div className="lg:col-span-3 space-y-6">
            {/* 👉 INDUSTRY STANDARD: User Confirmation */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <UserCircle2 className="h-6 w-6 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Account
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {session?.user?.email || "Student Account"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 👉 UPGRADED: Order Summary with Thumbnail */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 pb-4">
                <CardTitle className="flex items-center text-lg text-slate-900 dark:text-white">
                  <Receipt className="mr-2 h-5 w-5 text-[#6A8D52]" /> Order
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-slate-100 dark:border-slate-800">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {course?.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-[#6A8D52]/20 to-[#E8AD31]/20" />
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-grow text-center sm:text-left">
                    <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {course?.title}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Instructor:{" "}
                      {course?.teacher?.user?.name || "Expert Educator"}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      ৳ {course?.courseFee?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Total Row */}
                <div className="p-6 flex justify-between items-end bg-slate-50/50 dark:bg-slate-900/50">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Total Payable Amount
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Including all taxes and fees
                    </p>
                  </div>
                  <p className="text-3xl font-black text-[#6A8D52]">
                    ৳ {course?.courseFee?.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Gateway Info */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
              <ShieldCheck className="h-6 w-6 text-green-600 shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-400 leading-relaxed">
                You will be redirected to the secure SSLCommerz gateway. We
                support all major credit cards, debit cards, and mobile banking
                platforms (bKash, Nagad, Rocket).
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION (Takes up 2/5 width, sticks to top) */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <Card className="border-[#6A8D52]/30 shadow-xl bg-white dark:bg-slate-900">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">Complete Purchase</CardTitle>
                <CardDescription>256-bit Encrypted Checkout</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 flex flex-col items-center justify-center py-6">
                <Lock className="h-12 w-12 text-slate-200 dark:text-slate-700 mb-2" />
                <p className="text-center text-sm text-slate-500 font-medium px-4">
                  By completing this purchase, you agree to the AiMS Nation
                  Terms of Service.
                </p>
              </CardContent>

              <CardFooter className="bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 p-6 flex-col gap-4">
                <Button
                  className="w-full bg-[#6A8D52] hover:bg-[#587843] text-white shadow-lg shadow-[#6A8D52]/20 text-lg py-7 transition-all hover:scale-[1.02]"
                  onClick={handleSSLCommerzPayment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Redirecting...
                    </>
                  ) : (
                    <>Pay ৳ {course?.courseFee?.toLocaleString()} Now</>
                  )}
                </Button>

                {/* Micro-copy for trust */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-3 h-3 text-[#6A8D52]" />
                  Instant Access
                  <span className="text-slate-300 mx-1">•</span>
                  <CheckCircle2 className="w-3 h-3 text-[#6A8D52]" />
                  Secure SSL Gateway
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
