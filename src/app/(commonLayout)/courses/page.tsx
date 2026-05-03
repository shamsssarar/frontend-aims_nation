"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
import { courseService } from "@/services/courses.services"; // Make sure ICourseQuery is exported from your services file
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Search,
  BookOpen,
  Users,
  UserCircle,
  Star,
  Clock,
  ArrowDownUp,
} from "lucide-react";
import Image from "next/image";
import { enrollmentService } from "@/services/enrollment.services";
import { ICourseQuery } from "@/types/course.types";
import Link from "next/link";

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 👉 1. The Engine State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState(""); // e.g., "-courseFee" or "courseFee"

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  const router = useRouter();
  const { data: session } = useSession();
  const categoryKeywords: Record<string, string[]> = {
    Robotics: ["Robotic", "Robotics", "Arduino"],
    Arts: ["Art", "Craft", "Drawing", "Painting"],
    Academics: ["Math", "Science", "English", "Physics"],
    Culinary: ["Cooking", "Baking", "Food"],
  };
  // 👉 2. The Smart Fetcher with Debouncing
  // 👉 2. The Smart Fetcher with Debouncing
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userRole = (session?.user as any)?.role?.toUpperCase();

        const query: ICourseQuery = {};
        if (searchQuery) query.searchTerm = searchQuery;
        if (sortOption) query.sort = sortOption;

        // We do NOT add selectedCategory to query.searchTerm anymore.

        const [coursesRes, myEnrollments] = await Promise.all([
          courseService.getAllCourses(query),
          userRole === "STUDENT"
            ? enrollmentService.getMyEnrollments()
            : Promise.resolve([]),
        ]);

        let coursesArray = [];
        if (Array.isArray(coursesRes)) coursesArray = coursesRes;
        else if (Array.isArray(coursesRes?.data))
          coursesArray = coursesRes.data;
        else if (Array.isArray((coursesRes as any)?.data?.data))
          coursesArray = (coursesRes as any).data.data;

        // 👉 NEW: Frontend Category Filtering
        // 👉 NEW: Frontend Category Filtering
        if (selectedCategory !== "All") {
          const keywords = categoryKeywords[selectedCategory] || [
            selectedCategory,
          ];
          coursesArray = coursesArray.filter((course: any) => {
            // <-- ADD ': any' HERE
            const title = course.title.toLowerCase();
            const desc = (course.description || "").toLowerCase();
            // Check if ANY of the keywords exist in the title or description
            return keywords.some(
              (keyword) =>
                title.includes(keyword.toLowerCase()) ||
                desc.includes(keyword.toLowerCase()),
            );
          });
        }

        setCourses(coursesArray);

        if (myEnrollments && myEnrollments.length > 0) {
          const myCourseIds = myEnrollments.map((env: any) => env.courseId);
          setEnrolledCourseIds(myCourseIds);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, sortOption, session?.user]);

  const handleCourseAction = (
    courseId: string,
    role?: string,
    isEnrolled?: boolean,
  ) => {
    if (!session?.user)
      return router.push(`/login?redirect=/checkout/${courseId}`);
    if (isEnrolled) return router.push(`/dashboard/my-courses`);
    if (role === "TEACHER")
      return router.push(`/teacher/dashboard/classes/${courseId}`);
    if (role === "ADMIN") return router.push(`/admin/dashboard`);
    router.push(`/checkout/${courseId}`);
  };

  const categories = ["All", "Robotics", "Arts", "Academics", "Culinary"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold text-[#6A8D52] bg-[#6A8D52]/10 mb-4 uppercase tracking-wider">
            AiMS Nation Catalog
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Level Up Your Skills with <br className="hidden sm:block" />
            <span className="text-[#6A8D52]">Expert Instructors</span>
          </h1>

          {/* 👉 3. The Filter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#6A8D52] text-white shadow-md shadow-[#6A8D52]/20 scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#6A8D52] dark:hover:border-[#6A8D52] hover:text-[#6A8D52] dark:hover:text-[#6A8D52]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for a course (e.g., Robotics)..."
                className="pl-12 py-6 text-lg rounded-full shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-[#6A8D52]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Added a native select dropdown to trigger the Sort parameter */}
            <div className="relative min-w-[160px]">
              <select
                className="w-full h-full appearance-none pl-10 pr-4 py-3 sm:py-0 text-sm font-medium rounded-full shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6A8D52]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by: Newest</option>
                <option value="courseFee">Price: Low to High</option>
                <option value="-courseFee">Price: High to Low</option>
              </select>
              <ArrowDownUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* COURSE GRID */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#6A8D52]" />
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">
              Loading curriculum...
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-xl font-medium text-slate-600 dark:text-slate-400">
              No courses found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
            {/* Notice we are mapping over 'courses' now, not 'filteredCourses'! */}
            {courses.map((course) => {
              const userRole = (session?.user as any)?.role?.toUpperCase();
              const isEnrolled = enrolledCourseIds.includes(course.id);

              return (
                <Card
                  key={course.id}
                  className="flex flex-col group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#6A8D52]/20 to-[#E8AD31]/20 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-[#6A8D52]/40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center shadow-sm">
                      <Star className="w-3 h-3 text-[#E8AD31] mr-1 fill-[#E8AD31]" />
                      New
                    </div>
                  </div>

                  <CardContent className="flex-grow p-6 space-y-4">
                    <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-[#6A8D52] transition-colors cursor-pointer">
                      <Link href={`/courses/${course.id}`}>{course.title}</Link>
                    </CardTitle>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <UserCircle className="h-4 w-4 mr-2 text-[#6A8D52]" />
                        <span className="truncate">
                          {course.teacher?.user?.name || "Expert Instructor"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-[#6A8D52]" />
                          <span>{course.maxCapacity || "Unlimited"} Cap</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-[#6A8D52]" />
                          <span>Self-Paced</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Course Fee
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                        ৳ {course.courseFee?.toLocaleString()}
                      </p>
                    </div>

                    {(() => {
                      if (!session?.user) {
                        return (
                          <Button
                            onClick={() => handleCourseAction(course.id)}
                            variant="outline"
                            className="bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          >
                            Log in to Enroll
                          </Button>
                        );
                      }
                      if (userRole === "ADMIN" || userRole === "TEACHER") {
                        return (
                          <Button
                            onClick={() =>
                              handleCourseAction(course.id, userRole)
                            }
                            variant="secondary"
                            className="bg-[#E8AD31]/10 text-[#E8AD31] hover:bg-[#E8AD31]/20 font-semibold"
                          >
                            Preview Course
                          </Button>
                        );
                      }
                      if (isEnrolled) {
                        return (
                          <Button
                            onClick={() =>
                              handleCourseAction(course.id, userRole, true)
                            }
                            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-semibold transition-all shadow-md"
                          >
                            Continue Learning →
                          </Button>
                        );
                      }
                      return (
                        <Button
                          onClick={() =>
                            handleCourseAction(course.id, userRole, false)
                          }
                          className="bg-[#6A8D52] hover:bg-[#587843] text-white shadow-lg shadow-[#6A8D52]/20 font-semibold transition-all hover:scale-105"
                        >
                          Enroll Now
                        </Button>
                      );
                    })()}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
