// src/types/material.types.ts

export interface CourseMaterial {
  id: string;
  title: string;
  fileUrl: string; // The AWS S3 link or local file path
  courseId: string;
  createdAt: string;
}