"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CreditCard, Receipt, Lock } from "lucide-react";
import { courseService } from "@/services/courses.services";
import { paymentService } from "@/services/payment.services";
// Note: Make sure you have a way to get the user's auth token for the fetch call below!

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await courseService.getCourseById(courseId);
        const data = (res as any)?.data?.data || (res as any)?.data || res;
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        alert("Course not found.");
        router.push("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourseDetails();
  }, [courseId, router]);

  const handleSSLCommerzPayment = async () => {
    setIsSubmitting(true);
    try {
      // 1. Call your beautifully abstracted service layer
      const result = await paymentService.initSSLCommerzPayment(courseId);

      // Depending on your httpClient setup, the payload might be deeply nested.
      // We defensively check for result.data.url or result.url
      const targetUrl = (result as any)?.data?.url || (result as any)?.url;

      // 2. Redirect to SSLCommerz if successful
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Secure Checkout
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete your enrollment for AiMS Nation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN: ORDER SUMMARY */}
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Receipt className="mr-2 h-5 w-5 text-primary" /> Order
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Course
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {course?.title}
                  </p>
                </div>

                <div className="flex justify-between items-end pt-4 border-t">
                  <p className="text-slate-600 font-medium">
                    Total Payable Amount
                  </p>
                  <p className="text-3xl font-extrabold text-primary">
                    ৳ {course?.courseFee?.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-100 border-none shadow-inner">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 flex items-center mb-3">
                  <ShieldCheck className="mr-2 h-5 w-5 text-green-600" /> Secure
                  Payment Gateway
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  You will be redirected to the secure SSLCommerz gateway to
                  complete your purchase. We support all major credit cards,
                  debit cards, and mobile banking platforms (bKash, Nagad,
                  Rocket).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: ACTION */}
          <div>
            <Card className="border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-slate-600" />{" "}
                  Complete Purchase
                </CardTitle>
                <CardDescription>
                  Your payment is encrypted and 100% secure.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 flex flex-col items-center justify-center py-8">
                <Lock className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-center text-slate-500 font-medium">
                  Click below to open the payment portal.
                </p>
              </CardContent>

              <CardFooter className="bg-slate-50 border-t p-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6 transition-all"
                  onClick={handleSSLCommerzPayment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Redirecting to Gateway...
                    </>
                  ) : (
                    <>Pay ৳ {course?.courseFee?.toLocaleString()} Now</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
