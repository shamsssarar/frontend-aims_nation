export interface Course {
  id: string;
  title: string;
  description: string;
  courseFee: number;
}

export interface ICourseQuery {
  searchTerm?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  [key: string]: any; // Allows for dynamic things like courseFee[lt]
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
