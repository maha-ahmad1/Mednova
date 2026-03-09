"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentChats } from "../hooks/useChatApi";

export function ChatDropdown() {
  const [open, setOpen] = useState(false);
  const { data: chats = [], isLoading, isError, refetch } = useCurrentChats();

  useEffect(() => {
    if (!open) return;

    refetch();
    const interval = window.setInterval(() => {
      refetch();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [open, refetch]);

  const unreadCount = useMemo(
    () => chats.reduce((total, chat) => total + (chat.unread_count ?? 0), 0),
    [chats]
  );

  const recentChats = chats.slice(0, 12);

  const formatTimeAgo = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="المحادثات">
          <MessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs" variant="destructive">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 ml-6" align="end" forceMount>
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">المحادثات</h3>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} غير مقروءة</Badge>}
        </div>

        <ScrollArea className="h-[400px]">
          <DropdownMenuGroup>
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">جارٍ تحميل المحادثات...</div>
            ) : isError ? (
              <div className="p-4 text-sm text-red-500">تعذر جلب المحادثات من API الحالي.</div>
            ) : recentChats.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground text-center">لا توجد محادثات حالياً</div>
            ) : (
              recentChats.map((chat) => {
                const chatName = chat.patient_full_name || chat.consultant_full_name;
                const unread = chat.unread_count ?? 0;

                return (
                  <Link
                    key={chat.id}
                    href={`/profile/chat?chat=${chat.id}`}
                    className="block p-3 border-b last:border-0 hover:bg-muted/60 transition"
                    onClick={() => {
                      window.sessionStorage.setItem("preferred_chat_id", String(chat.id));
                      setOpen(false);
                    }}
                  >
                    <div className="flex gap-3 items-start">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chat.patient_image || chat.consultant_image || "/images/placeholder.svg"} />
                        <AvatarFallback>{chatName?.charAt(0) || "C"}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">{chatName}</p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(chat.updated_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {chat.last_message || "رسالة جديدة"}
                        </p>
                      </div>

                      {unread > 0 && (
                        <Badge className="bg-red-500 text-white min-w-5 px-1 h-5 flex items-center justify-center text-xs">
                          {unread > 99 ? "99+" : unread}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </DropdownMenuGroup>
        </ScrollArea>

        <div className="border-t p-2">
          <Link href="/profile/chat" className="w-full block text-center text-sm text-[#32A88D] hover:underline py-1" onClick={() => setOpen(false)}>
            فتح جميع المحادثات ({chats.length})
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
