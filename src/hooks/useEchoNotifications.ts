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

// export const useEchoNotifications = (): void => {
//   const { data: session } = useSession();
//   const addRequest = useConsultationStore((state) => state.addRequest);
//   const updateRequest = useConsultationStore((state) => state.updateRequest);

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
//       // 🔄 الاستماع لتحديثات حالة الاستشارة
//       channel.listen(
//         "ConsultationUpdatedBroadcast",
//         (event: {
//           id: number;
//           status: "accepted" | "cancelled" | "active" | "completed";
//         }) => {
//           console.log("🔄 تحديث حالة الاستشارة:", event);

//           updateRequest(event.id, { status: event.status });

//           toast.info(`Status updated to: ${event.status}`);
//         }
//       );

//       channel.subscribed(() => {
//         console.log("✅ تم الاشتراك بنجاح في القناة:", currentChannelName);
//         subscribedRef.current = true;
//       });

//       channel.error((error: unknown) => {
//         console.error("❌ خطأ في القناة:", error);
//         subscribedRef.current = false;
//       });
//     } catch (error) {
//       console.error("❌ خطأ في إعداد Echo:", error);
//       subscribedRef.current = false;
//     }

//     return () => {
//       if (echoRef.current && channelNameRef.current) {
//         echoRef.current.leave(channelNameRef.current);
//         subscribedRef.current = false;
//       }
//     };
//   }, [session, addRequest,updateRequest]);
// };






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
// import { useNotificationStore } from "@/store/notificationStore";
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
//   video_room_link?: string;
//   type?: "video" | "chat";
//   consultant_type?: string;
// }

// export const useEchoNotifications = (): void => {
//   const { data: session } = useSession();
//   const addRequest = useConsultationStore((state) => state.addRequest);
//   const updateRequest = useConsultationStore((state) => state.updateRequest);
//   const { requests } = useConsultationStore();
//   const addNotification = useNotificationStore(
//     (state) => state.addNotification
//   );

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

//           // toast.success(event.message, {
//           //   duration: 5000,
//           //   position: "top-center",
//           //   richColors: true,
//           // });
//           addNotification({
//             type: "consultation_requested",
//             title: "طلب استشارة جديد",
//             message: event.message,
//             data: {
//               consultation_id: event.id,
//               patient_id: event.patient_id,
//               patient_name: event.patient_name,
//               consultant_id: event.consultant_id,
//               consultant_name: event.consultant_name,
//               consultant_type: event.consultant_type,
//               consultation_type: event.consultation_type,
//               status: event.status,
//             },
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
//               video_room_link: undefined,
              
//             },
//           };

//           addRequest(consultationRequest);
          
//         }
//       );
//       // 🔄 الاستماع لتحديثات حالة الاستشارة
//       channel.listen(
//         "ConsultationUpdatedBroadcast",
//         (event: ConsultationUpdatedEvent) => {
//           console.log("🔄 تحديث حالة الاستشارة:", event);

//           const currentRequest = requests.find((r) => r.id === event.id);
//           const updateData: Partial<ConsultationRequest> = {
//             status: event.status,
//             updated_at: event.updated_at || new Date().toISOString(),
//             type: event.type || currentRequest?.type,
//           };

//           toast.info(`Status updated to: ${event.status}`);

//           updateData.data = {
//             ...currentRequest?.data,
//             status: event.status,
//             video_room_link:
//               event.video_room_link || currentRequest?.data.video_room_link,
//           };
//           // إذا كان الطلب موجوداً، نحافظ على البيانات الأخرى
//           // if (currentRequest) {
//           //   updateData.data = {
//           //     ...currentRequest.data,
//           //     status: event.status,
//           //     video_room_link:
//           //       event.video_room_link || currentRequest.data.video_room_link,
//           //   };
//           // }
//   let notificationType: Notification['type'];
//           let notificationTitle: string;
//           let notificationMessage: string;

