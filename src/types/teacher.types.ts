// src/types/teacher.types.ts

export interface TeacherCourse {
  id: string;
  title: string;
  description: string | null;
  schedule: string | null;     // e.g., "Mon/Wed 4:00 PM"
  roomNumber: string | null;   // e.g., "Room A"
  maxCapacity: number;
  _count: {
    enrollments: number;       // The live count of students!
  };
}