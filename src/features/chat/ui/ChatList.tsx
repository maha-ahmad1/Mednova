"use client";

import { Search, MessageCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import type { ChatRequest } from "@/types/chat";

interface ChatListProps {
  chats: ChatRequest[];
  selectedChat: ChatRequest | null;
  onSelectChat: (chat: ChatRequest) => void;
  unreadByConversation: Record<number, number>;
  isLoading: boolean;
}

export default function ChatList({
  chats,
  selectedChat,
  onSelectChat,
  unreadByConversation,
  isLoading,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return chats;

    return chats.filter((chat) => {
      const patientName = chat.patient_full_name?.toLowerCase() ?? "";
      const consultantName = chat.consultant_full_name?.toLowerCase() ?? "";

      return (
        patientName.includes(normalizedQuery) ||
        consultantName.includes(normalizedQuery)
      );
    });
  }, [chats, searchQuery]);

  const formatTimeLabel = (dateString: string) => {
    const time = new Date(dateString);
    const now = new Date();
    const isToday = time.toDateString() === now.toDateString();

    return isToday
      ? time.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      : time.toLocaleDateString("ar-SA");
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b space-y-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#32A88D]" />
            المحادثات
          </h2>
          <Badge className="bg-[#32A88D] text-white">{filteredChats.length}</Badge>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ابحث في المحادثات..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pr-10 bg-gray-50 border-gray-200 rounded-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8 text-center text-gray-500 text-sm">
            لا توجد محادثات مطابقة.
          </div>
        ) : (
          filteredChats.map((chat) => {
            const unreadCount = unreadByConversation[chat.id] ?? 0;
            const isSelected = selectedChat?.id === chat.id;
            const displayName = chat.consultant_full_name || chat.patient_full_name;
            const roleLabel =
              chat.consultant_type === "therapist" ? "معالج" : "مركز تأهيل";

            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat)}
                className={`w-full p-4 border-b text-right transition-colors hover:bg-gray-50 ${
                  isSelected ? "bg-[#32A88D]/10 border-r-4 border-r-[#32A88D]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-11 w-11">
                      <AvatarImage
                        src={chat.consultant_image || chat.patient_image || "/images/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-[#32A88D]/10 text-[#32A88D]">
                        {displayName?.charAt(0) || "م"}
                      </AvatarFallback>
                    </Avatar>

                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -left-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] leading-none flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-sm text-gray-800 truncate">{displayName}</p>
                      <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatTimeLabel(chat.updated_at)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500 truncate">
                        #{chat.id} • {roleLabel}
                      </p>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-medium text-red-600">غير مقروء</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
