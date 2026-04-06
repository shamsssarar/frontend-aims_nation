// src/services/material.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import { CourseMaterial } from "@/types/material.types";

export const materialService = {
  getCourseMaterials: async (courseId: string) => {
    const response = await httpClient.get<CourseMaterial[]>(
      `/api/v1/materials/${courseId}`,
    );
    return response;
  },

  uploadMaterial: async (formData: FormData) => {
    // We bypass httpClient so it doesn't accidentally force "application/json".
    // The browser will automatically set the correct "multipart/form-data" boundary!
    const response = await fetch("http://localhost:5000/api/v1/materials", {
      method: "POST",
      body: formData,
      // CRITICAL: We must include this so your better-auth teacher cookie is sent to the backend!
      credentials: "include",
      
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload file");
    }

    return data;
  },

  deleteMaterial: async (id: string) => {
    // Ensure this path matches your backend (e.g. /api/v1/study-materials or /materials)
    const response = await httpClient.delete(`/api/v1/materials/${id}`);
    return response;
  },
};
