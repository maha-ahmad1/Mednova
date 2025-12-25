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
import { NotificationItem } from "./NotificationItem";
import {
  formatTimeAgo,
  getNotificationIcon,
  getNotificationColor,
} from "../utils/notificationHelpers";


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
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" forceMount>
        {/* Header */}
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
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  type={notification.type}
                  title={notification.title}
                  message={notification.message}
                  data={notification.data}
                  read={notification.read}
                  createdAt={notification.createdAt}
                  source={notification.source}
                  onMarkAsRead={handleMarkAsRead}
                  getIcon={getNotificationIcon}
                  getColor={getNotificationColor}
                  formatTimeAgo={formatTimeAgo}
                />
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>

        {/* Footer */}
        <NotificationFooter totalCount={notifications.length} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}