"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
import { courseService } from "@/services/courses.services";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, BookOpen, Users, UserCircle } from "lucide-react";

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res = await courseService.getAllCourses();
        const data = res || [];
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollClick = (courseId: string) => {
    if (!session?.user) {
      alert("You need to create a free student account to enroll in courses!");
      router.push(`/register?redirect=/checkout/${courseId}`);
      return;
    }

    const role = (session.user as any).role?.toUpperCase();
    if (role === "ADMIN" || role === "TEACHER") {
      alert(
        "Admins and Teachers cannot enroll in courses. Please use a student account.",
      );
      return;
    }

    router.push(`/checkout/${courseId}`);
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Level Up Your Skills with{" "}
            <span className="text-primary">AiMS Nation</span>
          </h1>
          <p className="text-lg text-slate-600">
            Browse our catalog of premium courses taught by industry experts.
            Create a free account today and start your journey.
          </p>

          <div className="relative max-w-md mx-auto mt-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search for a course..."
              className="pl-10 py-6 text-lg rounded-full shadow-sm border-slate-200 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* COURSE GRID */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-medium">
              No courses found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col hover:shadow-lg transition-shadow duration-300 border-slate-200 overflow-hidden"
              >
                {/* 👉 This uses your primary (Green) and secondary (Gold) colors for a beautiful gradient header! */}
                <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>

                <CardHeader className="-mt-8">
                  <div className="bg-white w-14 h-14 rounded-lg flex items-center justify-center shadow-sm border mb-3">
                    <BookOpen className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl line-clamp-2">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <UserCircle className="h-4 w-4 mr-2 text-slate-400" />
                    <span>
                      {course.teacher?.user?.name || "Expert Instructor"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="h-4 w-4 mr-2 text-slate-400" />
                    <span>
                      Max Capacity: {course.maxCapacity || "Unlimited"} students
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        Course Fee
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        ৳ {course.courseFee?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50 border-t p-4">
                  {/* 👉 Using your primary button styles */}
                  <Button
                    onClick={() => handleEnrollClick(course.id)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-md py-6"
                  >
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
