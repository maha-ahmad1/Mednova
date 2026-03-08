"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatRequest } from "@/types/chat";

interface ChatListProps {
  chats: ChatRequest[];
  unreadByChatId?: Record<number, number>;
  selectedChat: ChatRequest | null;
  onSelectChat: (chat: ChatRequest) => void;
  isMobile: boolean;
  isLoading?: boolean;
}

const ACCESSIBLE_STATUSES = new Set(["accepted", "active", "completed"]);

export default function ChatList({
  chats,
  unreadByChatId = {},
  selectedChat,
  onSelectChat,
  isMobile,
  isLoading = false,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (!normalizedSearch) return chats;

    return chats.filter((chat) => {
      const patientName = chat.patient_full_name?.toLowerCase() || "";
      const consultantName = chat.consultant_full_name?.toLowerCase() || "";
      return (
        patientName.includes(normalizedSearch) ||
        consultantName.includes(normalizedSearch)
      );
    });
  }, [chats, searchQuery]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("ar-SA", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
      case "active":
        return "متاحة الآن";
      case "completed":
        return "منتهية";
      case "pending":
        return "بانتظار القبول";
      case "cancelled":
        return "ملغية";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col" dir="rtl">
        <div className="p-4 border-b space-y-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white" dir="rtl">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <MessageCircle className="w-5 h-5 text-[#32A88D]" />
            المحادثات
          </h2>
          <Badge variant="secondary">{filteredChats.length}</Badge>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم..."
            className="pr-9"
            aria-label="البحث في المحادثات"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6 text-center">
            <div>
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? "لا توجد محادثات مطابقة للبحث"
                  : "لا توجد محادثات متاحة حالياً"}
              </p>
            </div>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isSelected = selectedChat?.id === chat.id;
            const isAccessible = ACCESSIBLE_STATUSES.has(chat.status);
            const unreadCount = unreadByChatId[chat.id] || 0;
            const totalMessages =
              (chat.patient_message_count || 0) +
              (chat.consultant_message_count || 0);
            const displayName =
              chat.patient_full_name || chat.consultant_full_name || "مستخدم";
            const image = chat.patient_image || chat.consultant_image;

            return (
              <button
                type="button"
                key={chat.id}
                disabled={!isAccessible}
                onClick={() => onSelectChat(chat)}
                className={`w-full text-right p-4 border-b transition-colors ${
                  isSelected
                    ? "bg-[#32A88D]/10 border-r-4 border-r-[#32A88D]"
                    : "hover:bg-gray-50 border-r-4 border-r-transparent"
                } ${!isAccessible ? "opacity-70 cursor-not-allowed" : ""} ${
                  unreadCount > 0 ? "bg-emerald-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={image || "/images/placeholder.svg"} />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-medium text-sm truncate ${unreadCount > 0 ? "text-emerald-700" : "text-gray-800"}`}>
                        {displayName}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {unreadCount > 0 && (
                          <Badge className="h-5 min-w-5 px-1 text-xs bg-emerald-600 hover:bg-emerald-600">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(chat.updated_at)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 truncate">
                      {totalMessages > 0
                        ? `${totalMessages} رسالة في هذه المحادثة`
                        : "لا توجد رسائل بعد"}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {chat.consultant_type === "therapist"
                          ? "معالج"
                          : "مركز تأهيل"}
                      </span>
                      <span className="text-xs flex items-center gap-1">
                        {isAccessible ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                        )}
                        {getStatusText(chat.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {isMobile && selectedChat && (
        <div className="p-3 border-t text-xs text-gray-500 text-center">
          اسحب للرجوع أو اضغط على السهم للعودة إلى قائمة المحادثات
        </div>
      )}
    </div>
  );
}
