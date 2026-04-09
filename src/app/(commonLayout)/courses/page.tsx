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
import {
  Loader2,
  Search,
  BookOpen,
  Users,
  UserCircle,
  Star,
  Clock,
} from "lucide-react";
import Image from "next/image"; // Added for premium thumbnails
import { enrollmentService } from "@/services/enrollment.services";

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 👉 1. Safely extract the user role
        const userRole = (session?.user as any)?.role?.toUpperCase();

        // 👉 2. Fast Concurrent Fetching with Role Protection
        const [coursesRes, myEnrollments] = await Promise.all([
          courseService.getAllCourses(),

          // Only hit the backend for enrollments if they are a STUDENT
          userRole === "STUDENT"
            ? enrollmentService.getMyEnrollments()
            : Promise.resolve([]),
        ]);

        // Set the catalog courses
        setCourses(coursesRes || []);

        // 👉 3. Safely map course IDs if enrollments exist
        if (myEnrollments && myEnrollments.length > 0) {
          const myCourseIds = myEnrollments.map(
            (enrollment: any) => enrollment.courseId,
          );
          setEnrolledCourseIds(myCourseIds);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user]);

  // 👉 FIXED: Smart Routing based on role. No more native alert() popups!
  const handleCourseAction = (
    courseId: string,
    role?: string,
    isEnrolled?: boolean,
  ) => {
    // 1. Not logged in
    if (!session?.user) {
      router.push(`/login?redirect=/checkout/${courseId}`);
      return;
    }

    // 2. Student already enrolled
    if (isEnrolled) {
      router.push(`/dashboard/courses/${courseId}`);
      return;
    }

    // 👉 3. FIXED: Teacher routing to their specific class portal
    if (role === "TEACHER") {
      router.push(`/teacher/dashboard/classes/${courseId}`);
      return;
    }

    // 👉 4. FIXED: Admin routing to the admin dashboard
    if (role === "ADMIN") {
      // Note: If you ever build a specific course preview page for admins,
      // you can change this to `/admin/dashboard/courses/${courseId}`
      router.push(`/admin/dashboard`);
      return;
    }

    // 5. Default action for Students (Not enrolled)
    router.push(`/checkout/${courseId}`);
  };

  const filteredCourses = courses.filter((c) => {
    // Check if it matches the search text
    const matchesSearch = c.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check if it matches the category (Assuming your backend has a 'category' field.
    // If not, we can filter by looking for keywords in the title for now!)
    const matchesCategory =
      selectedCategory === "All" ||
      c.category === selectedCategory ||
      c.title?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Robotics", "Arts", "Academics", "Culinary"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
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
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Browse our catalog of premium courses. Create a free account today
            and start your journey.
          </p>
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

          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search for a course (e.g., Robotics, Arts)..."
              className="pl-12 py-6 text-lg rounded-full shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-[#6A8D52]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-xl font-medium text-slate-600 dark:text-slate-400">
              No courses found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
            {filteredCourses.map((course) => {
              const userRole = (session?.user as any)?.role?.toUpperCase();

              return (
                <Card
                  key={course.id}
                  className="flex flex-col group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:-translate-y-1"
                >
                  {/* 👉 PREMIUM UPGRADE: Thumbnail Area */}
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

                    {/* Badge Overlay */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center shadow-sm">
                      <Star className="w-3 h-3 text-[#E8AD31] mr-1 fill-[#E8AD31]" />
                      New
                    </div>
                  </div>

                  <CardContent className="flex-grow p-6 space-y-4">
                    <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-[#6A8D52] transition-colors">
                      {course.title}
                    </CardTitle>

                    {/* Metadata Row */}
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

                    {/* 👉 THE SMART BUTTON LOGIC */}
                    {/* 👉 THE SMART BUTTON LOGIC */}
                    {(() => {
                      // 1. Determine if the user owns this specific course
                      const isEnrolled = enrolledCourseIds.includes(course.id);
                      const userRole = (
                        session?.user as any
                      )?.role?.toUpperCase();

                      // State 1: Not Logged In
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

                      // State 2: Admin or Teacher
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

                      // State 3: Student - ALREADY ENROLLED
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

                      // State 4: Student - NOT YET ENROLLED (Default)
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
