"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProfileDropdown } from "./ProfileDropdown";

interface TopNavbarProps {
  collapsed: boolean;
  onOpenMobileSidebar: () => void;
}

export function TopNavbar({ collapsed, onOpenMobileSidebar }: TopNavbarProps) {
  return (
    <header
      className={
        "fixed left-0 top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all " +
        (collapsed ? "right-0 lg:right-20" : "right-0 lg:right-72")
      }
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileSidebar}
            aria-label="فتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden text-sm font-semibold text-primary sm:block">لوحة تحكم MedNova</div>
        </div>

        <Breadcrumbs />

        <div className="flex items-center gap-2">
          <div className="relative hidden w-full max-w-xs sm:block">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="بحث سريع..." className="pr-9 text-right" />
          </div>
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
