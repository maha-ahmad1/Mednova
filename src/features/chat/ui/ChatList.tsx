"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentChats } from "../hooks/useChatApi";
import type { ChatRequest } from "@/types/chat";

interface ChatListProps {
  selectedChat: ChatRequest | null;
  onSelectChat: (chat: ChatRequest) => void;
  isMobile: boolean;
}

export default function ChatList({ selectedChat, onSelectChat }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: chats = [], isLoading, error } = useCurrentChats();

  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter((chat) =>
      `${chat.patient_full_name || ""} ${chat.consultant_full_name || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [chats, searchQuery]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
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

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <MessageCircle className="w-14 h-14 text-gray-300 mb-4" />
        <h3 className="font-semibold text-gray-700 mb-2">تعذر تحميل المحادثات</h3>
        <p className="text-gray-500 text-sm">يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-gray-50 border-gray-200 rounded-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="w-14 h-14 text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">لا توجد محادثات</h3>
            <p className="text-gray-500 text-sm">
              عند وصول رسائل جديدة ستظهر هنا تلقائيًا.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isSelected = selectedChat?.id === chat.id;
            const unreadCount = chat.unread_count ?? 0;
            const chatName = chat.patient_full_name || chat.consultant_full_name;

            return (
              <button
                key={chat.id}
                className={`w-full text-right p-4 border-b transition-all hover:bg-gray-50 ${
                  isSelected
                    ? "bg-[#32A88D]/10 border-r-4 border-[#32A88D]"
                    : "border-r-4 border-transparent"
                }`}
                onClick={() => onSelectChat(chat)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border border-[#32A88D]/20">
                      <AvatarImage src={chat.patient_image || chat.consultant_image || "/images/placeholder.svg"} />
                      <AvatarFallback className="bg-[#32A88D]/10 text-[#32A88D]">
                        {chatName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs border border-white flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm text-gray-800 truncate">{chatName}</h3>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(chat.updated_at)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 truncate mt-1">{chat.last_message || "ابدأ المحادثة الآن"}</p>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                        {chat.consultant_type === "therapist" ? "معالج" : "مركز تأهيل"}
                      </span>
                      {unreadCount > 0 && <span className="text-[#32A88D]">{unreadCount} غير مقروءة</span>}
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
