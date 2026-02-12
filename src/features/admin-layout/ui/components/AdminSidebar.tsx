"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  adminSidebarGroups,
  adminSidebarLogoutAction,
} from "@/features/admin-layout/config/navigation";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarItem } from "./SidebarItem";

interface AdminSidebarProps {
  collapsed: boolean;
  openGroupId: string;
  onGroupToggle: (groupId: string) => void;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function AdminSidebar({
  collapsed,
  openGroupId,
  onGroupToggle,
  onToggleCollapsed,
  mobileOpen,
  onMobileOpenChange,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const sidebarWidthClass = collapsed ? "lg:w-20" : "lg:w-72";

  const isItemActive = useMemo(
    () =>
      (href: string) => {
        if (href === "/admin/users") {
          return pathname === href;
        }

        return pathname.startsWith(href);
      },
    [pathname],
  );

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed ? (
          <Link href="/admin/users" className="text-base font-bold text-primary">
            MedNova Admin
          </Link>
        ) : (
          <span className="text-sm font-bold text-primary">MN</span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleCollapsed}
          aria-label="Toggle sidebar"
        >
          <ChevronsLeftRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {adminSidebarGroups.map((group) => (
            <SidebarGroup
              key={group.id}
              group={group}
              collapsed={collapsed}
              isOpen={openGroupId === group.id}
              isItemActive={isItemActive}
              onToggle={() => onGroupToggle(group.id)}
              onNavigate={() => onMobileOpenChange(false)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <SidebarItem
          item={adminSidebarLogoutAction}
          collapsed={collapsed}
          onNavigate={() => onMobileOpenChange(false)}
        />
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-card lg:block",
          sidebarWidthClass,
        )}
      >
        {sidebarContent}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-[280px] p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
