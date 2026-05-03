import { httpClient } from "@/lib/axios/httpClient";
import { Course, ICourseQuery, IPaginatedResponse } from "@/types/course.types";

export const courseService = {
  getAllCourses: async (query?: ICourseQuery) => {
    // Safely build the query string (e.g., ?searchTerm=React&category=TECH)
    const params = new URLSearchParams();

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        // Only append if the value actually exists (prevents things like ?searchTerm=undefined)
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";

    // Notice the return type is now IPaginatedResponse<Course>
    return httpClient.get<IPaginatedResponse<Course>>(
      `/api/v1/courses${queryString}`,
    );
  },
  getCourseRoster: async (courseId: string) => {
    // Matches the backend route we just created: /api/v1/courses/:courseId/roster
    const response = await httpClient.get(`/api/v1/courses/${courseId}/roster`);
    return response;
  },
  getCourseById: async (courseId: string) => {
    const response = await httpClient.get(`/api/v1/courses/${courseId}`);
    return response;
  },
  createCourse: async (payload: any) => {
    const response = await httpClient.post("/api/v1/courses", payload);
    return response;
  },

  getRecommendations: async (courseId: string) => {
    // Adjust the URL based on your actual Axios/Fetch setup
    const response = await httpClient.get(
      `/api/v1/courses/${courseId}/recommendations`,
    );
    return response;
  },
};
