// "use client";
// import { useEffect, useRef, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { getChatEcho } from "@/lib/echo";
// import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import type { Message, PusherMessageEvent } from "@/types/chat";
// import { logger } from "@/lib/logger";


// export const useChatPusher = (
//   chatRequestId?: number,
//   patientId?: number,
//   consultantId?: number
// ) => {
//   const { data: session } = useSession();
//   const queryClient = useQueryClient();

//   const echoRef = useRef<ReturnType<typeof getChatEcho> | null>(null);
//   const channelRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
//   const processedMessagesRef = useRef<Set<number>>(new Set());
//   const isConnectedRef = useRef<boolean>(false);
//   const isInitializingRef = useRef<boolean>(false);

//   // 🔥 دالة محسنة لتحديث الـ Cache
//   const updateMessagesCache = useCallback(
//     (newMessage: Message) => {
//       if (!chatRequestId) return;

//       logger.info("🎯 تحديث الـ cache برسالة جديدة:", {
//         id: newMessage.id,
//         chatRequestId,
//         message: newMessage.message.substring(0, 30),
//       });

//       // 🔥 تحديث الـ cache بشكل صحيح
//       queryClient.setQueryData<Message[]>(
//         ["messages", chatRequestId],
//         (oldMessages = []) => {
//           // 🔥 تحقق من وجود الرسالة مسبقاً
//           const messageExists = oldMessages.some(msg => 
//             msg.id === newMessage.id
//           );
          
//           if (messageExists) {
//             logger.debug("⏭️ الرسالة موجودة مسبقاً في ال cache");
//             return oldMessages;
//           }

//           logger.info("✅ تم إضافة الرسالة إلى ال cache", {
//             totalMessages: oldMessages.length + 1
//           });

//           // 🔥 إرجاع مصفوفة جديدة مع الرسالة الجديدة
//           return [...oldMessages, newMessage];
//         }
//       );

//       // 🔥 إخبار React Query أن البيانات تحديثت
//       queryClient.invalidateQueries({
//         queryKey: ["messages", chatRequestId],
//         exact: true,
//       }, { throwOnError: false });
//     },
//     [chatRequestId, queryClient]
//   );

//   useEffect(() => {
//     // 🔥 منع التهيئة المتعددة
//     if (isInitializingRef.current) {
//       return;
//     }

//     // التحقق من المتطلبات الأساسية
//     if (
//       !session?.accessToken ||
//       !session?.user?.id ||
//       !chatRequestId ||
//       !patientId ||
//       !consultantId
//     ) {
//       logger.debug("⏭️ تخطي - بيانات غير مكتملة");
//       return;
//     }

//     isInitializingRef.current = true;

//     const chatKey =
//       consultantId < patientId
//         ? `${consultantId}.${patientId}`
//         : `${patientId}.${consultantId}`;

//     const channelName = `chat.between.${chatKey}`;
//     const userId = session.user.id;

//     logger.info("🚀 بدء إعداد Pusher للمحادثة:", {
//       channelName,
//       chatRequestId,
//       userId,
//     });

//     // إذا كنا متصلين بالفعل
//     if (isConnectedRef.current && channelRef.current) {
//       logger.info("✅ مشترك بالفعل في القناة");
//       isInitializingRef.current = false;
//       return;
//     }

//     const initializePusher = async () => {
//       try {
//         // 🔥 استخدام instance منفصل للشات
//         if (!session.accessToken) {
//           logger.error("❌ لم يتم العثور على التوكن");
//           isInitializingRef.current = false;
//           return;
//         }
//         const echo = getChatEcho(session.accessToken);
//         if (!echo) {
//           logger.error("❌ فشل في إنشاء اتصال Echo");
//           isInitializingRef.current = false;
//           return;
//         }

//         echoRef.current = echo;

//         const channel = echo.private(channelName);

//         // 🔥 معالج الرسائل الجديدة
//         const handleNewMessage = (event: PusherMessageEvent) => {
//           const receivedMessage = event.message;

//           if (!receivedMessage) {
//             logger.warn("📨 رسالة بدون بيانات");
//             return;
//           }

//           logger.info("📨 استلم رسالة جديدة:", {
//             id: receivedMessage.id,
//             isForMe: Number(receivedMessage.receiver_id) === Number(userId),
//           });

