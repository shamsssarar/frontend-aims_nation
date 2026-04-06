"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { careerService } from "@/services/career.services"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, Copy, UserPlus } from "lucide-react";
import { AiMSNationInlineLoader } from "@/components/shared/AimsNationLoading";

export default function HireTeacherPage() {
  const router = useRouter();

  // State
  const [reviewedApplicants, setReviewedApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    applicationId: "",
    salary: "",
    bio: "",
  });

  // Success State (Holds the data returned from your backend transaction)
  const [hiredData, setHiredData] = useState<{
    teacherName: string;
    email: string;
    temporaryPassword: string;
  } | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoading(true);
      try {
        // Fetch eligible applicants (this uses the fix we made earlier!)
        const appsRes = await careerService.getEligibleApplicants();

        // Filter out ONLY the "REVIEWED" ones (we don't need to re-hire people)
        const reviewedOnly = appsRes.filter(
          (app: any) => app.status === "REVIEWED",
        );
        setReviewedApplicants(reviewedOnly);
      } catch (error) {
        console.error("Failed to fetch reviewed applicants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleHire = async () => {
    if (!formData.applicationId || !formData.salary) {
      alert("Please select an applicant and set a salary.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        salary: Number(formData.salary),
        bio: formData.bio || undefined,
      };

      const res = await careerService.hireApplicant(
        formData.applicationId,
        payload,
      );

      // Extract the success data based on how your Axios instance wraps it
      const successPayload =
        (res as any)?.data?.data || (res as any)?.data || res;

      setHiredData({
        teacherName: successPayload.teacherName,
        email: successPayload.email,
        temporaryPassword: successPayload.temporaryPassword,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to hire teacher. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // --- SUCCESS VIEW ---
  if (hiredData) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="text-center pb-2">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-800">
              Teacher Hired Successfully!
            </CardTitle>
            <CardDescription className="text-green-600">
              {hiredData.teacherName} has been officially added to the AiMS
              Nation system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-white p-4 rounded-md border shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                Teacher Credentials
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Login Email
                  </Label>
                  <div className="font-medium">{hiredData.email}</div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">
                    Temporary Password
                  </Label>
                  <div className="flex items-center mt-1">
                    <code className="bg-slate-100 px-3 py-2 rounded-l-md border border-r-0 text-lg font-mono flex-1">
                      {hiredData.temporaryPassword}
                    </code>
                    <Button
                      onClick={() =>
                        copyToClipboard(hiredData.temporaryPassword)
                      }
                      className="rounded-l-none border border-input shadow-none"
                      variant="secondary"
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Please securely share these credentials with the teacher.
                    They can change this password upon their first login.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() =>
                  router.push("/admin/dashboard/courses-management")
                }
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Go Assign a Course
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setHiredData(null);
                  setFormData({ applicationId: "", salary: "", bio: "" });
                }}
              >
                Hire Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- DEFAULT FORM VIEW ---
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Onboard Teacher</h1>
        <p className="text-muted-foreground mt-2">
          Finalize reviewed applicants by setting their salary and generating
          their system credentials.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>
              Select Applicant <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.applicationId}
              onValueChange={(val) =>
                setFormData({ ...formData, applicationId: val })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading
                      ? "Loading applicants..."
                      : "Select a reviewed applicant"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {reviewedApplicants.length > 0 ? (
                  reviewedApplicants.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name} ({app.email})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    No pending reviewed applicants found.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Monthly Salary (৳) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="e.g. 15000"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Teacher Bio (Optional)</Label>
            <Input
              placeholder="e.g. Expert in Robotics with 5 years experience..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              If left blank, a default bio will be generated based on their
              specialty.
            </p>
          </div>

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleHire}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <AiMSNationInlineLoader /> Processing
                Hiring Transaction...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Officially Hire Teacher
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
