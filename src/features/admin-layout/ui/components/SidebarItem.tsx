"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AdminNavItem } from "@/features/admin-layout/config/navigation";

interface SidebarItemProps {
  item: AdminNavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({ item, isActive, collapsed, onNavigate }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        "hover:bg-muted/80",
        isActive && "bg-primary/10 text-primary",
        collapsed && "justify-center px-2",
      )}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge ? <Badge variant="secondary">{item.badge}</Badge> : null}
        </>
      )}
    </Link>
  );
}