//           // منع معالجة الرسائل المكررة
//           if (processedMessagesRef.current.has(receivedMessage.id)) {
//             return;
//           }

//           processedMessagesRef.current.add(receivedMessage.id);

//           const newMessage: Message = {
//             ...receivedMessage,
//             is_read: receivedMessage.is_read === 1,
//           };

//           updateMessagesCache(newMessage);

//           // إشعار للمستقبل فقط
//           if (Number(receivedMessage.receiver_id) === Number(userId)) {
//             toast.info("📩 رسالة جديدة", {
//               duration: 4000,
//               position: "top-center",
//             });
//           }
//         };

//         // معالج حدث تحديث حالة القراءة
//         const handleMessageRead = (event: { sender_id?: number; read_at?: string }) => {
//           logger.info("📖 حدث تحديث حالة القراءة:", event);

//           if (event.sender_id && chatRequestId) {
//             queryClient.setQueryData(
//               ["messages", chatRequestId],
//               (old: Message[] = []) =>
//                 old.map((msg) => {
//                   const msgSenderId =
//                     typeof msg.sender_id === "object"
//                       ? msg.sender_id.id
//                       : msg.sender_id;

//                   if (Number(msgSenderId) === Number(event.sender_id)) {
//                     return {
//                       ...msg,
//                       is_read: true,
//                       read_at: event.read_at || new Date().toISOString(),
//                     };
//                   }
//                   return msg;
//                 })
//             );
//           }
//         };

//         // الإشتراك في الأحداث
//         channel.listen("MessageSent", handleNewMessage);
//         channel.listen("MessageRead", handleMessageRead);

//         // أحداث الاتصال
//         channel.subscribed(() => {
//           logger.info("🎉 ✅ تم الإشتراك بنجاح في قناة Pusher");
//           isConnectedRef.current = true;
//           isInitializingRef.current = false;
//         });

//         channel.error((error: Error) => {
//           logger.error("❌ خطأ في قناة Pusher:", error);
//           isConnectedRef.current = false;
//           isInitializingRef.current = false;
//         });

//         channelRef.current = channel;

//       } catch (error) {
//         logger.error("❌ فشل في الإشتراك في قناة Pusher:", error);
//         isConnectedRef.current = false;
//         isInitializingRef.current = false;
//       }
//     };

//     initializePusher();

//     return () => {
//       // 🔥 تنظيف عند unmount فقط، ليس عند إعادة التصيير
//       logger.info("🧹 تنظيف useChatPusher");
//       isInitializingRef.current = false;
//     };
//   }, [
//     session?.accessToken,
//     session?.user?.id,
//     chatRequestId,
//     patientId,
//     consultantId,
//     updateMessagesCache,
//     queryClient
//   ]);

//   return null;
// };



"use client";
import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getChatEcho } from "@/lib/echo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Message, PusherMessageEvent } from "@/types/chat";
import { logger } from "@/lib/logger";

interface InfiniteData<T> {
  pages: T[];
  pageParams: (string | null)[];
}

interface PaginatedMessages {
  data: Message[];
  next_cursor: string | null;
}
export const useChatPusher = (
  chatRequestId?: number,
  patientId?: number,
  consultantId?: number
) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const echoRef = useRef<ReturnType<typeof getChatEcho> | null>(null);
  const channelRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const processedMessagesRef = useRef<Set<number>>(new Set());
  const isConnectedRef = useRef<boolean>(false);
  const isInitializingRef = useRef<boolean>(false);

