"use client";
import { AiMSNationInlineLoader } from "@/components/shared/AimsNationLoading";
import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { careerService } from "@/services/career.services";

export default function CareerManagementPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the talent pool when the page loads
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await careerService.getAllApplications();

      // DEBUGGING: Look at your browser's console (F12) to see this!
      console.log("FULL API RESPONSE:", response);

      // Let's make the extraction extremely safe based on what we see in the console
      let appsData = [];

      if (Array.isArray(response)) {
        appsData = response; // Just in case it returns a raw array
      } else if (
        (response as any)?.data &&
        Array.isArray((response as any).data)
      ) {
        appsData = (response as any).data;
      } else if (
        (response as any)?.data?.data &&
        Array.isArray((response as any).data.data)
      ) {
        appsData = (response as any).data.data;
      }

      console.log("EXTRACTED ARRAY:", appsData);
      setApplications(appsData);
    } catch (error) {
      console.error("Failed to fetch applications. Error details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle the status update
  const handleUpdateStatus = async (
    id: string,
    newStatus: "REVIEWED" | "REJECTED",
  ) => {
    try {
      await careerService.updateApplicationStatus(id, newStatus);
      // Refresh the list so the UI updates instantly
      fetchApplications();
    } catch (error) {
      console.error(`Failed to mark as ${newStatus}:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <AiMSNationInlineLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Career Management</h2>
        <p className="text-muted-foreground mt-2">
          Review incoming teacher applications and approve them for course
          assignment.
        </p>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {!Array.isArray(applications) || applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{app.name}</td>
                    <td className="px-6 py-4">{app.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "REVIEWED"
                              ? "bg-blue-100 text-blue-800"
                              : app.status === "HIRED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {/* State 1: New Applicant -> Admin can Review or Reject */}
                      {app.status === "PENDING" && (
                        <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleUpdateStatus(app.id, "REVIEWED")
                            }
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            <Check className="w-4 h-4 mr-1" /> Review
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(app.id, "REJECTED")
                            }
                            className="inline-flex items-center px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </button>
                        </div>
                      )}

                      {/* State 2: Reviewed Applicant -> Tell the Admin the next step! */}
                      {app.status === "REVIEWED" && (
                        <span className="text-sm text-blue-600 font-medium">
                          Ready to Assign in Courses 🚀
                        </span>
                      )}

                      {/* State 3: Hired Applicant -> Confirm they are active */}
                      {app.status === "HIRED" && (
                        <span className="text-sm text-green-600 font-medium">
                          Active Teacher
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* <div className="p-4 text-sm text-gray-500">
          <details className="mt-4">
            <summary className="cursor-pointer">
              See Raw Data (for debugging)
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto bg-gray-100 p-2 rounded">
              {JSON.stringify(applications, null, 2)}
            </pre>
          </details>
        </div> */}
      </div>
    </div>
  );
}
