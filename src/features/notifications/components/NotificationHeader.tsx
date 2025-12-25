"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export function NotificationHeader({ unreadCount, onMarkAllAsRead }: NotificationHeaderProps) {
  return (
    <>
      <DropdownMenuLabel className="flex items-center justify-between">
        <span className="font-semibold">الإشعارات</span>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={onMarkAllAsRead}
          >
            تعيين الكل كمقروء
          </Button>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
    </>
  );
}