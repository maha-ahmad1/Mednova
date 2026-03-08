"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetcher } from "@/hooks/useFetcher";
import { TimeZoneService } from "@/lib/timezone-service";
import type { ChatRequest } from "@/types/chat";
import type { ConsultationRequest } from "@/types/consultation";
import ChatInterface from "./ChatInterface";
import ChatList from "./ChatList";
import { useNotificationStore } from "@/store/notificationStore";

interface ConsultationResponse {
  success: boolean;
  message: string;
  data: ConsultationRequest[];
  status: string;
}

const mapConsultationToChatRequest = (
  consultation: ConsultationRequest
): ChatRequest => ({
  id: consultation.id,
  patient_id: consultation.data.patient.id,
  consultant_id: consultation.data.consultant.id,
  consultant_type: consultation.data.consultant_type,
  status: consultation.status,
  first_patient_message_at: consultation.data.first_patient_message_at,
  first_consultant_message_at: consultation.data.first_consultant_reply_at,
  patient_message_count: consultation.data.patient_message_count,
  consultant_message_count: consultation.data.consultant_message_count,
  max_messages_for_patient: consultation.data.max_messages_for_patient,
  created_at: consultation.created_at,
  updated_at: consultation.updated_at,
  consultant_full_name: consultation.data.consultant.full_name,
  patient_full_name: consultation.data.patient.full_name,
  patient_image: consultation.data.patient.image,
  consultant_image: consultation.data.consultant.image,
});

export default function ChatPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<ChatRequest | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [timezone, setTimezone] = useState<string>("");
  const notifications = useNotificationStore((state) => state.notifications);

  const requestedChatId = Number(searchParams.get("chatId"));

  useEffect(() => {
    setTimezone(TimeZoneService.detectUserTimeZone());

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const { data, isLoading } = useFetcher<ConsultationResponse>(
    ["chat-consultations"],
    timezone
      ? `/api/consultation-request/get-status-request?limit=50&current_time_zone=${timezone}`
      : null,
    { enabled: !!timezone }
  );

  const chats = useMemo(() => {
    const source = data?.data || [];
    return source
      .filter((request) => request.type === "chat")
      .map(mapConsultationToChatRequest)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [data]);

  const unreadByChatId = useMemo(() => {
    const map: Record<number, number> = {};

    notifications
      .filter((notification) => !notification.read)
      .filter((notification) => notification.type === "consultation_message")
      .forEach((notification) => {
        const consultationId = Number(
          (notification.data as { consultation_id?: number })?.consultation_id
        );

        if (!consultationId) return;
        map[consultationId] = (map[consultationId] || 0) + 1;
      });

    return map;
  }, [notifications]);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aUnread = unreadByChatId[a.id] || 0;
      const bUnread = unreadByChatId[b.id] || 0;

      if (aUnread !== bUnread) return bUnread - aUnread;

      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [chats, unreadByChatId]);

  useEffect(() => {
    if (requestedChatId && sortedChats.length > 0) {
      const requestedChat = sortedChats.find((chat) => chat.id === requestedChatId);
      if (requestedChat) {
        setSelectedChat(requestedChat);
        return;
      }
    }

    if (!selectedChat && sortedChats.length > 0 && !isMobile) {
      setSelectedChat(sortedChats[0]);
    }
  }, [sortedChats, selectedChat, isMobile, requestedChatId]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">يجب تسجيل الدخول للوصول إلى المحادثات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] min-h-[640px] flex bg-white rounded-xl border overflow-hidden">
      <aside
        className={`border-l bg-white ${
          isMobile && selectedChat ? "hidden" : "flex"
        } w-full lg:w-96 xl:w-[30rem] flex-col`}
      >
        <ChatList
          chats={sortedChats}
          unreadByChatId={unreadByChatId}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          isMobile={isMobile}
          isLoading={isLoading}
        />
      </aside>

      <main className={`${isMobile && !selectedChat ? "hidden" : "flex"} flex-1 bg-gray-50`}>
        {selectedChat ? (
          <ChatInterface chatRequest={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8" dir="rtl">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-[#32A88D]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#32A88D]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">مرحباً بك في المحادثات</h3>
              <p className="text-gray-600 text-sm mb-5">
                اختر محادثة من القائمة لعرض الرسائل وإرسال ردودك بشكل فوري.
              </p>
              {isMobile && sortedChats.length > 0 && (
                <Button onClick={() => setSelectedChat(sortedChats[0])}>
                  فتح آخر محادثة
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
