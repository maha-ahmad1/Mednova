"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AdminSidebarAction } from "@/features/admin-layout/config/navigation";

interface SidebarItemProps {
  item: AdminSidebarAction;
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarItem({ item, collapsed, onNavigate }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10",
        collapsed && "justify-center px-2",
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed ? <span>{item.label}</span> : null}
    </Link>
  );
}
