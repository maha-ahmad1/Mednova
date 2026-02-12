"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
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
      <div className="flex h-20 items-center justify-between border-b px-4">
        <Link href="/admin/users" className="flex items-center gap-2">
          {collapsed ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
              M
            </span>
          ) : (
            <Image
              src="/images/auth/mednova-logo.png"
              alt="MedNova"
              width={128}
              height={36}
              className="h-9 w-auto"
              priority
            />
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleCollapsed}
          aria-label="طي الشريط الجانبي"
        >
          {collapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
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
