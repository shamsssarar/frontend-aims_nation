import { httpClient } from "@/lib/axios/httpClient";

export const weeklyReportService = {
  submitWeeklyReport: async (payload: any) => {
    // We will build this exact route on the backend next!
    const response = await httpClient.post("/api/v1/weeklyReports", payload);
    return response;
  },
  createWeeklyReport: async (payload: any) => {
    // Make sure this URL matches your actual backend route!
    const response = await httpClient.post("/api/v1/weekly-reports", payload);
    return response;
  },
};