// 🔥 هذا هو الحل الموصى به - أبسط وأقل عرضة للأخطاء
const updateMessagesCache = useCallback(
  (newMessage: Message) => {
    if (!chatRequestId) return;

    logger.info("🎯 استلام رسالة جديدة، إعادة جلب الرسائل:", {
      id: newMessage.id,
      chatRequestId,
    });

    // 🔥 ببساطة إعادة جلب البيانات من الخادم
    queryClient.invalidateQueries({
      queryKey: ["messages", chatRequestId],
    });

    // إشعار فقط إذا كانت الرسالة موجهة للمستخدم الحالي
    const receiverId = typeof newMessage.receiver_id === 'object' 
      ? newMessage.receiver_id.id 
      : newMessage.receiver_id;
    
    if (Number(receiverId) === Number(session?.user?.id)) {
      toast.info("📩 رسالة جديدة", {
        duration: 3000,
        position: "top-center",
      });
    }
  },
  [chatRequestId, queryClient, session?.user?.id]
);

  useEffect(() => {
    // 🔥 منع التهيئة المتعددة
    if (isInitializingRef.current) {
      return;
    }

    // التحقق من المتطلبات الأساسية
    if (
      !session?.accessToken ||
      !session?.user?.id ||
      !chatRequestId ||
      !patientId ||
      !consultantId
    ) {
      logger.debug("⏭️ تخطي - بيانات غير مكتملة");
      return;
    }

    isInitializingRef.current = true;

    const chatKey =
      consultantId < patientId
        ? `${consultantId}.${patientId}`
        : `${patientId}.${consultantId}`;

    const channelName = `chat.between.${chatKey}`;
    const userId = session.user.id;

    logger.info("🚀 بدء إعداد Pusher للمحادثة:", {
      channelName,
      chatRequestId,
      userId,
    });

    // إذا كنا متصلين بالفعل
    if (isConnectedRef.current && channelRef.current) {
      logger.info("✅ مشترك بالفعل في القناة");
      isInitializingRef.current = false;
      return;
    }

    const initializePusher = async () => {
      try {
        // 🔥 استخدام instance منفصل للشات
        if (!session.accessToken) {
          logger.error("❌ لم يتم العثور على التوكن");
          isInitializingRef.current = false;
          return;
        }
        const echo = getChatEcho(session.accessToken);
        if (!echo) {
          logger.error("❌ فشل في إنشاء اتصال Echo");
          isInitializingRef.current = false;
          return;
        }

        echoRef.current = echo;

        const channel = echo.private(channelName);

        // 🔥 معالج الرسائل الجديدة
        const handleNewMessage = (event: PusherMessageEvent) => {
          const receivedMessage = event.message;

          if (!receivedMessage) {
            logger.warn("📨 رسالة بدون بيانات");
            return;
          }

          logger.info("📨 استلم رسالة جديدة:", {
            id: receivedMessage.id,
            isForMe: Number(receivedMessage.receiver_id) === Number(userId),
          });

          // منع معالجة الرسائل المكررة
          if (processedMessagesRef.current.has(receivedMessage.id)) {
            return;
          }

          processedMessagesRef.current.add(receivedMessage.id);

          const newMessage: Message = {
            ...receivedMessage,
            is_read: receivedMessage.is_read === 1,
          };

          updateMessagesCache(newMessage);

          // إشعار للمستقبل فقط
          if (Number(receivedMessage.receiver_id) === Number(userId)) {
            toast.info("📩 رسالة جديدة", {
              duration: 4000,
              position: "top-center",
            });
          }
        };

        // معالج حدث تحديث حالة القراءة
        const handleMessageRead = (event: { sender_id?: number; read_at?: string }) => {
          logger.info("📖 حدث تحديث حالة القراءة:", event);

          if (event.sender_id && chatRequestId) {
            queryClient.setQueryData(
              ["messages", chatRequestId],
              (old: Message[] = []) =>
                old.map((msg) => {
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
                })
            );
          }
        };

        // الإشتراك في الأحداث
        channel.listen("MessageSent", handleNewMessage);
        channel.listen("MessageRead", handleMessageRead);

        // أحداث الاتصال
        channel.subscribed(() => {
          logger.info("🎉 ✅ تم الإشتراك بنجاح في قناة Pusher");
          isConnectedRef.current = true;
          isInitializingRef.current = false;
        });

        channel.error((error: Error) => {
          logger.error("❌ خطأ في قناة Pusher:", error);
          isConnectedRef.current = false;
          isInitializingRef.current = false;
        });

        channelRef.current = channel;

      } catch (error) {
        logger.error("❌ فشل في الإشتراك في قناة Pusher:", error);
        isConnectedRef.current = false;
        isInitializingRef.current = false;
      }
    };

    initializePusher();

    return () => {
      // 🔥 تنظيف عند unmount فقط، ليس عند إعادة التصيير
      logger.info("🧹 تنظيف useChatPusher");
      isInitializingRef.current = false;
    };
  }, [
    session?.accessToken,
    session?.user?.id,
    chatRequestId,
    patientId,
    consultantId,
    updateMessagesCache,
    queryClient
  ]);

  return null;
};