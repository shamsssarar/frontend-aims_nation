// src/services/teacher.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import { TeacherCourse } from "@/types/teacher.types";

export const teacherService = {
  // Fetches only the courses assigned to the logged-in teacher
  getMyClasses: async () => {
    const response = await httpClient.get("/api/v1/teachers/my-classes");
    // 👉 THE FIX: We must unwrap the Axios response to get the actual array!
    return response;
  },
  getAllTeachers: async () => {
    const response = await httpClient.get("/api/v1/teachers");
    return response;
  },
  // 👉 Add this to your service file
  updateTeacher: async (teacherId: string, payload: any) => {
    const response = await httpClient.patch(
      `/api/v1/teachers/${teacherId}`,
      payload,
    );
    return response;
  },
};
