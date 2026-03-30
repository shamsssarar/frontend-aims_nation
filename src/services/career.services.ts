// src/services/career.services.ts
import { httpClient } from "@/lib/axios/httpClient";

export const careerService = {
  getAllApplications: async () => {
    const response = await httpClient.get("/api/v1/careers/");
    return response;
  },

  // 1. Fetch only REVIEWED and HIRED applicants for the dropdown
  getEligibleApplicants: async () => {
    const response = await httpClient.get(`/api/v1/careers`);
    // Assuming response.data.data contains the array based on standard API responses
    const allApps = Array.isArray(response) ? response : [];
    return allApps.filter(
      (app: any) => app.status === "REVIEWED" || app.status === "HIRED",
    );
  },

  updateApplicationStatus: async (
    id: string,
    status: "REVIEWED" | "REJECTED",
  ) => {
    return await httpClient.patch(`/api/v1/careers/${id}/status`, { status });
  },

  // 2. The Hire Route passing the Salary payload
  hireApplicant: async (
    applicationId: string,
    payload: { salary: number; bio?: string },
  ) => {
    const response = await httpClient.post(
      `/api/v1/careers/${applicationId}/hire`,
      payload,
    );
    return response;
  },
};
