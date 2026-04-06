"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  GraduationCap,
  Mail,
  Phone,
  Edit,
  UserCircle,
} from "lucide-react";
import { studentServices } from "@/services/student.services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AiMSNationInlineLoader } from "@/components/shared/AimsNationLoading";

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingStudent, setEditingStudent] = useState({
    id: "",
    name: "",
    contactNo: "",
    bloodGroup: "",
  });

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await studentServices.getAllStudents();
      const data = (res as any)?.data?.data || (res as any)?.data || res || [];
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenEdit = (student: any) => {
    setEditingStudent({
      id: student.id,
      name: student.name,
      contactNo:
        Number(student.contactNo) !== Number("N/A")
          ? student.contactNo
          : Number(""),
      bloodGroup: student.bloodGroup !== "N/A" ? student.bloodGroup : "",
    });
    setIsEditModalOpen(true);
  };

  // Submit the update to the backend
  const handleSaveUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload = {
        contactNo: editingStudent.contactNo,
        bloodGroup: editingStudent.bloodGroup,
      };

      await studentServices.updateStudent(editingStudent.id, payload);
      alert("Student profile updated successfully!");

      setIsEditModalOpen(false);
      fetchStudents(); // Refresh the table
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update student profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Instant Search Filter
  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Directory
          </h1>
          <p className="text-muted-foreground mt-2">
            View and search the master roster of all enrolled learners.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2 w-full md:w-1/3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Account Email</TableHead>
                <TableHead>Contact No.</TableHead>
                <TableHead>Blood Group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <AiMSNationInlineLoader />
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <GraduationCap className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-700">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      {student.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Mail className="h-3 w-3 mr-2" />
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-3 w-3 mr-2" />
                        {student.contactNo || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.bloodGroup || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* 👉 THE EDIT BUTTON */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                        onClick={() => handleOpenEdit(student)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* 👉 THE EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>
              Update contact information for {editingStudent.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label> Blood Group</Label>
              <div className="relative">
                <UserCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Martha Kent"
                  className="pl-8"
                  value={editingStudent.bloodGroup}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      bloodGroup: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. +880 1711..."
                  className="pl-8"
                  value={editingStudent.contactNo}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      contactNo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSaveUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? <AiMSNationInlineLoader /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
