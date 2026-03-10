"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useFetcher } from "@/hooks/useFetcher";
import { useNotificationStore } from "@/store/notificationStore";
import type { Notification } from "@/store/notificationStore";
import type { ConsultationRequest } from "@/types/consultation";
import type { ChatRequest } from "@/types/chat";
import ChatInterface from "./ChatInterface";
import ChatList from "./ChatList";

interface ConsultationsResponse {
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
  const consultationIdFromQuery = Number(searchParams.get("consultationId") || 0);

  const [selectedChat, setSelectedChat] = useState<ChatRequest | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: consultationsResponse, isLoading } = useFetcher<ConsultationsResponse>(
    ["chat-conversations"],
    "/api/consultation-request/get-status-request?limit=30",
    {
      enabled: !!session?.user,
      staleTime: 1,
    }
  );

  const { notifications, markAsRead } = useNotificationStore((state) => ({
    notifications: state.notifications,
    markAsRead: state.markAsRead,
  }));

  const chats = useMemo(() => {
    const consultations = consultationsResponse?.data ?? [];
    return consultations
      .filter((consultation) => consultation.type === "chat")
      .map(mapConsultationToChatRequest)
      .sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [consultationsResponse]);

  const unreadByConversation = useMemo(() => {
    return notifications.reduce<Record<number, number>>((acc, notification) => {
      if (notification.type !== "message" || notification.read) return acc;

      const consultationId = Number(
        (notification.data as Record<string, unknown>)?.consultation_id
      );

      if (!consultationId) return acc;

      acc[consultationId] = (acc[consultationId] ?? 0) + 1;
      return acc;
    }, {});
  }, [notifications]);

  const markConversationNotificationsAsRead = (conversationId: number) => {
    notifications.forEach((notification: Notification) => {
      const notificationConsultationId = Number(
        (notification.data as Record<string, unknown>)?.consultation_id
      );

      if (
        notification.type === "message" &&
        !notification.read &&
        notificationConsultationId === conversationId
      ) {
        markAsRead(notification.id);
      }
    });
  };

  useEffect(() => {
    if (selectedChat || chats.length === 0) return;

    const byQuery = chats.find((chat) => chat.id === consultationIdFromQuery);
    if (byQuery) {
      setSelectedChat(byQuery);
      return;
    }

    const firstUnread = chats.find((chat) => (unreadByConversation[chat.id] ?? 0) > 0);
    setSelectedChat(firstUnread ?? chats[0]);
  }, [selectedChat, chats, consultationIdFromQuery, unreadByConversation]);

  useEffect(() => {
    const checkScreenSize = () => {
      const sidebarWidth = 250;
      const availableWidth = window.innerWidth - sidebarWidth;
      setIsMobile(availableWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
    <div className="h-full flex flex-col">
      {isMobile && selectedChat && (
        <div className="flex items-center gap-3 p-4 border-b bg-white lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedChat(null)}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800">
              {selectedChat.patient_full_name || selectedChat.consultant_full_name}
            </h2>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        <div
          className={`
            ${isMobile && selectedChat ? "hidden" : "flex"}
            ${isMobile ? "w-full" : "w-full lg:w-96 xl:w-1/3"}
            flex-col border-l bg-white
            lg:flex lg:static
          `}
        >
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            unreadByConversation={unreadByConversation}
            isLoading={isLoading}
            onSelectChat={(chat) => {
              setSelectedChat(chat);
              markConversationNotificationsAsRead(chat.id);
              if (isMobile) setMobileMenuOpen(false);
            }}
          />
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <ChatList
              chats={chats}
              selectedChat={selectedChat}
              unreadByConversation={unreadByConversation}
              isLoading={isLoading}
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                markConversationNotificationsAsRead(chat.id);
                setMobileMenuOpen(false);
              }}
            />
          </SheetContent>
        </Sheet>

        <div
          className={`
            ${isMobile && !selectedChat ? "hidden" : "flex"}
            flex-1 flex-col
            bg-gray-50
          `}
        >
          {selectedChat ? (
            <ChatInterface
              chatRequest={selectedChat}
              onBack={() => {
                setSelectedChat(null);
                if (isMobile) setMobileMenuOpen(true);
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#32A88D] to-[#2a8f7a] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  مرحباً في المحادثات
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  اختر محادثة من القائمة لبدء التحدث.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
