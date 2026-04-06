import AiMSNationLoader from "@/components/shared/AimsNationLoading";

export default function AiMSNationLoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950">
      <AiMSNationLoader width={460} height={300} />
    </div>
  );
}
