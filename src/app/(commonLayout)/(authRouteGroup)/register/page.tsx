"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/authClient";
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
import Image from "next/image";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // 👉 Added Google loading state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNo: "",
    schoolGrade: "",
    dateOfBirth: "",
  });

  const { data: session } = useSession();

  // 👉 2. The Auto-Teleport: If they have a session, push them out of the login page!
  useEffect(() => {
    if (session) {
      // If the URL has a callbackUrl (like ?callbackUrl=/dashboard), send them there.
      // Otherwise, default to /dashboard.
      const destination = searchParams.get("callbackUrl") || "/dashboard";
      router.push(destination);
    }
  }, [session, router, searchParams]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // event.persisted is true if the page was restored from the browser cache
      if (event.persisted) {
        setIsLoading(false);
        setIsGoogleLoading(false);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
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
      }
      router.push(redirectUrl);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // 👉 Added Google Sign Up Function
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "https://aims-nation-frontend.vercel.app/dashboard",
      });
    } catch (error) {
      console.error("Google signup failed:", error);
      alert("Google signup failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-none sm:border sm:shadow-sm mt-18">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="flex justify-center mb-[-5px]">
          <Link href="/">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={80}
              height={80}
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-primary mb-2">
          Join AiMS Nation
        </CardTitle>
        <CardDescription className="text-slate-500">
          Create your free student account to enroll in courses.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* 👉 Placed Google Button at the top of the Register form */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          disabled={isLoading || isGoogleLoading}
          className="w-full mb-6 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-slate-500" />
          ) : (
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Sign up with Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
              Or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
            disabled={isLoading || isGoogleLoading}
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
