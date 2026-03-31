"use client";

import { useState } from "react";
import { careerService } from "@/services/career.services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Loader2,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Heart,
  Sparkles,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    resumeLink: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await careerService.submitApplication(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Application failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Application Received!
          </h1>
          <p className="text-slate-600 text-lg">
            Thank you for applying to AiMS Nation, {formData.name.split(" ")[0]}
            ! Our administration team will review your profile and reach out
            shortly.
          </p>
          <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // DEFAULT FORM STATE
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT COLUMN: Copy & Benefits */}
        <div className="space-y-8 lg:sticky lg:top-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Inspire the next <br />
              <span className="text-primary">generation of learners.</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-lg">
              At AiMS Nation, we are always looking for passionate educators,
              industry experts, and mentors who want to make a real impact. Join
              our platform and teach what you love.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Flexible Scheduling
                </h3>
                <p className="mt-1 text-slate-600">
                  Teach on your own time. Set your availability and manage your
                  classes easily through your dedicated portal.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Modern Curriculum
                </h3>
                <p className="mt-1 text-slate-600">
                  From Advanced Robotics to Culinary Arts, teach subjects that
                  actually excite students.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Powerful Tools
                </h3>
                <p className="mt-1 text-slate-600">
                  Our platform handles the billing, enrollment, and file
                  hosting. You just focus on teaching.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Application Form */}
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Teacher Application</CardTitle>
            <CardDescription>
              Fill out the form below and our Admin team will review your
              profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g. Clark Kent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    required
                    placeholder="+880 1..."
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="clark@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeLink">
                  Resume / Portfolio Link{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="resumeLink"
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/..."
                    className="pl-8"
                    value={formData.resumeLink}
                    onChange={(e) =>
                      setFormData({ ...formData, resumeLink: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Primary Subject / Specialty{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  required
                  value={formData.specialty}
                  onValueChange={(val) =>
                    setFormData({ ...formData, specialty: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your area of expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROBOTICS">Robotics & Tech</SelectItem>
                    <SelectItem value="ART">Art & Design</SelectItem>
                    <SelectItem value="CULINARY">Culinary Arts</SelectItem>
                    <SelectItem value="ACADEMICS">General Academics</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Experience & Bio <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="experience"
                  required
                  className="min-h-[120px]"
                  placeholder="Tell us about your teaching experience, background, and why you want to join AiMS Nation..."
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                />
              </div>
              {/* 👉 3. Added Message / Cover Letter Textarea */}
              <div className="space-y-2">
                <Label htmlFor="message">
                  Cover Letter / Message{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="message"
                  className="min-h-[80px]"
                  placeholder="Why do you want to join AiMS Nation? Any specific courses you'd like to teach?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center">
                <Heart className="h-3 w-3 mr-1" /> Join our growing community of
                educators.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
