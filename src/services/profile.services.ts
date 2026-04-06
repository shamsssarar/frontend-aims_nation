import { httpClient } from "@/lib/axios/httpClient";

export const profileService = {
  getProfile: async () => {
    const response = await httpClient.get("/api/v1/profiles/me");

    return response;
  },
};
