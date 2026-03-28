export interface Payment {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  courseId: string;
}
