import { httpClient } from "@/lib/axios/httpClient";
import { create } from "domain";

export const studentServices = {
  // Example: Fetch all students
  getAllStudents: async () => {
    const response = await httpClient.get("/api/v1/students");
    return response;
  },

  updateStudent: async (studentId: string, payload: any) => {
    const response = await httpClient.patch(
      `/api/v1/students/${studentId}`,
      payload,
    );
    return response;
  },
  createStudentProfile: async (payload: any) => {
    const response = await httpClient.post("/api/v1/profiles/setup-student", payload);
    return response;
  }
};
