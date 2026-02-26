"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getEcho } from "@/lib/echo";
import { useConsultationStore } from "@/store/consultationStore";
import { toast } from "sonner";
import type { ConsultationRequest } from "@/types/consultation";
import { useNotificationStore, Notification } from "@/store/notificationStore";
import { useRouter, usePathname } from "next/navigation";

interface ConsultationEvent {
  id: number;
  patient_id: number;
  patient_name: string;
  consultant_id: number;
  consultant_name: string;
  consultant_type: string;
  message: string;
  consultation_type: "chat" | "video";
  status: "pending" | "accepted" | "cancelled" | "active" | "completed";
  video_room_link?: string;
  created_at?: string;
  updated_at?: string;
}

// رسالة داخل الاستشارة
type ConsultationMessageEvent = {
  consultation_id: number;
  message?: string;
  sender_id?: number;
  created_at?: string;
  [key: string]: unknown;
};

// إشعار نظامي عام
type SystemNotificationEvent = {
  title?: string;
  message: string;
  level?: string;
  [key: string]: unknown;
};

export const useEchoNotifications = (): void => {
  const { data: session, update } = useSession();
  const router = useRouter(); // إضافة
  const pathname = usePathname(); // إضافة
  const pathnameRef = useRef(pathname);
  const addRequest = useConsultationStore((state) => state.addRequest);
  const updateRequest = useConsultationStore((state) => state.updateRequest);
  const requests = useConsultationStore((state) => state.requests);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const requestsRef = useRef(requests);
  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  // 🔥 REFs لمنع التكرار
  const echoRef = useRef<ReturnType<typeof getEcho> | null>(null);
  const subscribedRef = useRef(false);
  const channelNameRef = useRef<string>("");
  const processedEventsRef = useRef<Set<string>>(new Set());

  // 🔥 دالة لإنشاء إشعار موحد
  const createNotification = useCallback(
    (
      event: ConsultationEvent,
      notificationType: Notification["type"],
      title: string,
    ): Notification => {
      return {
        id: `consultation_${event.id}_${notificationType}_${Date.now()}`,
        type: notificationType,
        title,
        message: event.message,
        read: false,
        createdAt: new Date().toISOString(),
        source: "pusher",
        data: {
          consultation_id: event.id,
          patient_id: event.patient_id,
          patient_name: event.patient_name,
          consultant_id: event.consultant_id,
          consultant_name: event.consultant_name,
          consultant_type: event.consultant_type,
          consultation_type: event.consultation_type,
          status: event.status,
          video_room_link: event.video_room_link,
        },
      };
    },
    [],
  );

  // 🔥 دالة لإنشاء كائن استشارة موحد
  const createConsultationRequest = useCallback(
    (event: ConsultationEvent): ConsultationRequest => {
      return {
        id: event.id,
        type: event.consultation_type,
        status: event.status,
        created_at: event.created_at || new Date().toISOString(),
        updated_at: event.updated_at || new Date().toISOString(),
        video_room_link: event.video_room_link || undefined,
        data: {
          id: event.id,
          patient: {
            id: event.patient_id,
            full_name: event.patient_name,
            email: "",
            phone: "",
            type_account: "patient",
            average_rating: null,
            total_reviews: null,
            status: "active",
          },
          consultant: {
            id: event.consultant_id,
            full_name: event.consultant_name,
            email: "",
            phone: "",
            type_account: event.consultant_type as
              | "therapist"
              | "rehabilitation_center",
            average_rating: null,
            total_reviews: null,
            status: "active",
          },
          consultant_type: event.consultant_type as "therapist" | "center",
          status: event.status,
          max_messages_for_patient: null,
          patient_message_count: 0,
          consultant_message_count: 0,
          first_patient_message_at: null,
          first_consultant_reply_at: null,
          started_at: null,
          ended_at: null,
        },
      };
    },
    [],
  );

  // 🔥 دالة واحدة لمعالجة جميع أحداث الاستشارات
  const handleConsultationEvent = useCallback(
    (event: ConsultationEvent, eventType: "requested" | "updated") => {
      const eventKey = `${eventType}_${event.id}_${event.status}_${Date.now()}`;

      // 🔥 منع معالجة نفس الحدث
      if (processedEventsRef.current.has(eventKey)) {
        return;
      }
      processedEventsRef.current.add(eventKey);

      console.log(`📨 استقبال حدث ${eventType}:`, {
        id: event.id,
        status: event.status,
        type: event.consultation_type,
        eventType,
      });

      // 🔥 البحث عن الطلب الموجود
      const existingRequest = requestsRef.current.find(
        (r) => r.id === event.id,
      );

      // 🔥 تحديد نوع الحدث والإجراء المناسب
      if (eventType === "requested") {
        // 🔥 حدث طلب جديد
        if (existingRequest) {
          console.log("📝 تحديث طلب موجود:", event.id);
          updateRequest(event.id, {
            status: event.status,
            updated_at: event.updated_at || new Date().toISOString(),
            video_room_link:
              event.video_room_link || existingRequest.video_room_link,
          });
        } else {
          console.log("➕ إضافة طلب جديد:", event.id);
          addRequest(createConsultationRequest(event));
        }

        // 🔥 إضافة إشعار للطرفين
        const notification = createNotification(
          event,
          "consultation_requested",
          "طلب استشارة جديد",
        );
        addNotification(notification);

        // 🔥 عرض toast للمستخدم
        toast.info(event.message, {
          duration: 5000,
          position: "top-center",
        });
      } else if (eventType === "updated") {
        // 🔥 حدث تحديث استشارة
        if (!existingRequest) {
          console.log("⚠️ طلب غير موجود للتحديث، سيتم إضافه:", event.id);
          addRequest(createConsultationRequest(event));
        } else {
          console.log("🔄 تحديث طلب موجود:", event.id);
          updateRequest(event.id, {
            status: event.status,
            updated_at: event.updated_at || new Date().toISOString(),
            video_room_link:
              event.video_room_link || existingRequest.video_room_link,
            type: event.consultation_type || existingRequest.type,
          });
        }

        // 🔥 تحديد نوع الإشعار بناءً على الحالة
        let notificationType: Notification["type"] = "consultation_updated";
        let title = "تحديث حالة الاستشارة";

        switch (event.status) {
          case "accepted":
            notificationType = "consultation_accepted";
            title = "تم قبول طلب الاستشارة";
            break;
          case "active":
            notificationType = "consultation_active";
            title = "تم تفعيل الاستشارة";
            break;
          case "completed":
            notificationType = "consultation_completed";
            title = "تم إكمال الاستشارة";
            break;
          case "cancelled":
            notificationType = "consultation_cancelled";
            title = "تم إلغاء الاستشارة";
            break;
        }

        // 🔥 إضافة إشعار
        const notification = createNotification(event, notificationType, title);
        addNotification(notification);

        // 🔥 عرض toast للمستخدم
        toast.info(title, {
          duration: 5000,
          position: "top-center",
        });
      }

      // 🔥 تنظيف الأحداث القديمة بعد 10 ثواني
      setTimeout(() => {
        processedEventsRef.current.delete(eventKey);
      }, 10000);
    },
    [
      addRequest,
      updateRequest,
      createConsultationRequest,
      createNotification,
      addNotification,
    ],
  );

  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) {
      console.log("⏳ انتظار بيانات الجلسة...");
      return;
    }

    const userId = session.user.id;
    const role = session.user.type_account || session.role;

    // 🔥 تحديد القناة بناءً على نوع الحساب
    let channelName = "";
    if (role === "patient") {
      channelName = `patient.${userId}`;
    } else if (role === "therapist" || role === "rehabilitation_center") {
      channelName = `consultant.${userId}`;
    } else if (role === "admin") {
      return;
    } else {
      console.error("❌ نوع حساب غير معروف:", role);
      return;
    }

    console.log("🚀 إعداد Echo للإشعارات:", {
      userId,
      role,
      channelName,
    });

    // 🔥 تنظيف الاتصال السابق
    if (echoRef.current && channelNameRef.current) {
      echoRef.current.leave(channelNameRef.current);
      subscribedRef.current = false;
    }

    // 🔥 إنشاء اتصال Echo جديد
    const echo = getEcho(session.accessToken);
    echoRef.current = echo;
    channelNameRef.current = channelName;

    const channel = echo.private(channelName);
    const accountChannel = echo.private(`customer.${userId}`);
    // 🔥 الاستماع لجميع الأحداث في دالة واحدة
    channel.listen(
      "ConsultationRequestedBroadcast",
      (event: ConsultationEvent) => {
        handleConsultationEvent(event, "requested");
      },
    );

    channel.listen(
      "ConsultationUpdatedBroadcast",
      (event: ConsultationEvent) => {
        handleConsultationEvent(event, "updated");
      },
    );

    // 🔥 يمكن إضافة المزيد من الأحداث هنا
    channel.listen(
      "ConsultationMessageBroadcast",
      (event: ConsultationMessageEvent) => {
        console.log("💬 رسالة جديدة في الاستشارة:", event);
        const msg =
          typeof event.message === "string" && event.message.length > 0
            ? event.message
            : "لديك رسالة جديدة في الاستشارة";
        const notification: Notification = {
          id: `message_${event.consultation_id}_${Date.now()}`,
          type: "consultation_message",
          title: "رسالة جديدة",
          message: msg,
          read: false,
          createdAt: new Date().toISOString(),
          source: "pusher",
          data: event as Notification["data"],
        };
        addNotification(notification);
      },
    );

    accountChannel.listen(
      ".account.status.updated",
      async (event: { status: string; reason?: string; message?: string }) => {
        console.log("📢 حدث تحديث حالة الحساب:", event);
        console.log("🔥🔥🔥 حدث تحديث الحساب واصل:", event);
        // إنشاء إشعار
        const notification: Notification = {
          id: `account_${event.status}_${Date.now()}`,
          type:
            event.status === "approved"
              ? "account_approved"
              : "account_rejected",
          title: event.status === "approved" ? "تم قبول حسابك" : "تم رفض حسابك",
          message:
            event.message ||
            (event.status === "approved"
              ? "تهانينا! تم قبول حسابك"
              : "نأسف، لم يتم قبول حسابك"),
          read: false,
          createdAt: new Date().toISOString(),
          source: "pusher",
          data: event,
        };
        addNotification(notification);

        if (event.status === "approved") {
          toast.success(event.message || "تم قبول حسابك", {
            duration: 5000,
          });

          await update({
            approval_status: "approved",
            user: {
              ...session?.user,
              approval_status: "approved",
            },
          });

          router.replace("/profile");
          router.refresh();
        }

        if (event.status === "rejected") {
          toast.error(event.message || "تم رفض حسابك", {
            duration: 5000,
          });

          router.replace("/profile/rejected");
        }
      },
    );
    accountChannel.subscribed(() => {
      console.log(
        "✅ تم الاشتراك بنجاح في قناة accountChannel",
        `customer.${userId}`,
      );
    });

    accountChannel.error((error: unknown) => {
      console.error("❌ خطأ في accountChannel:", error);
    });
    channel.subscribed(() => {
      console.log("✅ تم الاشتراك بنجاح في القناة:", channelName);
      subscribedRef.current = true;
    });

    channel.error((error: unknown) => {
      console.error("❌ خطأ في قناة Pusher:", error);
      subscribedRef.current = false;
    });

    // 🔥 الاشتراك في قناة عامة للإشعارات النظامية
    const publicChannel = echo.channel("notifications");
    publicChannel.listen(
      "SystemNotification",
      (event: SystemNotificationEvent) => {
        console.log("🔔 إشعار نظامي:", event);
        const notification: Notification = {
          id: `system_${Date.now()}`,
          type: "system",
          title: event.title || "إشعار نظام",
          message: event.message,
          read: false,
          createdAt: new Date().toISOString(),
          source: "pusher",
          data: event as Notification["data"],
        };
        addNotification(notification);

        toast.info(event.message, {
          duration: 5000,
          position: "top-center",
        });
      },
    );

    // 🔥 التنظيف عند unmount
    return () => {
      console.log("🧹 تنظيف Echo (unmount)");
      if (echoRef.current && channelNameRef.current) {
        echoRef.current.leave(channelNameRef.current);
        echoRef.current.leave("notifications");
        echoRef.current.leave(`customer.${userId}`);
        subscribedRef.current = false;
        processedEventsRef.current.clear();
      }
    };
  }, [session, handleConsultationEvent, addNotification, router, update]);
};
