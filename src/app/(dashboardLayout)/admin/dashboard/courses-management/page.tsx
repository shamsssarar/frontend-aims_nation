"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.services";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, BookOpen } from "lucide-react";
import { courseService } from "@/services/courses.services";
import { teacherService } from "@/services/teacher.services";
import { careerService } from "@/services/career.services";
import { id } from "zod/locales";

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NOTE: Adjust these field names if your Prisma Course model uses different names (e.g., 'price' instead of 'fee')
  const [courseForm, setCourseForm] = useState({
    title: "",
    courseFee: "",
    maxCapacity: "20", // Default to 20 if not provided
    teacherApplicantId: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch both courses and teachers at the same time
      const [coursesRes, teachersRes] = await Promise.all([
        courseService.getAllCourses(),
        careerService.getEligibleApplicants(),
      ]);
      console.log("TEACHERS API RESPONSE:", teachersRes);
      setCourses(coursesRes || []);
      setTeachers((teachersRes as any[]) || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async () => {
    // Basic validation
    if (
      !courseForm.title ||
      !courseForm.teacherApplicantId ||
      !courseForm.courseFee
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the payload to ensure numbers are actually numbers
      const payload = {
        title: courseForm.title,
        courseFee: Number(courseForm.courseFee),
        maxCapacity: Number(courseForm.maxCapacity),
        teacherApplicantId: courseForm.teacherApplicantId,
      };

      await courseService.createCourse(payload);
      alert("Course created successfully!");

      // Refresh the table, close modal, and reset form
      fetchData();
      setIsModalOpen(false);
      setCourseForm({
        title: "",
        courseFee: "",
        maxCapacity: "20",
        teacherApplicantId: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create course. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Course Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage curriculum and assign teachers.
          </p>
        </div>

        {/* CREATE COURSE MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Set the course details and assign a primary teacher.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>
                  Course Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g., Advanced Robotics"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Assign Teacher <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={courseForm.teacherApplicantId}
                  onValueChange={(val) => {
                    const selectedPerson = teachers.find((t) => t.id === val);

                    if (selectedPerson?.status === "REVIEWED") {
                      // 1. Close the modal
                      setIsModalOpen(false);
                      // 2. Alert the admin
                      alert(
                        "This applicant needs to be officially hired before they can be assigned to a course. Redirecting to setup...",
                      );
                      // 3. Redirect to your hire route (UPDATE THIS URL TO MATCH YOUR ACTUAL HIRE ROUTE!)
                      router.push(`/admin/dashboard/hire-teacher`);
                      return;
                    }
                    setCourseForm({ ...courseForm, teacherApplicantId: val });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher..." />
                  </SelectTrigger>

                  {/* 👉 THE FIX: z-[9999] forces it to the absolute front layer! */}
                  <SelectContent className="z-[9999]">
                    {teachers && teachers.length > 0 ? (
                      teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {/* If your API returns nested data like teacher.user.name, adjust this! */}
                          {teacher.name ||
                            teacher.user?.name ||
                            "Unnamed Teacher"}
                          <span
                            className={`ml-2 text-[10px] uppercase font-bold ${teacher.status === "HIRED" ? "text-green-600" : "text-amber-500"}`}
                          >
                            ({teacher.status})
                          </span>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        No eligible teachers found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Course Fee (৳) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={courseForm.courseFee}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        courseFee: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Capacity</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={courseForm.maxCapacity}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        maxCapacity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateCourse}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  "Save Course"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* COURSE TABLE */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead>Assigned Teacher</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="animate-spin h-6 w-6 text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No courses found. Click 'Create Course' to add one.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                    {course.title}
                  </TableCell>
                  <TableCell>
                    {/* Assuming your backend includes the teacher data. If it's just an ID, we can cross-reference the teachers array! */}
                    {course.teacher?.user?.name ||
                      teachers.find((t) => t.id === course.teacherApplicantId)?.name ||
                      "Unassigned"}
                  </TableCell>
                  <TableCell>{course.maxCapacity}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ৳ {course.courseFee?.toLocaleString() || "0"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
