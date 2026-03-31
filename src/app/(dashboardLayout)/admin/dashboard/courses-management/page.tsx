"use client";

import { useEffect, useState } from "react";
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
import { careerService } from "@/services/career.services"; // 👉 We are back to the Career Service!

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: "",
    courseFee: "",
    maxCapacity: "20",
    teacherApplicantId: "", 
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, applicantsRes] = await Promise.all([
        courseService.getAllCourses(),
        careerService.getEligibleApplicants(), // 👉 Fetching from ATS
      ]);
      
      const fetchedCourses = (coursesRes as any)?.data?.data || (coursesRes as any)?.data || coursesRes || [];
      const fetchedApplicants = (applicantsRes as any)?.data?.data || (applicantsRes as any)?.data || applicantsRes || [];
      
      setCourses(fetchedCourses);
      setApplicants(fetchedApplicants);
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
      const payload = {
        title: courseForm.title,
        courseFee: Number(courseForm.courseFee),
        maxCapacity: Number(courseForm.maxCapacity),
        teacherApplicantId: courseForm.teacherApplicantId, 
      };

      await courseService.createCourse(payload);
      alert("Course created successfully!");

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
            Create curriculum and assign officially hired teachers.
          </p>
        </div>

        {/* CREATE COURSE MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
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
                    const selectedPerson = applicants.find((a) => a.id === val);

                    // 👉 THE INTERCEPTOR: Stop them if they aren't HIRED!
                    if (selectedPerson?.status === "REVIEWED") {
                      setIsModalOpen(false);
                      alert(
                        "This applicant needs to be officially hired before they can be assigned to a course. Redirecting to setup..."
                      );
                      router.push(`/admin/dashboard/hire-teacher`);
                      return;
                    }
                    
                    // If they are HIRED, allow the selection!
                    setCourseForm({ ...courseForm, teacherApplicantId: val });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher..." />
                  </SelectTrigger>

                  <SelectContent className="z-[9999]">
                    {applicants && applicants.length > 0 ? (
                      applicants.map((applicant) => (
                        <SelectItem key={applicant.id} value={applicant.id}>
                          {applicant.name} 
                          <span
                            className={`ml-2 text-[10px] uppercase font-bold ${
                              applicant.status === "HIRED"
                                ? "text-green-600"
                                : "text-amber-500"
                            }`}
                          >
                            ({applicant.status})
                          </span>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        No applicants available
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
              courses.map((course) => {
                // Find the applicant name to display in the table
                const assignedApplicant = applicants.find(a => a.id === course.teacherApplicantId);
                
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      {course.title}
                    </TableCell>
                    <TableCell>
                      {/* Show the applicant's name, or fallback to the teacher relation if the backend resolved it */}
                      {course.teacher?.user?.name || assignedApplicant?.name || "Unassigned"}
                    </TableCell>
                    <TableCell>{course.maxCapacity}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ৳ {course.courseFee?.toLocaleString() || "0"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}