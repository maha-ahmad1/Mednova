"use client";

import { useRouter } from "@/i18n/navigation";
import type { Notification } from "../types";
import { NotificationItemBase } from "./NotificationItemBase";

export interface NotificationItemCompactProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onCloseDropdown?: () => void;
}

export function NotificationItemCompact({
  notification,
  onMarkAsRead,
  onCloseDropdown,
}: NotificationItemCompactProps) {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    onCloseDropdown?.();
    router.push(href);
  };

  return (
    <NotificationItemBase
      notification={notification}
      onMarkAsRead={onMarkAsRead}
      onNavigate={handleNavigate}
    />
  );
}
