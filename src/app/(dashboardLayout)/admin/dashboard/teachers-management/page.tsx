"use client";

import { useEffect, useState } from "react";
import { teacherService } from "@/services/teacher.services"; // Adjust path if needed
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Briefcase,
  Mail,
  Phone,
  Edit,
  Banknote,
  BookOpen,
} from "lucide-react";
import { AiMSNationInlineLoader } from "@/components/shared/AimsNationLoading";

export default function TeachersManagementPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState({
    id: "",
    name: "",
    contactNo: "",
    salary: "",
  });

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      // Assuming this fetches ALL teachers. If your backend puts the data in res.data.data, adjust accordingly!
      const res = await teacherService.getAllTeachers();
      const data = (res as any)?.data?.data || (res as any)?.data || res || [];
      setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenEdit = (teacher: any) => {
    setEditingTeacher({
      id: teacher.id,
      name: teacher.user?.name || teacher.name || "Unknown",
      contactNo: teacher.contactNo || "",
      salary: teacher.salary ? teacher.salary.toString() : "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload = {
        contactNo: editingTeacher.contactNo,
        salary: Number(editingTeacher.salary),
      };

      await teacherService.updateTeacher(editingTeacher.id, payload);
      alert("Teacher profile updated successfully!");

      setIsEditModalOpen(false);
      fetchTeachers(); // Refresh the table to show new data
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update teacher profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Instant Search Filter
  const filteredTeachers = teachers.filter((teacher) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = teacher.user?.name || teacher.name || "";
    const email = teacher.user?.email || teacher.email || "";
    return (
      name.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Teacher Directory
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your academic staff, update salaries, and maintain bios.
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
                placeholder="Search by name or email..."
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
                <TableHead>Teacher Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Contact No.</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <AiMSNationInlineLoader />
                  </TableCell>
                </TableRow>
              ) : filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <Briefcase className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                    No teachers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <div className="bg-indigo-100 p-2 rounded-full text-indigo-700">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      {teacher.user?.name || teacher.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Mail className="h-3 w-3 mr-2" />
                        {teacher.user?.email || teacher.email || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      ৳ {teacher.salary?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {teacher.contactNo || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                        onClick={() => handleOpenEdit(teacher)}
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

      {/* THE EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Teacher Profile</DialogTitle>
            <DialogDescription>
              Update details for {editingTeacher.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Monthly Salary (৳)</Label>
              <div className="relative">
                <Banknote className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="e.g. 20000"
                  className="pl-8"
                  value={editingTeacher.salary}
                  onChange={(e) =>
                    setEditingTeacher({
                      ...editingTeacher,
                      salary: e.target.value,
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
                  placeholder="e.g. 01711..."
                  className="pl-8"
                  value={editingTeacher.contactNo}
                  onChange={(e) =>
                    setEditingTeacher({
                      ...editingTeacher,
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
