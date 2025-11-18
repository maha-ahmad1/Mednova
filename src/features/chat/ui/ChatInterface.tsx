// components/Chat/ChatInterface.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from "../hooks/useChatApi";
import { useChatPusher } from "../hooks/useChatPusher";
import type { ChatRequest } from "@/types/chat";

interface ChatInterfaceProps {
  chatRequest: ChatRequest;
  onBack?: () => void;
}

export default function ChatInterface({
  chatRequest,
  onBack,
}: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, error } = useMessages(chatRequest.id);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  useChatPusher(
    chatRequest.id,
    chatRequest.patient_id,
    chatRequest.consultant_id
  );

  const currentUserId = session?.user?.id;
  const isPatient = session?.role === "patient";

  const otherUser = isPatient
    ? {
        id: chatRequest.consultant_id,
        name: chatRequest.consultant_full_name,
        type: chatRequest.consultant_type,
        image: chatRequest.consultant_image || "/default-avatar.png",
      }
    : {
        id: chatRequest.patient_id,
        name: chatRequest.patient_full_name,
        type: "patient",
        image: chatRequest.patient_image || "/default-avatar.png",
      };

  const currentUser = {
    id: currentUserId,
    name: session?.user?.name || "أنت",
    image: session?.user?.image || "/default-avatar.png",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // useEffect(() => {
  //   if (messages && currentUserId) {
  //     const unreadMessages = messages.filter(
  //       (msg) =>
  //         Number(msg.receiver_id) === Number(currentUserId) &&
  //         !msg.is_read
  //     );

  //     console.log("unreadMessages", unreadMessages);

  //     unreadMessages.forEach((msg) => {
  //       markAsReadMutation.mutate(msg.id);
  //     });
  //   }
  // }, [messages, currentUserId, markAsReadMutation]);

  // في ChatInterface.tsx - تحديث useEffect

  // const getUnreadCount = () => {
  //   if (!messages || !currentUserId) return 0;

  //   return messages.filter((msg) => {
  //     const senderId =
  //       typeof msg.sender_id === "object" ? msg.sender_id.id : msg.sender_id;

  //     const receiverId =
  //       typeof msg.receiver_id === "object"
  //         ? msg.receiver_id.id
  //         : msg.receiver_id;

  //     // الرسائل غير المقروءة هي التي أرسلها الآخر ولم أقرأها
  //     return (
  //       Number(senderId) !== Number(currentUserId) &&
  //       Number(receiverId) === Number(currentUserId) &&
  //       !msg.is_read
  //     );
  //   }).length;
  // };

  // const unreadCount = getUnreadCount();

// استخدم useRef لتتبع آخر مرة تم فيها تعليم الرسائل
const lastProcessedRef = useRef<number>(0);

useEffect(() => {
  if (messages && currentUserId) {
    // امنع المعالجة المتكررة خلال 3 ثوانٍ
    const now = Date.now();
    if (now - lastProcessedRef.current < 3000) {
      return;
    }

    // احصل على المرسلين الذين لديهم رسائل غير مقروءة
    const unreadSenders = messages.reduce((senders, msg) => {
      const senderId = typeof msg.sender_id === "object" ? msg.sender_id.id : msg.sender_id;
      const receiverId = typeof msg.receiver_id === "object" ? msg.receiver_id.id : msg.receiver_id;
      
      if (
        Number(senderId) !== Number(currentUserId) &&
        Number(receiverId) === Number(currentUserId) &&
        !msg.is_read
      ) {
        senders.add(senderId);
      }
      return senders;
    }, new Set<number>());

    if (unreadSenders.size > 0) {
      console.log("🔄 تعليم رسائل المرسلين كمقروءة:", Array.from(unreadSenders));
      
      // تحديث الوقت الأخير للمعالجة
      lastProcessedRef.current = now;
      
      // أرسل طلب لكل مرسل
      unreadSenders.forEach((senderId) => {
        markAsReadMutation.mutate(senderId);
      });
    }
  }
}, [messages, currentUserId, markAsReadMutation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    try {
      await sendMessageMutation.mutateAsync({
        receiver_id: otherUser.id,
        message: newMessage.trim(),
        chat_request_id: chatRequest.id,
      });

      setNewMessage("");
    } catch (error) {
      console.error("❌ فشل في إرسال الرسالة:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  
  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <div className="text-lg font-semibold mb-2">
              خطأ في تحميل المحادثة
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#32A88D]" />
          <span className="mr-2">جاري تحميل المحادثة...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b bg-gray-50 py-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          <Avatar className="w-10 h-10 border-2 border-[#32A88D]">
            <AvatarImage src={otherUser.image} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div>
            <div className="font-semibold">{otherUser.name}</div>
            <div className="text-sm text-gray-500">
              {otherUser.type === "therapist"
                ? "معالج"
                : otherUser.type === "rehabilitation_center"
                ? "مركز تأهيل"
                : "مريض"}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 whatsapp-bg">
          {messages?.map((message) => {
            const senderId =
              typeof message.sender_id === "object"
                ? message.sender_id.id
                : message.sender_id;

            const isMyMessage = Number(senderId) === Number(currentUserId);
            console.log("senderId 1 " + senderId);
            return (
              <div
                key={message.id}
                className={`flex ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[75%] ${
                    isMyMessage ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`px-3 py-2 text-sm rounded-2xl shadow-sm whitespace-pre-wrap ${
                      isMyMessage
                        ? "bg-[#DCF8C6] rounded-br-none"
                        : "bg-white rounded-bl-none"
                    }`}
                  >
                    <p>{message.message}</p>

                    <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-600">
                      {formatTime(message.created_at)}

                      {/* عرض حالة القراءة للرسائل المرسلة */}
                      {isMyMessage && (
                        <span
                          className={`mr-1 flex items-center ${
                            message.is_read ? "text-blue-600" : "text-gray-400"
                          }`}
                          // title={
                          //   message.is_read
                          //     ? `تم القراءة في ${formatTime(message.read_at)}`
                          //     : "تم الإرسال"
                          // }
                        >
                          {message.is_read ? (
                            <>
                              <span>✓✓</span>
                              {/* <span className="mr-1 text-[8px]">
                                {message.read_at
                                  ? formatTime(message.read_at)
                                  : "مقروء"}
                              </span> */}
                            </>
                          ) : (
                            <>
                              <span>✓</span>
                              {/* <span className="mr-1 text-[8px]">مرسل</span> */}
                            </>
                          )}
                        </span>
                      )}

                      {/* عرض "جديد" للرسائل الواردة غير المقروءة */}
                      {/* {!isMyMessage && !message.is_read && (
                        <span className="mr-1 text-[8px] text-red-500 bg-red-100 px-1 rounded">
                          جديد
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-3">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالة..."
              className="flex-1 rounded-full bg-gray-100 border-none focus-visible:ring-0"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="rounded-full h-10 w-10 p-0 bg-[#32A88D]"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
