import { Course } from "./course.types";

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: string;
  course: Course; // Includes the nested course data from our Prisma query!
}