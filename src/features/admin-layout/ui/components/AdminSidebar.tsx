"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { adminLogoutItem, adminNavigation } from "@/features/admin-layout/config/navigation";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarItem } from "./SidebarItem";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileOpenChange,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const sidebarWidthClass = collapsed ? "lg:w-20" : "lg:w-72";

  const isItemActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed ? (
          <Link href="/admin" className="text-base font-bold text-primary">
            MedNova Admin
          </Link>
        ) : (
          <span className="text-sm font-bold text-primary">MN</span>
        )}

        <Button variant="ghost" size="icon" className="hidden lg:inline-flex" onClick={onToggleCollapsed}>
          <ChevronsLeftRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {adminNavigation.map((group) => (
            <SidebarGroup
              key={group.title}
              group={group}
              collapsed={collapsed}
              isItemActive={isItemActive}
              onNavigate={() => onMobileOpenChange(false)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <SidebarItem
          item={adminLogoutItem}
          isActive={false}
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
          "fixed inset-y-0 right-0 z-40 hidden border-l bg-card lg:block",
          sidebarWidthClass,
        )}
      >
        {sidebarContent}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="right" className="w-[280px] p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
