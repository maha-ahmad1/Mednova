"use client";
import { useEffect, useRef } from "react";
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
  message: string; // هذه الرسالة الجاهزة من الخادم
}

export const useEchoNotifications = (): void => {
  const { data: session } = useSession();
  const addRequest = useConsultationStore((state) => state.addRequest);
  
  // استخدام useRef لمنع إعادة الإنشاء
  const echoRef = useRef<ReturnType<typeof createEcho> | null>(null);
  const subscribedRef = useRef<boolean>(false);
  const channelNameRef = useRef<string>("");

  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) {
      console.log("❌ لا يوجد توكن أو معرف مستخدم");
      return;
    }

    const userId = session.user.id;
    const role = session.role === "patient" ? "patient" : "consultable";
    const currentChannelName = role === "consultable" ? `consultant.${userId}` : `patient.${userId}`;

    // إذا كان مشترك بالفعل في نفس القناة، لا تعيد الإنشاء
    if (subscribedRef.current && echoRef.current && channelNameRef.current === currentChannelName) {
      console.log("✅ بالفعل مشترك في القناة:", currentChannelName);
      return;
    }

    console.log("🚀 بدء إعداد Echo للإشعارات...", {
      userId: session.user.id,
      role: session.role
    });

    const echo = createEcho(session.accessToken);
    echoRef.current = echo;
    channelNameRef.current = currentChannelName;

    console.log(`🎯 الاستماع على القناة: ${currentChannelName}`);

    try {
      const channel = echo.private(currentChannelName);

      // الاستماع لطلب استشارة جديد
      channel.listen("ConsultationRequestedBroadcast", (event: ConsultationRequestEvent) => {
        console.log("📨 تم استقبال طلب استشارة جديد:", event);
        
        // عرض الرسالة مباشرة من الـ event في التوست
        toast.success(event.message, {
          duration: 5000, // مدة أطول للرسالة
          position: "top-center",
          richColors: true,
        });
        
        // تحويل البيانات من الـ Event إلى ConsultationRequest
        const consultationRequest: ConsultationRequest = {
          id: event.id,
          type: "chat",
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
        console.log("✅ تم الاشتراك بنجاح في القناة:", currentChannelName);
        subscribedRef.current = true;
      });

      // إضافة معالج للأخطاء
      channel.error((error: unknown) => {
        console.error("❌ خطأ في القناة:", error);
        subscribedRef.current = false;
      });

    } catch (error) {
      console.error("❌ خطأ في إعداد Echo:", error);
      subscribedRef.current = false;
    }

    // تنظيف أكثر حذراً
    return () => {
      // لا تنظف إلا إذا كان هناك تغيير حقيقي في الجلسة أو تم فك التركيب
      if (!session?.accessToken || !session?.user?.id) {
        console.log("🧹 تنظيف الاشتراكات بسبب فقدان الجلسة...");
        try {
          if (echoRef.current) {
            echoRef.current.leave(channelNameRef.current);
            subscribedRef.current = false;
          }
        } catch (error) {
          console.error("❌ خطأ في التنظيف:", error);
        }
      }
    };
  }, [session, addRequest]);
};