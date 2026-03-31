"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { paymentService } from "@/services/payment.services";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Receipt,
} from "lucide-react";
import { courseService } from "@/services/courses.services";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [paymentMethod, setPaymentMethod] = useState("BKASH");
  const [transactionId, setTransactionId] = useState("");

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

  const handlePaymentSubmit = async () => {
    if (!transactionId || transactionId.length < 5) {
      alert("Please enter a valid Transaction ID");
      return;
    }

    setIsSubmitting(true);
    try {
      await paymentService.submitPayment({
        courseId,
        paymentMethod,
        transactionId,
      });

      // Success! Send them to their dashboard to see the "Pending" status
      router.push("/student/dashboard");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Failed to submit payment. Please try again or contact support.");
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
                  <ShieldCheck className="mr-2 h-5 w-5 text-green-600" />{" "}
                  Payment Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>Open your selected Mobile Banking App (bKash/Nagad).</li>
                  <li>
                    Select <strong>Send Money</strong> or{" "}
                    <strong>Payment</strong>.
                  </li>
                  <li>
                    Enter our official number:{" "}
                    <span className="font-bold text-slate-900">
                      017XX-XXXXXX
                    </span>
                  </li>
                  <li>
                    Enter the exact amount:{" "}
                    <span className="font-bold text-slate-900">
                      ৳ {course?.courseFee}
                    </span>
                  </li>
                  <li>
                    Copy the Transaction ID (TxID) and paste it in the form
                    below.
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: PAYMENT FORM */}
          <div>
            <Card className="border-slate-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-slate-600" /> Payment
                  Details
                </CardTitle>
                <CardDescription>
                  Verify your payment to unlock course materials instantly upon
                  approval.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="focus:ring-primary">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BKASH">bKash</SelectItem>
                      <SelectItem value="NAGAD">Nagad</SelectItem>
                      <SelectItem value="ROCKET">Rocket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Transaction ID (TxID){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 9XZ8B7C6D5"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="uppercase focus-visible:ring-primary font-mono text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the unique 10-digit code received via SMS after
                    payment.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t p-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting || !transactionId}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" /> Confirm Payment
                    </>
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
