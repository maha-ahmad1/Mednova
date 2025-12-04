"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getEcho } from "@/lib/echo";
import { useConsultationStore } from "@/store/consultationStore";
import { toast } from "sonner";
import type {
  ConsultationRequest,
  ConsultationType,
} from "@/types/consultation";

interface ConsultationRequestEvent {
  id: number;
  patient_id: number;
  patient_name: string;
  consultant_id: number;
  consultant_name: string;
  consultant_type: string;
  message: string;
  consultation_type: "chat" | "video";
  status: "accepted" | "cancelled" | "active" | "completed";
}

export const useEchoNotifications = (): void => {
  const { data: session } = useSession();
  const addRequest = useConsultationStore((state) => state.addRequest);
  const updateRequest = useConsultationStore((state) => state.updateRequest);

  // 🔥 تعريف refs بشكل صحيح
  const echoRef = useRef<ReturnType<typeof getEcho> | null>(null);
  const subscribedRef = useRef<boolean>(false);
  const channelNameRef = useRef<string>("");

  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) {
      console.log("❌ لا يوجد توكن أو معرف مستخدم");
      return;
    }

    const userId = session.user.id;
    const role = session.role === "patient" ? "patient" : "consultable";
    const currentChannelName =
      role === "consultable" ? `consultant.${userId}` : `patient.${userId}`;

    // إذا كان مشترك بالفعل في نفس القناة
    if (
      subscribedRef.current &&
      echoRef.current &&
      channelNameRef.current === currentChannelName
    ) {
      console.log("✅ بالفعل مشترك في القناة:", currentChannelName);
      return;
    }

    console.log("🚀 بدء إعداد Echo للإشعارات...");

    // 🔥 استخدم getEcho وليس createEcho
    const echo = getEcho(session.accessToken);
    echoRef.current = echo;
    channelNameRef.current = currentChannelName;

    console.log(` الاستماع على القناة: ${currentChannelName}`);

    try {
      const channel = echo.private(currentChannelName);

      channel.listen(
        "ConsultationRequestedBroadcast",
        (event: ConsultationRequestEvent) => {
          console.log("📨 تم استقبال طلب جديد:", event);

          toast.success(event.message, {
            duration: 5000,
            position: "top-center",
            richColors: true,
          });

          const consultationRequest: ConsultationRequest = {
            id: event.id,
            type: event.consultation_type,
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
              status: "pending",
              max_messages_for_patient: null,
              patient_message_count: 0,
              consultant_message_count: 0,
              first_patient_message_at: null,
              first_consultant_reply_at: null,
              started_at: null,
              ended_at: null,
            },
          };

          addRequest(consultationRequest);
        }
      );
      // 🔄 الاستماع لتحديثات حالة الاستشارة
      channel.listen(
        "ConsultationUpdatedBroadcast",
        (event: {
          id: number;
          status: "accepted" | "cancelled" | "active" | "completed";
        }) => {
          console.log("🔄 تحديث حالة الاستشارة:", event);

          updateRequest(event.id, { status: event.status });

          toast.info(`Status updated to: ${event.status}`);
        }
      );

      channel.subscribed(() => {
        console.log("✅ تم الاشتراك بنجاح في القناة:", currentChannelName);
        subscribedRef.current = true;
      });

      channel.error((error: unknown) => {
        console.error("❌ خطأ في القناة:", error);
        subscribedRef.current = false;
      });
    } catch (error) {
      console.error("❌ خطأ في إعداد Echo:", error);
      subscribedRef.current = false;
    }

    return () => {
      if (echoRef.current && channelNameRef.current) {
        echoRef.current.leave(channelNameRef.current);
        subscribedRef.current = false;
      }
    };
  }, [session, addRequest,updateRequest]);
};



// "use client";
// import { useEffect, useRef } from "react";
// import { useSession } from "next-auth/react";
// import { getEcho } from "@/lib/echo";
// import { useConsultationStore } from "@/store/consultationStore";
// import { toast } from "sonner";
// import type {
//   ConsultationRequest,
//   ConsultationType,
// } from "@/types/consultation";
// import { AxiosError } from "axios";
// interface ConsultationRequestEvent {
//   id: number;
//   patient_id: number;
//   patient_name: string;
//   consultant_id: number;
//   consultant_name: string;
//   consultant_type: string;
//   message: string;
//   consultation_type: "chat" | "video";
//   status: "accepted" | "cancelled" | "active" | "completed";
// }

// interface ConsultationUpdatedEvent {
//   id: number;
//   patient_id: number;
//   consultant_id: number;
//   status: "accepted" | "cancelled" | "active" | "completed";
//   message?: string;
//   updated_at: string;
// }

// export const useEchoNotifications = (): void => {
//   const { data: session } = useSession();
//   const { addRequest, updateRequest, getRequest } = useConsultationStore();


