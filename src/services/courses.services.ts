import { httpClient } from "@/lib/axios/httpClient";
import { Course } from "@/types/course.types";

export const courseService = {
  getAllCourses: async () => {
    return httpClient.get<Course[]>("/api/v1/courses");
  },
};
