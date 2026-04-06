import Link from "next/link";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId: string }>;
}) {
  const resolvedParams = await searchParams;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-[#4b8153] mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-700 mb-2">
          Thank you for enrolling at AiMS Nation.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Transaction ID:{" "}
          <span className="font-mono text-gray-500">
            {resolvedParams.transactionId}
          </span>
        </p>

        <Link
          href="/dashboard"
          className="px-6 py-2 bg-[#4b8153] text-white font-semibold rounded hover:bg-[#3a6440] transition"
        >
          Go to My Dashboard
        </Link>
      </div>
    </div>
  );
}