//   // 🔥 تعريف refs بشكل صحيح
//   const echoRef = useRef<ReturnType<typeof getEcho> | null>(null);
//   const subscribedRef = useRef<boolean>(false);
//   const channelNameRef = useRef<string>("");

//   useEffect(() => {
//     if (!session?.accessToken || !session?.user?.id) {
//       console.log("❌ لا يوجد توكن أو معرف مستخدم");
//       return;
//     }

//     const userId = session.user.id;
//     const role = session.role === "patient" ? "patient" : "consultable";
//     const currentChannelName =
//       role === "consultable" ? `consultant.${userId}` : `patient.${userId}`;

//     // إذا كان مشترك بالفعل في نفس القناة
//     if (
//       subscribedRef.current &&
//       echoRef.current &&
//       channelNameRef.current === currentChannelName
//     ) {
//       console.log("✅ بالفعل مشترك في القناة:", currentChannelName);
//       return;
//     }

//     console.log("🚀 بدء إعداد Echo للإشعارات...");

//     // 🔥 استخدم getEcho وليس createEcho
//     const echo = getEcho(session.accessToken);
//     echoRef.current = echo;
//     channelNameRef.current = currentChannelName;

//     console.log(` الاستماع على القناة: ${currentChannelName}`);

//     try {
//       const channel = echo.private(currentChannelName);

//       channel.listen(
//         "ConsultationRequestedBroadcast",
//         (event: ConsultationRequestEvent) => {
//           console.log("📨 تم استقبال طلب جديد:", event);

//           toast.success(event.message, {
//             duration: 5000,
//             position: "top-center",
//             richColors: true,
//           });

//           const consultationRequest: ConsultationRequest = {
//             id: event.id,
//             type: event.consultation_type,
//             status: "pending",
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//             data: {
//               id: event.id,
//               patient: {
//                 id: event.patient_id,
//                 full_name: event.patient_name,
//                 email: "",
//                 phone: "",
//                 type_account: "patient",
//                 average_rating: null,
//                 total_reviews: null,
//                 status: "active",
//               },
//               consultant: {
//                 id: event.consultant_id,
//                 full_name: event.consultant_name,
//                 email: "",
//                 phone: "",
//                 type_account: event.consultant_type as
//                   | "therapist"
//                   | "rehabilitation_center",
//                 average_rating: null,
//                 total_reviews: null,
//                 status: "active",
//               },
//               consultant_type: event.consultant_type as "therapist" | "center",
//               status: "pending",
//               max_messages_for_patient: null,
//               patient_message_count: 0,
//               consultant_message_count: 0,
//               first_patient_message_at: null,
//               first_consultant_reply_at: null,
//               started_at: null,
//               ended_at: null,
//             },
//           };

//           addRequest(consultationRequest);
//         }
//       );


//         channel.listen(
//         "ConsultationUpdatedBroadcast",
//         (event: ConsultationUpdatedEvent) => {
//           console.log("🔄 تحديث حالة الاستشارة:", event);

//           // تحديث الطلب في الـ store
//           updateRequest(event.id, { 
//             status: event.status,
//             updated_at: event.updated_at
//           });

//           // عرض إشعار للمستخدم
//           const statusMessages = {
//             accepted: "تم قبول طلب الاستشارة",
//             cancelled: "تم إلغاء طلب الاستشارة",
//             active: "تم تفعيل الاستشارة",
//             completed: "تم إكمال الاستشارة"
//           };

//           toast.info(event.message || statusMessages[event.status] || `تم تحديث الحالة إلى: ${event.status}`, {
//             duration: 4000,
//           });

//           // تحديث الـ UI فوراً
//           const updatedRequest = getRequest(event.id);
//           if (updatedRequest) {
//             console.log("✅ تم تحديث الطلب في الـ store:", updatedRequest);
//           }
//         }
//       );

//       // استقبال أي أخطاء
//       channel.listen(".Illuminate\\Broadcasting\\BroadcastException", (error:  AxiosError) => {
//         console.error("❌ خطأ في البث:", error);
//         toast.error("حدث خطأ في الاتصال، يرجى تحديث الصفحة");
//       });

//       channel.subscribed(() => {
//         console.log("✅ تم الاشتراك بنجاح في القناة:", currentChannelName);
//         subscribedRef.current = true;
//       });

//       channel.error((error: unknown) => {
//         console.error("❌ خطأ في القناة:", error);
//         subscribedRef.current = false;
//         toast.error("فقد الاتصال بالخادم، جاري إعادة المحاولة...");
//       });
//     } catch (error) {
//       console.error("❌ خطأ في إعداد Echo:", error);
//       subscribedRef.current = false;
//     }

//     return () => {
//       if (echoRef.current && channelNameRef.current) {
//         console.log("🧹 تنظيف الاشتراك في القناة:", channelNameRef.current);
//         echoRef.current.leave(channelNameRef.current);
//         subscribedRef.current = false;
//       }
//     };
//   }, [session, addRequest, updateRequest, getRequest]);
// };
