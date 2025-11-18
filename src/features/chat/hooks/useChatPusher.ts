"use client";
import { useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { createEcho } from "@/lib/echo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Message, PusherMessageEvent } from "@/types/chat";

interface PusherChannel {
  name?: string;
  listen: (event: string, handler: (payload: unknown) => void) => void;
  subscribed?: (cb: () => void) => void;
  stopListening?: (event: string) => void;
  error?: (handler: (err: unknown) => void) => void;
}

interface MessageReadEvent {
  sender_id?: number;
  read_at?: boolean;
}

export const useChatPusher = (
  chatRequestId?: number,
  patientId?: number,
  consultantId?: number
) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const echoRef = useRef<ReturnType<typeof createEcho> | null>(null);
  const channelRef = useRef<PusherChannel | null>(null);
  const currentChannelRef = useRef<string>("");

  const listenForMessages = useCallback(
    (echo: ReturnType<typeof createEcho>, userId: string | number) => {
      if (!chatRequestId || !patientId || !consultantId) return null;

      const channelName = `chat.between.${patientId}.${consultantId}`;

      // إذا كان هناك قناة نشطة بالفعل لنفس المحادثة، أرجعها
      if (
        channelRef.current &&
        echoRef.current === echo &&
        currentChannelRef.current === channelName
      ) {
        console.log("🔁 إعادة استخدام قناة الشات الحالية:", channelName);
        return channelRef.current;
      }

      console.log("🎯 الاستماع على قناة الشات:", channelName);

      try {
        const channel = echo.private(channelName);

        // استمع للرسائل الجديدة
        channel.listen("MessageSent", (event: PusherMessageEvent) => {
          console.log("📨 رسالة جديدة من Pusher:", event);

          const receivedMessage = event.message;

          // تحويل البيانات
          const newMessage: Message = {
            ...receivedMessage,
            is_read: receivedMessage.is_read === 1,
          };

          // تحديث cache الرسائل
          if (
            chatRequestId &&
            receivedMessage.chat_request_id === chatRequestId
          ) {
            queryClient.setQueryData(
              ["messages", chatRequestId],
              (old: Message[] = []) => {
                const exists = old.find((msg) => msg.id === receivedMessage.id);
                if (exists) return old;

                return [...old, newMessage];
              }
            );

            // إشعار إذا لم يكن المستخدم هو المرسل
            if (receivedMessage.sender_id !== userId) {
              toast.info(`رسالة جديدة`, {
                duration: 3000,
              });
            }
          }
        });

        channel.listen("MessageRead", (event: MessageReadEvent) => {
          console.log("📖 تم تحديث حالة قراءة الرسائل:", event);

          if (event.sender_id && chatRequestId) {
            queryClient.setQueryData(
              ["messages", chatRequestId],
              (old: Message[] = []) => {
                return old.map((msg) => {
                  const msgSenderId =
                    typeof msg.sender_id === "object"
                      ? msg.sender_id.id
                      : msg.sender_id;
                  if (Number(msgSenderId) === Number(event.sender_id)) {
                    return {
                      ...msg,
                      is_read: true,
                      read_at: event.read_at || new Date().toISOString(),
                    };
                  }
                  return msg;
                });
              }
            );

            console.log(
              `✅ تم تحديث جميع رسائل المرسل ${event.sender_id} إلى مقروءة`
            );
          }
        });

        channel.subscribed(() => {
          console.log("✅ تم الاشتراك في قناة الشات:", channelName);
        });

        channelRef.current = channel;
        echoRef.current = echo;
        currentChannelRef.current = channelName;

        return channel;
      } catch (error) {
        console.error("❌ خطأ في إعداد قناة الشات:", error);
        return null;
      }
    },
    [chatRequestId, patientId, consultantId, queryClient]
  );

  useEffect(() => {
    if (
      !session?.accessToken ||
      !session?.user?.id ||
      !chatRequestId ||
      !patientId ||
      !consultantId
    ) {
      // إذا كانت المعلمات ناقصة، نظف القناة الحالية
      if (channelRef.current && echoRef.current) {
        try {
          channelRef.current.stopListening?.("MessageSent");
          channelRef.current.stopListening?.("MessageRead");
          echoRef.current.leave(channelRef.current.name);
          channelRef.current = null;
          currentChannelRef.current = "";
        } catch (error) {
          console.error("❌ خطأ في تنظيف الشات:", error);
        }
      }
      return;
    }

    const echo = createEcho(session.accessToken);
    const channel = listenForMessages(echo, session.user.id);

    return () => {
      // تنظيف انتقائي - فقط إذا تغيرت المعلمات المهمة
      if (channel && (!chatRequestId || !patientId || !consultantId)) {
        try {
          channel.stopListening("MessageSent");
          channel.stopListening("MessageRead");
          echo.leave(channel.name);
          channelRef.current = null;
          currentChannelRef.current = "";
        } catch (error) {
          console.error("❌ خطأ في تنظيف الشات:", error);
        }
      }
    };
  }, [session, chatRequestId, patientId, consultantId, listenForMessages]);
};
