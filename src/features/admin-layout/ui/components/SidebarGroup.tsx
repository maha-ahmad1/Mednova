"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminSidebarGroup as AdminSidebarGroupType } from "@/features/admin-layout/config/navigation";
import { SidebarSubItem } from "./SidebarSubItem";

interface SidebarGroupProps {
  group: AdminSidebarGroupType;
  collapsed: boolean;
  isOpen: boolean;
  isItemActive: (href: string) => boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function SidebarGroup({
  group,
  collapsed,
  isOpen,
  isItemActive,
  onToggle,
  onNavigate,
}: SidebarGroupProps) {
  const GroupIcon = group.icon;
  const hasActiveSubItem = group.items.some((item) => isItemActive(item.href));

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-center rounded-lg px-2 py-2.5 text-muted-foreground transition-colors hover:bg-muted/80",
          hasActiveSubItem && "bg-primary/10 text-primary",
        )}
        aria-label={group.label}
        title={group.label}
      >
        <GroupIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <section className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/80",
          hasActiveSubItem && "text-primary",
        )}
        aria-expanded={isOpen}
      >
        <GroupIcon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid overflow-hidden pr-6 transition-all duration-300",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
        )}
      >
        <div className="min-h-0 space-y-1">
          {group.items.map((item) => (
            <SidebarSubItem
              key={item.href}
              item={item}
              isActive={isItemActive(item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
