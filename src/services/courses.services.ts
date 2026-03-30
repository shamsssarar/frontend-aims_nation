import { httpClient } from "@/lib/axios/httpClient";
import { Course } from "@/types/course.types";

export const courseService = {
  getAllCourses: async () => {
    return httpClient.get<Course[]>("/api/v1/courses");
  },
  getCourseRoster: async (courseId: string) => {
    // Matches the backend route we just created: /api/v1/courses/:courseId/roster
    const response = await httpClient.get(`/api/v1/courses/${courseId}/roster`);
    return response;
  },
  createCourse: async (payload: any) => {
    const response = await httpClient.post("/api/v1/courses", payload);
    return response;
  },
};
