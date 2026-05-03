// Adjust import path if needed

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar transparent={true} />

      {/* This renders all the pages inside (commonLayout) */}
      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}
