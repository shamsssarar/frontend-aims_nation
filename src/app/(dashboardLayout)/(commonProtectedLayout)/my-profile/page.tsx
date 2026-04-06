"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
import { profileService } from "@/services/profile.services";
import {
  BookOpen,
  Mail,
  User as UserIcon,
  Presentation,
  Users,
  Loader2,
  Camera,
} from "lucide-react";
import { AiMSNationInlineLoader } from "@/components/shared/AimsNationLoading";

// ==========================================
// 1. MAIN ORCHESTRATOR
// ==========================================
export default function ProfilePage() {
  const router = useRouter();

  // 👉 1. Check Auth State ONCE
  const { data: session, isPending: isAuthPending } = useSession();

  const [profileData, setProfileData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isAuthPending) return;

    if (!session?.user) {
      router.push("/login?redirect=/my-profile");
      return;
    }

    const fetchMyProfileData = async () => {
      try {
        const data = await profileService.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchMyProfileData();
  }, [session, isAuthPending, router]);

  // 👉 FIXED: Do NOT call useSession() again. Just read the existing session variable!
  const role = (session?.user as any)?.role;

  if (isAuthPending || isDataLoading || !profileData) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <AiMSNationInlineLoader />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Account
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your platform activities and progress.
        </p>
      </div>

      {role === "STUDENT" && <StudentProfile data={profileData} />}
      {role === "TEACHER" && <TeacherProfile data={profileData} />}
      {role === "USER" && <StudentProfile data={profileData} />}
      {role === "ADMIN" && <AdminProfile data={profileData} />}
    </main>
  );
}

// ==========================================
// 2. REUSABLE AVATAR UPLOAD COMPONENT
// ==========================================
// This handles the image, upload logic, name, role, and email for EVERYONE.
function ProfileAvatar({
  user,
  borderClass,
  roleBadgeClass,
}: {
  user: any;
  borderClass: string;
  roleBadgeClass: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      // 👉 FIXED: credentials: "include" is active so your backend gets the auth cookies!
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profiles/me/image`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Upload failed");
      window.location.reload();
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-24 h-24 mb-4 group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className={`w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden transition-all ${borderClass}`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-[#6A8D52] animate-spin" />
          ) : user?.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10 text-slate-400" />
          )}
        </div>

        {!isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white mb-1" />
            <span className="text-[10px] text-white font-semibold uppercase tracking-wider">
              Change
            </span>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {user?.name}
      </h2>
      <span
        className={`mt-1 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${roleBadgeClass}`}
      >
        {user?.role || "STUDENT"}
      </span>

      <div className="w-full mt-6 space-y-3">
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
          <Mail className="w-4 h-4 mr-3 text-slate-400" />
          <span className="truncate">{user?.email}</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. STUDENT UI COMPONENT
// ==========================================
function StudentProfile({ data }: { data: any }) {
  const { user, enrollments } = data;
  const router = useRouter();
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: User Info using the new Avatar Component! */}
      <div className="col-span-1 bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
        <ProfileAvatar
          user={user}
          borderClass="border-2 border-transparent group-hover:border-[#6A8D52]"
          roleBadgeClass="bg-[#6A8D52]/10 text-[#6A8D52]"
        />
      </div>

      {/* Right Column: Enrollments */}
      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E8AD31]" />
            My Active Courses
          </h3>
          {!enrollments || enrollments.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                You haven't enrolled in any courses yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrollments.map((enrollment: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setLoadingCourseId(
                      enrollment.course.id || index.toString(),
                    );
                    router.push(`/dashboard/my-courses`);
                  }}
                  disabled={loadingCourseId !== null}
                  className="w-full text-left p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-[#6A8D52] dark:hover:border-[#6A8D52] transition-colors group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-[#6A8D52] transition-colors line-clamp-1">
                    {enrollment.course.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {enrollment.course.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#6A8D52] bg-[#6A8D52]/10 px-2 py-1 rounded">
                      Active
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex items-center gap-1">
                      {loadingCourseId ===
                      (enrollment.course.id || index.toString()) ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-[#6A8D52]" />{" "}
                          Navigating...
                        </>
                      ) : (
                        <>Go to course →</>
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. TEACHER UI COMPONENT
// ==========================================
function TeacherProfile({ data }: { data: any }) {
  const { user, courses } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: User Info using the new Avatar Component! */}
      <div className="col-span-1 bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
        <ProfileAvatar
          user={user}
          borderClass="border-2 border-[#E8AD31] group-hover:border-[#6A8D52]"
          roleBadgeClass="bg-[#E8AD31]/10 text-[#E8AD31]"
        />
      </div>

      {/* Right Column: Taught Courses */}
      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Presentation className="w-5 h-5 text-[#6A8D52]" />
            My Classrooms
          </h3>
          {!courses || courses.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                You haven't created any courses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl"
                >
                  <div className="mb-3 sm:mb-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {course.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 shrink-0">
                    <Users className="w-4 h-4 text-[#6A8D52]" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {course._count?.enrollments || 0} Students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADMIN UI COMPONENT
// ==========================================
function AdminProfile({ data }: { data: any }) {
  const { user } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: User Info using the new Avatar Component! */}
      <div className="col-span-1 bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-fit">
        <ProfileAvatar
          user={user}
          borderClass="border-2 border-red-500 group-hover:border-[#6A8D52]"
          roleBadgeClass="bg-red-500/10 text-red-600"
        />
      </div>

      {/* Right Column: Admin Privileges */}
      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center h-full min-h-[250px]">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            System Administrator
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
            You have full elevated access to AiMS Nation. Use the sidebar to
            manage users, courses, and platform settings.
          </p>
        </div>
      </div>
    </div>
  );
}
