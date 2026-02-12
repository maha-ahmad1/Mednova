"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AdminSidebarSubItem } from "@/features/admin-layout/config/navigation";

interface SidebarSubItemProps {
  item: AdminSidebarSubItem;
  isActive: boolean;
  onNavigate?: () => void;
}

export function SidebarSubItem({ item, isActive, onNavigate }: SidebarSubItemProps) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex flex-row-reverse items-center gap-2 rounded-md px-3 py-2 text-right text-sm transition-colors",
        "hover:bg-muted/80",
        isActive && "border-r-2 border-primary bg-primary/10 font-medium text-primary",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      <span className="flex-1">{item.label}</span>
      {item.badge ? <Badge variant="secondary">{item.badge}</Badge> : null}
    </Link>
  );
}
