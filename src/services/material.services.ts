// src/services/material.services.ts
import { httpClient } from "@/lib/axios/httpClient";
import { CourseMaterial } from "@/types/material.types";

export const materialService = {
  getCourseMaterials: async (courseId: string) => {
    return httpClient.get<CourseMaterial[]>(`/api/v1/materials/${courseId}`);
  },
};