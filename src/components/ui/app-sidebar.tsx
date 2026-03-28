"use client";

import {
  Home,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";
import { useSession, signOut } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Our navigation blueprint matching the backend APIs we built
const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Payments", url: "/dashboard/Payments", icon: FileText },
  { title: "Careers (ATS)", url: "/dashboard/careers", icon: Briefcase },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            A
          </div>
          AiMS Nation
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-2">
          <div className="px-2 text-sm">
            <p className="font-semibold text-foreground truncate">
              {session?.user?.name || "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
          <SidebarMenuButton
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
