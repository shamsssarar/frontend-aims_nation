"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// Make sure this path points to your actual better-auth client!
import { authClient } from "@/lib/authClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, GraduationCap } from "lucide-react";
import { httpClient } from "@/lib/axios/httpClient";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNo: "",
    schoolGrade: "",
    dateOfBirth: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Better-Auth Sign Up Function
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        // 👉 Passing your custom student fields!
        // Note: Ensure your better-auth config/backend is set up to catch these
        // and save them to your Prisma Student model!
      });

      if (error) {
        alert(error.message || "Failed to create account.");
        setIsLoading(false);
        return;
      }
      try {
        await httpClient.post("/api/v1/profiles/setup-student", {
          contactNo: formData.contactNo,
          schoolGrade: formData.schoolGrade,
          dateOfBirth: formData.dateOfBirth
            ? new Date(formData.dateOfBirth).toISOString()
            : undefined,
        });
      } catch (profileError) {
        console.error(
          "Profile creation failed, but user was created:",
          profileError,
        );
        // We log the error, but we don't block them from moving forward
      }
      // Success! Teleport them to the checkout page (or dashboard)
      router.push(redirectUrl);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="flex justify-center mb-2">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-primary">
          Join AiMS Nation
        </CardTitle>
        <CardDescription className="text-slate-500">
          Create your free student account to enroll in courses.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* CORE AUTH FIELDS */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Bruce Wayne"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="bruce@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              className="focus-visible:ring-primary"
            />
          </div>

          <hr className="my-4 border-slate-100" />

          {/* STUDENT PROFILE FIELDS */}
          <div className="space-y-2">
            <Label htmlFor="contactNo">Contact Number</Label>
            <Input
              id="contactNo"
              type="tel"
              placeholder="e.g. 01711..."
              value={formData.contactNo}
              onChange={(e) =>
                setFormData({ ...formData, contactNo: e.target.value })
              }
              className="focus-visible:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolGrade">School Grade</Label>
              <Input
                id="schoolGrade"
                type="text"
                placeholder="e.g. Class 8"
                value={formData.schoolGrade}
                onChange={(e) =>
                  setFormData({ ...formData, schoolGrade: e.target.value })
                }
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="focus-visible:ring-primary text-slate-600"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-md mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating
                Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-secondary hover:text-secondary/80 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-primary" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
