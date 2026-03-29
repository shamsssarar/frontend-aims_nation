// src/services/enrollment.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import { Enrollment } from "@/types/Enrollment.types";

export const enrollmentService = {
  getMyEnrollments: async () => {
    return httpClient.get<Enrollment[]>("/api/v1/enrollments/my-courses");
  },
  // Later you can add: enrollInCourse: async (id) => {...}
};