//           switch (event.status) {
//             case 'accepted':
//               notificationType = 'consultation_accepted';
//               notificationTitle = 'تم قبول طلب الاستشارة';
//               notificationMessage = event.message || 'تم قبول طلب الاستشارة';
//               break;
//             case 'active':
//               notificationType = 'consultation_active';
//               notificationTitle = 'تم تفعيل الاستشارة';
//               notificationMessage = event.message || 'تم تفعيل الاستشارة';
//               break;
//             case 'completed':
//               notificationType = 'consultation_completed';
//               notificationTitle = 'تم إكمال الاستشارة';
//               notificationMessage = event.message || 'تم إكمال الاستشارة';
//               break;
//             case 'cancelled':
//               notificationType = 'consultation_cancelled';
//               notificationTitle = 'تم إلغاء الاستشارة';
//               notificationMessage = event.message || 'تم إلغاء الاستشارة';
//               break;
//             default:
//               notificationType = 'consultation_updated';
//               notificationTitle = 'تحديث حالة الاستشارة';
//               notificationMessage = event.message || `تم تحديث الحالة إلى: ${event.status}`;
//           }
//   addNotification({
//             type: notificationType,
//             title: notificationTitle,
//             message: notificationMessage,
//             data: {
//               consultation_id: event.id,
//               patient_id: event.patient_id,
//               consultant_id: event.consultant_id,
//               status: event.status,
//               video_room_link: event.video_room_link,
//               updated_at: event.updated_at,
//             },
//           });

//                 updateRequest(event.id, updateData);

//           const statusMessages: Record<string, string> = {
//             pending: "طلب استشارة جديد",
//             accepted: "تم قبول طلب الاستشارة",
//             active: "تم تفعيل الاستشارة",
//             completed: "تم إكمال الاستشارة",
//             cancelled: "تم إلغاء الاستشارة",
//           };

//           const message =
//             event.message ||
//             statusMessages[event.status] ||
//             `تم تحديث الحالة إلى: ${event.status}`;

//           // عرض إشعار حسب الحالة
//           if (event.status === "active") {
//             toast.success(message, {
//               duration: 5000,
//               position: "top-center",
//             });

//             // إذا كان هناك رابط زوم واستشارة فيديو، عرض زر الانضمام
//             if (event.video_room_link && event.type === "video") {
//               toast.success("تم إنشاء رابط جلسة الزوم", {
//                 duration: 7000,
//                 position: "top-center",
//                 action: {
//                   label: "انضم الآن",
//                   onClick: () => window.open(event.video_room_link, "_blank"),
//                 },
//               });
//             }
//           } else if (event.status === "cancelled") {
//             toast.error(message, {
//               duration: 5000,
//               position: "top-center",
//             });
//           } else {
//             toast.info(message, {
//               duration: 4000,
//               position: "top-center",
//             });
//           }

//           console.log("✅ تم تحديث الطلب في الـ store:", {
//             id: event.id,
//             status: event.status,
//             hasZoomLink: !!event.video_room_link,
//             zoomLink: event.video_room_link,
//           });
//         }
//       );

//       channel.subscribed(() => {
//         console.log("✅ تم الاشتراك بنجاح في القناة:", currentChannelName);
//         subscribedRef.current = true;
//       });

//       channel.error((error: unknown) => {
//         console.error("❌ خطأ في القناة:", error);
//         subscribedRef.current = false;
//       });
//     } catch (error) {
//       console.error("❌ خطأ في إعداد Echo:", error);
//       subscribedRef.current = false;
//     }

//     return () => {
//       if (echoRef.current && channelNameRef.current) {
//         echoRef.current.leave(channelNameRef.current);
//         subscribedRef.current = false;
//       }
//     };
//   }, [session, addRequest, updateRequest,addNotification,requests]);
// };

// // Pusher → Echo → listen()
// // ⬇
// // updateRequest()
// // ⬇
// // Zustand Store
// // ⬇
// // UI يتحدث فورًا




"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { getEcho } from "@/lib/echo";
import { useConsultationStore } from "@/store/consultationStore";
import { toast } from "sonner";
import type {
  ConsultationRequest,
} from "@/types/consultation";
import { useNotificationStore, Notification } from "@/store/notificationStore";

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

