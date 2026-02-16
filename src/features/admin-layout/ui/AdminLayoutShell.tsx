"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminSidebarGroups } from "@/features/admin-layout/config/navigation";
import { AdminSidebar } from "./components/AdminSidebar";
import { TopNavbar } from "./components/TopNavbar";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroupId, setOpenGroupId] = useState(adminSidebarGroups[0].id);

  const activeGroupId = useMemo(() => {
    const matched = adminSidebarGroups.find((group) =>
      group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
    );

    return matched?.id ?? adminSidebarGroups[0].id;
  }, [pathname]);

  useEffect(() => {
    setOpenGroupId(activeGroupId);
  }, [activeGroupId]);

  const handleGroupToggle = (groupId: string) => {
    setOpenGroupId((current) => (current === groupId ? "" : groupId));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-muted/30">
      <AdminSidebar
        collapsed={collapsed}
        openGroupId={openGroupId}
        onGroupToggle={handleGroupToggle}
        onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <TopNavbar collapsed={collapsed} onOpenMobileSidebar={() => setMobileOpen(true)} />

      <main
        className={cn(
          "pt-16 transition-all",
          collapsed ? "lg:pr-20" : "lg:pr-72",
        )}
      >
        <div className="p-4 text-right sm:p-6">{children}</div>
      </main>
    </div>
  );
}
