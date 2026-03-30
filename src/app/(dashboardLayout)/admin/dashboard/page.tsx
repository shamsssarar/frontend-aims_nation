"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Banknote, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react"; // Make sure Loader2 and CheckCircle are imported!
import { paymentService } from "@/services/payment.services";
export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingPaymentsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [isApprovingId, setIsApprovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getAnalytics();

        setAnalytics(
          res && typeof res === "object" && "totalStudents" in res
            ? (res as typeof analytics)
            : {
                totalStudents: 0,
                totalCourses: 0,
                totalRevenue: 0,
                pendingPaymentsCount: 0,
              },
        );
      } catch (error) {
        console.error("Failed to fetch admin analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch Analytics
      const analyticsRes = await adminService.getAnalytics();
      setAnalytics(
        analyticsRes &&
          typeof analyticsRes === "object" &&
          "totalStudents" in analyticsRes
          ? (analyticsRes as typeof analytics)
          : {
              totalStudents: 0,
              totalCourses: 0,
              totalRevenue: 0,
              pendingPaymentsCount: 0,
            },
      );

      // Fetch Payments and filter ONLY the pending ones
      const paymentsRes = await paymentService.getAllPayments();
      const allPayments = Array.isArray(paymentsRes) ? paymentsRes : [];
      const pending = allPayments.filter((p: any) => p.status === "PENDING");
      setPendingInvoices(pending);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprovePayment = async (paymentId: string) => {
    setIsApprovingId(paymentId);
    try {
      await paymentService.confirmPayment(paymentId);
      alert("Payment successfully approved!");
      // Re-run the fetcher so the revenue goes UP and the pending count goes DOWN!
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      alert("Failed to approve payment.");
    } finally {
      setIsApprovingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground mt-2">
          Overview of AiMS Nation's platform health and financials.
        </p>
      </div>

      {/* --- KPI CARDS ROW --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {analytics.totalStudents}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Active Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{analytics.totalCourses}</div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold text-green-700">
                ৳ {analytics.totalRevenue.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Pending Payments */}
        <Card
          className={
            analytics.pendingPaymentsCount > 0 && !isLoading
              ? "border-red-200 bg-red-50/50"
              : ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className={`text-sm font-medium ${analytics.pendingPaymentsCount > 0 && !isLoading ? "text-red-700" : ""}`}
            >
              Pending Payments
            </CardTitle>
            <AlertCircle
              className={`h-4 w-4 ${analytics.pendingPaymentsCount > 0 && !isLoading ? "text-red-600" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div
                className={`text-2xl font-bold ${analytics.pendingPaymentsCount > 0 ? "text-red-700" : ""}`}
              >
                {analytics.pendingPaymentsCount}
              </div>
            )}
            {!isLoading && analytics.pendingPaymentsCount > 0 && (
              <p className="text-xs text-red-600 mt-1">Action required</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- ACTION REQUIRED SECTION --- */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Action Required: Unpaid Invoices
        </h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                {/* Depending on what your API returns, you can show Student Name/Course Name here too */}
                <TableHead>Amount Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="animate-spin h-6 w-6 text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : pendingInvoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    All caught up! No pending invoices at this time. 🎉
                  </TableCell>
                </TableRow>
              ) : (
                pendingInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-xs font-mono">
                      {invoice.id.split("-")[0].toUpperCase()}...
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                      ৳ {invoice.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700 border-red-200">
                        PENDING
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isApprovingId === invoice.id}
                        onClick={() => handleApprovePayment(invoice.id)}
                      >
                        {isApprovingId === invoice.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
