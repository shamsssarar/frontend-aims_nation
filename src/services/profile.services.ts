import { httpClient } from "@/lib/axios/httpClient";

export const profileService = {
  getProfile: async () => {
    const response = await httpClient.get("/api/v1/profiles/me");

    return response;
  },
  uploadImage: async (formData: FormData) => {
    const response = await httpClient.patch(
      "/api/v1/profiles/me/image",
      formData,
      {
        credentials: "include",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  },
};
