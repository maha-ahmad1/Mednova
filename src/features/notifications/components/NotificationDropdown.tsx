"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotificationsDropdown } from "@/features/notifications/hooks/useNotificationsDropdown";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationFooter } from "./NotificationFooter";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationItemCompact } from "../ui/NotificationItemCompact";


export function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotificationsDropdown();

  const recentNotifications = notifications.slice(0, 20);
  const hasNotifications = recentNotifications.length > 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -end-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 me-6" align="end" forceMount>
        <NotificationHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        <ScrollArea className="h-[400px]">
          <DropdownMenuGroup>
            {!hasNotifications ? (
              <NotificationEmptyState isLoading={isLoading} />
            ) : (
              recentNotifications.map((notification) => (
                <NotificationItemCompact
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onCloseDropdown={() => setOpen(false)}
                />
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>

        <NotificationFooter totalCount={notifications.length} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
