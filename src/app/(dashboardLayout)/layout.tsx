
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/authClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-muted/10 w-full overflow-hidden">
        {/* The Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="text-primary" />
          <div className="w-px h-6 bg-border mx-2" />
          <h1 className="text-sm font-medium text-muted-foreground">
            Portal / Overview
          </h1>
        </header>

        {/* The Actual Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
