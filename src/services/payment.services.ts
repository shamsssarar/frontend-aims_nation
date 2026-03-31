// src/services/payment.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import { Payment } from "@/types/payment.types";

export const paymentService = {
  getMyPayments: async () => {
    return httpClient.get<Payment[]>("/api/v1/payments/my-payments");
  },
  getAllPayments: async () => {
    // Note: ensure this matches your actual route name! (Sometimes it's /payments or /invoices)
    const response = await httpClient.get("/api/v1/payments");
    return response;
  },

  // 👉 2. The Magic Button to approve a payment
  confirmPayment: async (paymentId: string) => {
    const response = await httpClient.patch(
      `/api/v1/payments/${paymentId}/confirm`,
    );
    return response;
  },
  submitPayment: async (payload: {
    courseId: string;
    transactionId: string;
    paymentMethod: string;
  }) => {
    // Make sure this points to your exact backend route!
    const response = await httpClient.post("/api/v1/payments/buy", payload);
    return response;
  },
  // Later you can add: initiatePayment: async (id) => {...}
};
