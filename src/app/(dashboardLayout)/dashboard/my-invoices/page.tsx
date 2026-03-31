"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";
import { paymentService } from "@/services/payment.services";
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
import { 
  Loader2, 
  Receipt, 
  Clock, 
  CheckCircle, 
  CreditCard,
  Download
} from "lucide-react";

export default function MyInvoicesPage() {
  const { data: session, isPending: isAuthPending } = useSession();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthPending) return;
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const res = await paymentService.getMyPayments();
        
        if (isMounted) {
          // Handle different Axios response wrappers
          const data = (res as any)?.data?.data || (res as any)?.data || res || [];
          setInvoices(data);
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInvoices();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, isAuthPending]);

  if (isAuthPending || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate quick summary stats
  const totalSpent = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
    
  const pendingCount = invoices.filter((inv) => inv.status === "PENDING").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Payment History
          </h2>
          <p className="text-muted-foreground mt-2">
            View your invoices, check payment statuses, and download receipts.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <Card className="bg-primary/5 border-primary/10 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <h3 className="text-xl font-bold text-primary">৳ {totalSpent.toLocaleString()}</h3>
              </div>
            </CardContent>
          </Card>
          
          {pendingCount > 0 && (
            <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-full">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <h3 className="text-xl font-bold text-amber-700">{pendingCount} Invoice(s)</h3>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* INVOICE TABLE */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <CardTitle className="flex items-center text-lg">
            <Receipt className="mr-2 h-5 w-5 text-slate-500" /> All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Receipt className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
              <p className="text-muted-foreground max-w-sm">
                When you enroll in a course, your payment history and receipts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[120px]">Invoice ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50">
                      
                      {/* Truncated ID */}
                      <TableCell className="font-mono text-xs text-slate-500">
                        #{invoice.id.split('-')[0].toUpperCase()}
                      </TableCell>
                      
                      {/* Course Title */}
                      <TableCell className="font-medium text-slate-900">
                        {invoice.course?.title || "Unknown Course"}
                      </TableCell>
                      
                      {/* Date */}
                      <TableCell className="text-sm text-slate-600">
                        {new Date(invoice.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </TableCell>
                      
                      {/* Payment Method / TxID */}
                      <TableCell>
                        {invoice.transactionId ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 uppercase">
                              {invoice.paymentMethod || "ONLINE"}
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                              {invoice.transactionId}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Manual / Cash</span>
                        )}
                      </TableCell>
                      
                      {/* Amount */}
                      <TableCell className="font-bold text-slate-700">
                        ৳ {invoice.amount?.toLocaleString() || "0"}
                      </TableCell>
                      
                      {/* Status Badge */}
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          invoice.status === 'PAID' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {invoice.status === 'PAID' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {invoice.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                          {invoice.status}
                        </span>
                      </TableCell>
                      
                      {/* Download Action (Placeholder for future functionality) */}
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary hover:bg-primary/10"
                          disabled={invoice.status === 'PENDING'}
                          onClick={() => alert(`Downloading receipt for #${invoice.id.split('-')[0].toUpperCase()}... (To be implemented!)`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}