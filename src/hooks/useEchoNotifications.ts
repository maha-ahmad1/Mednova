// hooks/useEchoNotifications.ts
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { createEcho } from "@/lib/echo";
import { useConsultationStore } from "@/store/consultationStore";
import { toast } from "sonner";

export const useEchoNotifications = () => {
  const { data: session } = useSession();
  const addRequest = useConsultationStore((state) => state.addRequest);

  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) return;

    const echo = createEcho(session.accessToken);

    const userId = session.user.id;
    const role = session.role === "patient" ? "patient" : "consultable";
    const channelName = role === "consultable" ? `consultant.${userId}` : `patient.${userId}`;

    console.log(`🎯 الاستماع على القناة: ${channelName}`);

    const channel = echo.private(channelName);

    // الاستماع لطلب استشارة جديد
    channel.listen("ConsultationRequestedBroadcast", (event: any) => {
      console.log("📨 تم استقبال طلب استشارة جديد:", event);
      
      // عرض الإشعار
      toast.success(`قام ${event.patient_name} بطلب استشارة جديدة`);
      
      // إضافة الطلب إلى الـ store
      addRequest(event);
    });

    // تنظيف الاشتراك عند فك التركيب
    return () => {
      channel.stopListening("ConsultationRequestedBroadcast");
      echo.leave(channelName);
    };
  }, [session, addRequest]);
};