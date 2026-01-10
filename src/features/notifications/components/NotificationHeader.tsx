"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  return (
    <>
      <DropdownMenuLabel className="relative flex items-center ">
        <span className="ml-auto pr-2 font-semibold text-right">الإشعارات</span>

        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute  h-auto  text-xs"
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
