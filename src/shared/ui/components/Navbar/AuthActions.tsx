"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";
import { useNotificationStore } from "@/store/notificationStore";
import { UserMenu } from "./UserMenu";

export function AuthActions() {
  const { data: session } = useSession();
  const unreadMessagesCount = useNotificationStore(
    (state) =>
      state.notifications.filter(
        (notification) => !notification.read && notification.type === "message"
      ).length
  );

  if (!session?.user) {
    return (
      <Button
        variant="outline"
        className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
        asChild
      >
        <Link href="/login">تسجيل دخول</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="outline"
        className="relative h-10 rounded-xl border-[#32A88D]/40 text-[#1F6F5C] hover:bg-[#32A88D]/10"
      >
        <Link href="/profile/chat" aria-label="فتح الرسائل">
          <MessageCircleMore className="h-4 w-4" />
          <span className="hidden md:inline">الرسائل</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-2 -left-2 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white">
              {unreadMessagesCount}
            </span>
          )}
        </Link>
      </Button>

      <NotificationDropdown />
      <UserMenu />
    </div>
  );
}
