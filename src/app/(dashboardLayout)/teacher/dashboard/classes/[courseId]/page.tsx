"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  FileText,
  Users,
  UploadCloud,
  Download,
  PenSquare,
  Loader2,
  X,
  Trash2,
} from "lucide-react";
import { materialService } from "@/services/material.services";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// --- DUMMY DATA (We will replace this with real API calls next!) ---
const DUMMY_COURSE = {
  title: "Beginner Robotics with Arduino",
  roomNumber: "Room 1",
  schedule: "Saturday 10:00 AM - 12:00 PM",
};

const DUMMY_MATERIALS = [
  {
    id: "1",
    title: "Week 1: Arduino Setup Guide.pdf",
    date: "Oct 24, 2026",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Week 2: LED Blinking Worksheet.pdf",
    date: "Oct 31, 2026",
    size: "1.1 MB",
  },
];

const DUMMY_STUDENTS = [
  { id: "stu_1", name: "Bruce Wayne", status: "Active", lastReport: "Oct 24" },
  {
    id: "stu_2",
    name: "Peter Parker",
    status: "Active",
    lastReport: "Pending",
  },
  { id: "stu_3", name: "Clark Kent", status: "Active", lastReport: "Oct 24" },
];

export default function ClassControlCenter() {
  const params = useParams();
  const courseId = params.courseId;
  const router = useRouter(); // We will use this to fetch real data later
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);

  const fetchMaterials = async () => {
    setIsLoadingMaterials(true);
    try {
      const res = await materialService.getCourseMaterials(courseId as string);
      setMaterials(res || []);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const handleUpload = async () => {
    if (!selectedFile || !fileTitle)
      return alert("Please select a file and provide a title.");

    try {
      setIsUploading(true);

      // Package the data for the backend!
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", fileTitle);
      formData.append("courseId", courseId as string);
      // formData.append("description", "Optional description here");

      await materialService.uploadMaterial(formData);

      alert("Material uploaded successfully!");

      // Reset form
      setSelectedFile(null);
      setFileTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMaterials(); // Refresh the materials list to show the new upload
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload material. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Add a quick confirmation so they don't accidentally click it
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;

    try {
      await materialService.deleteMaterial(id);

      // Update UI instantly by filtering out the deleted item
      setMaterials((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete material.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* 1. Page Header & Back Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-3 mb-2 text-muted-foreground"
          >
            <Link href="/teacher/dashboard/classes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classes
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {DUMMY_COURSE.title}
          </h2>
          <p className="text-muted-foreground mt-1">
            {DUMMY_COURSE.schedule} • {DUMMY_COURSE.roomNumber}
          </p>
        </div>
      </div>

      {/* 2. The Main Tabs */}
      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="materials">
            <FileText className="mr-2 h-4 w-4" />
            Study Materials
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Student Roster
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: MATERIALS --- */}
        <TabsContent
          value="materials"
          className="mt-6 space-y-6 animate-in fade-in duration-500"
        >
          {/* Upload Dropzone Scaffold */}
          <Card
            className={
              selectedFile
                ? "border-primary border-2"
                : "border-dashed border-2 bg-primary/5"
            }
          >
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    setFileTitle(e.target.files[0].name.split(".")[0]); // Auto-fill title with filename
                  }
                }}
              />

              {!selectedFile ? (
                // State A: Waiting for file
                <>
                  <div className="h-14 w-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Upload New Material</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                    Files will be instantly available in the student's drawer.
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select File
                  </Button>
                </>
              ) : (
                // State B: File Selected, Ready to Upload
                <div className="w-full max-w-md space-y-4 text-left">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input
                      id="title"
                      value={fileTitle}
                      onChange={(e) => setFileTitle(e.target.value)}
                      placeholder="e.g. Week 1 Syllabus"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="w-full"
                      onClick={handleUpload}
                      disabled={isUploading || !fileTitle}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Uploading to Cloud...
                        </>
                      ) : (
                        "Confirm Upload"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* List of Existing Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMaterials ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin h-6 w-6 text-primary" />
                </div>
              ) : materials.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-4">
                  No materials uploaded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* 👉 Map over the REAL materials array */}
                  {materials.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-secondary/20 rounded text-secondary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{file.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded{" "}
                            {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* 👉 THE FIX: Both buttons are now safely INSIDE the map loop! */}
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 2: STUDENT ROSTER & REPORTS --- */}
        <TabsContent
          value="students"
          className="mt-6 animate-in fade-in duration-500"
        >
          <Card>
            <CardHeader>
              <CardTitle>Class Roster</CardTitle>
              <CardDescription>
                Manage your students and write their weekly performance reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Report</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DUMMY_STUDENTS.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                          {student.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.lastReport === "Pending" ? (
                          <span className="text-amber-600 font-medium flex items-center">
                            <PenSquare className="mr-1 h-3 w-3" /> Due Today
                          </span>
                        ) : (
                          student.lastReport
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Write Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
