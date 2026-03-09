"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/store/notificationStore";

type MessageNotificationData = {
  consultation_id?: number;
  message?: string;
  created_at?: string;
};

export function ChatMessagesDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const unreadMessageNotifications = useMemo(() => {
    return notifications
      .filter((notification) => !notification.read)
      .filter((notification) => notification.type === "consultation_message")
      .filter((notification) => {
        const data = notification.data as MessageNotificationData;
        return typeof data?.consultation_id === "number";
      })
      .slice(0, 10);
  }, [notifications]);

  const unreadCount = unreadMessageNotifications.length;

  const goToChat = (notificationId: string, consultationId: number) => {
    markAsRead(notificationId);
    setOpen(false);
    router.push(`/profile/chat?chatId=${consultationId}`);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="الرسائل">
          <MessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="text-right">الرسائل الجديدة</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {unreadMessageNotifications.length === 0 ? (
          <div className="px-3 py-6 text-sm text-muted-foreground text-center">
            لا توجد رسائل غير مقروءة
          </div>
        ) : (
          unreadMessageNotifications.map((notification) => {
            const data = notification.data as MessageNotificationData;
            const consultationId = Number(data.consultation_id);

            return (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer text-right"
                onClick={() => goToChat(notification.id, consultationId)}
              >
                <div className="w-full">
                  <p className="text-sm font-medium truncate">{notification.title || "رسالة جديدة"}</p>
                  <p className="text-xs text-muted-foreground truncate">{notification.message || "لديك رسالة جديدة"}</p>
                </div>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
