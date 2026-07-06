"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotificationSoundStore } from "@/store/notificationSoundStore";

export interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
}: NotificationHeaderProps) {
  const muted = useNotificationSoundStore((state) => state.muted);
  const toggleMute = useNotificationSoundStore((state) => state.toggleMute);

  return (
    <>
      <DropdownMenuLabel className="relative flex items-center ">
        <span className="ml-auto pr-2 font-semibold text-right">الإشعارات</span>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.preventDefault();
            toggleMute();
          }}
          title={muted ? "تفعيل صوت الإشعارات" : "كتم صوت الإشعارات"}
        >
          {muted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>

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
