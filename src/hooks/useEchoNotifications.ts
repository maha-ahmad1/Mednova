// hooks/useEchoNotifications.ts
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { createEcho } from "@/lib/echo";
import { useConsultationStore } from "@/store/consultationStore";
import { toast } from "sonner";
import type { ConsultationRequest } from "@/types/consultation";

// نوع البيانات القادمة من الـ Event
interface ConsultationRequestEvent {
  id: number;
  patient_id: number;
  patient_name: string;
  consultant_id: number;
  consultant_name: string;
  consultant_type: string;
  message: string;
}

export const useEchoNotifications = (): void => {
  const { data: session } = useSession();
  const addRequest = useConsultationStore((state) => state.addRequest);

  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) {
      console.log("❌ لا يوجد توكن أو معرف مستخدم");
      return;
    }

    console.log("🚀 بدء إعداد Echo للإشعارات...", {
      userId: session.user.id,
      role: session.role
    });

    const echo = createEcho(session.accessToken);
    const userId = session.user.id;
    const role = session.role === "patient" ? "patient" : "consultable";
     const channelName = role === "consultable" ? `consultant.${userId}` : `patient.${userId}`;
// const channelName = role === "consultable" ? consultant.${userId} : patient.${userId};
    console.log(`🎯 الاستماع على القناة: ${channelName}`);

    try {
      const channel = echo.channel(channelName); // 🔥 بدلاً من echo.private()

      // const channel = echo.private(channelName);
      // الاستماع لطلب استشارة جديد
      channel.listen("ConsultationRequestedBroadcast", (event: ConsultationRequestEvent) => {
        console.log("📨 تم استقبال طلب استشارة جديد:", event);
        
        // عرض الإشعار
        toast.success(`قام ${event.patient_name} بطلب استشارة جديدة`);
        
        // تحويل البيانات من الـ Event إلى ConsultationRequest
        const consultationRequest: ConsultationRequest = {
          id: event.id,
          type: "chat", // يمكنك تعديل هذا بناءً على البيانات الفعلية
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
              status: "active"
            },
            consultant: {
              id: event.consultant_id,
              full_name: event.consultant_name,
              email: "",
              phone: "",
              type_account: event.consultant_type as "therapist" | "rehabilitation_center",
              average_rating: null,
              total_reviews: null,
              status: "active"
            },
            consultant_type: event.consultant_type as "therapist" | "center",
            status: "pending",
            max_messages_for_patient: null,
            patient_message_count: 0,
            consultant_message_count: 0,
            first_patient_message_at: null,
            first_consultant_reply_at: null,
            started_at: null,
            ended_at: null
          }
        };
        
        // إضافة الطلب إلى الـ store
        addRequest(consultationRequest);
        console.log("✅ تم إضافة الطلب إلى الـ store:", consultationRequest);
      });

      // إضافة معالج للاشتراك الناجح
      channel.subscribed(() => {
        console.log("✅ تم الاشتراك بنجاح في القناة:", channelName);
      });

      // إضافة معالج للأخطاء
      channel.error((error: unknown) => {
        console.error("❌ خطأ في القناة:", error);
      });

    } catch (error) {
      console.error("❌ خطأ في إعداد Echo:", error);
    }

    // تنظيف الاشتراك عند فك التركيب
    return () => {
      console.log("🧹 تنظيف الاشتراكات...");
      try {
        echo.leave(channelName);
      } catch (error) {
        console.error("❌ خطأ في التنظيف:", error);
      }
    };
  }, [session, addRequest]);
};