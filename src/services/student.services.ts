import { httpClient } from "@/lib/axios/httpClient";

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
};
