"use client";
import { useRouter } from "next/navigation";

export default function PublicCourseCard({ course }: { course: any }) {
  const router = useRouter();

  const handleEnrollClick = () => {
    // 1. Check if the user is logged in (Adjust this based on how you store your auth token!)
    const isLoggedIn = localStorage.getItem("accessToken");

    if (!isLoggedIn) {
      // 2. If not logged in, send them to the register page and pass the course ID in the URL so they don't lose their place!
      alert("You need to create a student account to enroll!");
      router.push(`/register?redirect=/checkout/${course.id}`);
      return;
    }

    // 3. If they ARE logged in, send them straight to the checkout/payment page
    router.push(`/checkout/${course.id}`);
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold">{course.title}</h3>
      <p className="text-muted-foreground">Fee: ৳{course.courseFee}</p>

      {/* 👉 THE BOUNCER BUTTON */}
      <button
        onClick={handleEnrollClick}
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
      >
        Enroll Now
      </button>
    </div>
  );
}
