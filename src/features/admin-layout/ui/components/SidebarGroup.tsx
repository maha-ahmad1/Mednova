"use client";

import type { AdminNavGroup } from "@/features/admin-layout/config/navigation";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";

interface SidebarGroupProps {
  group: AdminNavGroup;
  collapsed: boolean;
  isItemActive: (href: string) => boolean;
  onNavigate?: () => void;
}

export function SidebarGroup({ group, collapsed, isItemActive, onNavigate }: SidebarGroupProps) {
  return (
    <section className="space-y-2">
      {!collapsed ? (
        <h2 className="px-3 text-xs font-semibold text-muted-foreground">{group.title}</h2>
      ) : null}

      <div className={cn("space-y-1", collapsed && "flex flex-col items-center") }>
        {group.items.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isActive={isItemActive(item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}
