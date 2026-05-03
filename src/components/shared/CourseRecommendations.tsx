"use client";

import { useEffect, useState } from "react";
import { courseService } from "@/services/courses.services";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, UserCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CourseRecommendations({
  currentCourseId,
}: {
  currentCourseId: string;
}) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      // Calls your new AI Vector Backend
      const data = await courseService.getRecommendations(currentCourseId);
      setRecommendations(data as any[]);
      setIsLoading(false);
    };

    if (currentCourseId) {
      fetchRecommendations();
    }
  }, [currentCourseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#6A8D52]" />
      </div>
    );
  }

  if (recommendations.length === 0) return null; // Hide the section if no recommendations exist yet

  return (
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-[#E8AD31]" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Similar Courses You Might Like
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          // Assuming your backend returns the course data inside the 'metadata' object from pgvector,
          // OR you fetched the full course details in the backend service. Adjust as needed!
          const course = rec.metadata || rec;

          return (
            <Card
              key={rec.courseId}
              className="group overflow-hidden hover:shadow-lg transition-all border-slate-200"
            >
              <div className="relative h-40 w-full bg-slate-100">
                {course.thumbnail && (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <CardTitle className="text-lg line-clamp-1">
                  {course.title}
                </CardTitle>
                <div className="flex items-center text-sm text-slate-500">
                  <UserCircle className="h-4 w-4 mr-1" />
                  Expert Instructor
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <p className="font-bold text-[#6A8D52]">৳ {course.courseFee}</p>
                <Button
                  onClick={() => router.push(`/courses/${rec.courseId}`)}
                  variant="outline"
                  size="sm"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
