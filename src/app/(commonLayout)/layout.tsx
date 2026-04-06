// src/app/(commonLayout)/layout.tsx
import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 👉 Pass the prop here to make it blend into the background */}
      <Navbar transparent={true} />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}