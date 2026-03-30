// src/services/admin.services.ts
import { httpClient } from "@/lib/axios/httpClient";

export const adminService = {
  getAnalytics: async () => {
    const response = await httpClient.get("/api/v1/admin/analytics");
    // Depending on your axios setup, you might need response.data.data
    return response;
  },
  
};
