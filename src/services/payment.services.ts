// src/services/payment.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import { Payment } from "@/types/payment.types";

export const paymentService = {
  getMyPayments: async () => {
    return httpClient.get<Payment[]>("/api/v1/payments/my-payments");
  },
  // Later you can add: initiatePayment: async (id) => {...}
};