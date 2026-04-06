import Link from "next/link";

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId: string }>;
}) {
  const resolvedParams = await searchParams;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Payment Failed ❌
        </h1>
        <p className="text-gray-700 mb-2">
          Unfortunately, your transaction could not be completed.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Transaction ID:{" "}
          <span className="font-mono">{resolvedParams.transactionId}</span>
        </p>

        {/* Let them try again by sending them back to the courses page */}
        <Link
          href="/courses"
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