interface ConsultationUpdatedEvent {
  id: number;
  patient_id: number;
  consultant_id: number;
  status: "accepted" | "cancelled" | "active" | "completed";
  message?: string;
  updated_at: string;
  video_room_link?: string;
  type?: "video" | "chat";
  consultant_type?: string;
}

export const useEchoNotifications = (): void => {
  const { data: session } = useSession();

  const addRequest = useConsultationStore((state) => state.addRequest);
  const updateRequest = useConsultationStore((state) => state.updateRequest);
  const { requests } = useConsultationStore();

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const echoRef = useRef<ReturnType<typeof getEcho> | null>(null);
  const subscribedRef = useRef(false);
  const channelNameRef = useRef<string>("");

  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) return;

    const userId = session.user.id;
    const role = session.role === "patient" ? "patient" : "consultable";
    const channelName =
      role === "consultable"
        ? `consultant.${userId}`
        : `patient.${userId}`;

    if (
      subscribedRef.current &&
      channelNameRef.current === channelName
    ) {
      return;
    }

    const echo = getEcho(session.accessToken);
    echoRef.current = echo;
    channelNameRef.current = channelName;

    const channel = echo.private(channelName);

    // ===============================
    // Consultation Requested
    // ===============================
    channel.listen(
      "ConsultationRequestedBroadcast",
      (event: ConsultationRequestEvent) => {
        const notificationId = `consultation_${event.id}_requested`;

        const notification: Notification = {
          id: notificationId,
          type: "consultation_requested",
          title: "طلب استشارة جديد",
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
          },
        };

        addNotification(notification);

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
          video_room_link: undefined,
        };

        addRequest(consultationRequest);
      }
    );

    // ===============================
    // Consultation Updated
    // ===============================
    channel.listen(
      "ConsultationUpdatedBroadcast",
      (event: ConsultationUpdatedEvent) => {
        const notificationId = `consultation_${event.id}_${event.status}`;

        let notificationType: Notification["type"];
        let title: string;
        let message: string;

        switch (event.status) {
          case "accepted":
            notificationType = "consultation_accepted";
            title = "تم قبول طلب الاستشارة";
            message = event.message || title;
            break;
          case "active":
            notificationType = "consultation_active";
            title = "تم تفعيل الاستشارة";
            message = event.message || title;
            break;
          case "completed":
            notificationType = "consultation_completed";
            title = "تم إكمال الاستشارة";
            message = event.message || title;
            break;
          case "cancelled":
            notificationType = "consultation_cancelled";
            title = "تم إلغاء الاستشارة";
            message = event.message || title;
            break;
          default:
            notificationType = "consultation_updated";
            title = "تحديث حالة الاستشارة";
            message = event.message || title;
        }

        addNotification({
          id: notificationId,
          type: notificationType,
          title,
          message,
          read: false,
          createdAt: new Date().toISOString(),
          source: "pusher",
          data: {
            consultation_id: event.id,
            patient_id: event.patient_id,
            consultant_id: event.consultant_id,
            status: event.status,
            video_room_link: event.video_room_link,
            updated_at: event.updated_at,
          },
        });

        const currentRequest = requests.find((r) => r.id === event.id);

        // Prepare partial update: keep `video_room_link` at the request top-level
        const updateData: Partial<ConsultationRequest> = {
          status: event.status,
          updated_at: event.updated_at,
          type: event.type || currentRequest?.type,
          video_room_link:
            event.video_room_link || currentRequest?.video_room_link,
        };

        // Only set `data` when we actually have existing data to copy from.
        if (currentRequest?.data) {
          updateData.data = {
            ...currentRequest.data,
            status: event.status,
          };
        }

        updateRequest(event.id, updateData);

        toast.info(message);
      }
    );

    channel.subscribed(() => {
      subscribedRef.current = true;
    });

    channel.error(() => {
      subscribedRef.current = false;
    });

    return () => {
      if (echoRef.current) {
        echoRef.current.leave(channelName);
        subscribedRef.current = false;
      }
    };
  }, [session, addRequest, updateRequest, addNotification, requests]);
};

// Pusher → Echo → listen()
// ⬇
// updateRequest()
// ⬇
// Zustand Store
// ⬇
// UI يتحدث فورًا
