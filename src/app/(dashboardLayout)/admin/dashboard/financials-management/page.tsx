"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  CheckCircle,
  Search,
  Clock,
  DollarSign,
  Receipt,
} from "lucide-react";
import { paymentService } from "@/services/payment.services";
import { AiMSNationInlineLoader } from "@/components/shared/AimsNationLoading";

export default function FinancialsManagementPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApprovingId, setIsApprovingId] = useState<string | null>(null);

  // Filtering States
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "PAID">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await paymentService.getAllPayments();
      // Adjust based on your Axios interceptor structure
      const data = (res as any)?.data?.data || (res as any)?.data || res || [];
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprovePayment = async (paymentId: string) => {
    setIsApprovingId(paymentId);
    try {
      await paymentService.confirmPayment(paymentId);
      alert("Payment successfully approved!");
      fetchPayments(); // Refresh the list to move it to PAID
    } catch (error) {
      console.error(error);
      alert("Failed to approve payment.");
    } finally {
      setIsApprovingId(null);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredPayments = payments.filter((payment) => {
    // 1. Match the tab filter
    if (filter !== "ALL" && payment.status !== filter) return false;

    // 2. Match the search query (Searching by ID or Status)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        payment.id?.toLowerCase().includes(query) ||
        payment.status?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate quick stats for the header
  const totalRevenue = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
          <p className="text-muted-foreground mt-2">
            Manage student invoices, track revenue, and approve manual payments.
          </p>
        </div>

        <div className="flex gap-4">
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-full">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Collected Revenue
                </p>
                <h3 className="text-xl font-bold text-green-700">
                  ৳ {totalRevenue.toLocaleString()}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-full">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Invoices
                </p>
                <h3 className="text-xl font-bold text-amber-700">
                  {pendingCount}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            {/* TABS (Built with standard Tailwind to avoid needing to install shadcn tabs) */}
            <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
              {(["ALL", "PENDING", "PAID"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab === "ALL"
                    ? "All Invoices"
                    : tab === "PENDING"
                      ? "Pending"
                      : "Paid"}
                </button>
              ))}
            </div>

            {/* SEARCH BAR */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Invoice ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <AiMSNationInlineLoader />
                  </TableCell>
                </TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground flex-col items-center justify-center"
                  >
                    <Receipt className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                    No invoices found for this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-xs font-mono text-slate-500">
                      {payment.id.split("-")[0].toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {payment.student?.user?.name || "Unknown Student"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {payment.transactionId ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 uppercase">
                            {payment.paymentMethod}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {payment.transactionId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Manual / Cash
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ৳ {payment.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          payment.status === "PAID"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "PENDING" ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isApprovingId === payment.id}
                          onClick={() => handleApprovePayment(payment.id)}
                        >
                          {isApprovingId === payment.id ? (
                            <AiMSNationInlineLoader />
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="text-green-700 border-green-200 bg-green-50/30"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Cleared
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
