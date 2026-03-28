// src/services/api.service.ts
import { httpClient } from "@/lib/axios/httpClient";
import { Course } from "@/types/course.types";
import { Enrollment } from "@/types/Enrollment.types";
import { Payment } from "@/types/payment.types";

export const apiService = {
  getMyEnrollments: async () => {
    return httpClient.get<Enrollment[]>("/api/v1/enrollments/my-courses");
  },
  getMyPayments: async () => {
    return httpClient.get<Payment[]>("/api/v1/payments/my-payments");
  },
  getAllCourses: async () => {
    return httpClient.get<Course[]>("/api/v1/courses");
  },
};
