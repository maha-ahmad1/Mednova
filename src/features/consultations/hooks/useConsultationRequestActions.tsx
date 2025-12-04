"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ConsultationRequest } from "@/types/consultation";
import { consultationApi } from "@/app/api/consultation";
import type { AxiosError } from "axios";

export const useConsultationRequestActions = (
  token?: string,
  userRole: "consultable" | "patient" = "consultable"
) => {
  const updateStatusMutation = useMutation({
    mutationFn: async (params: {
      request: ConsultationRequest;
      status: "accepted" | "completed" | "cancelled";
      reason?: string;
      
    }) => {
      const { request, status, reason } = params;

      return await consultationApi.updateStatus(
        {
          id: request.id,
          status,
          action_by: userRole,
          consultant_nature: request.type,
          action_reason: reason,
        },
        token
      );
    },

    onSuccess: (_, variables) => {
      let message = "";
      switch (variables.status) {
        case "accepted":
          message = "تم قبول طلب الاستشارة بنجاح";
          break;
        case "completed":
          message = "تم بدء الاستشارة بنجاح";
          break;
        case "cancelled":
          message = "تم إلغاء طلب الاستشارة بنجاح";
          break;
      }
      toast.success(message);
    },

    onError: (error: AxiosError) => {
      console.error("Error:", error.response?.data || error.message);
      toast.error("حدث خطأ أثناء تنفيذ العملية، حاول مرة أخرى");
    },
  });

  const acceptRequest = (request: ConsultationRequest) =>
    updateStatusMutation.mutateAsync({ request, status: "accepted" });

  const startConsultation = (request: ConsultationRequest) =>
    updateStatusMutation.mutateAsync({ request, status: "completed" });

  const rejectRequest = (request: ConsultationRequest, reason: string) =>
    updateStatusMutation.mutateAsync({ request, status: "cancelled", reason });

  return {
    acceptRequest,
    startConsultation,
    rejectRequest,
    isProcessing: updateStatusMutation.status === "pending",
  };
};


// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";
// import type { ConsultationRequest } from "@/types/consultation";
// import { consultationApi } from "@/app/api/consultation";
// import type { AxiosError } from "axios";

// export const useConsultationRequestActions = (
//   token?: string,
//   userRole: "consultable" | "patient" = "consultable"
// ) => {
//   const updateStatusMutation = useMutation({
//     mutationFn: async (params: {
//       request: ConsultationRequest;
//       status: "accepted" | "completed" | "cancelled";
//       reason?: string;
//     }) => {
//       const { request, status, reason } = params;

//       console.log(`🔄 محاولة تحديث حالة الاستشارة: ${request.id} إلى ${status}`);

//       const result = await consultationApi.updateStatus(
//         {
//           id: request.id,
//           status,
//           action_by: userRole,
//           consultant_nature: request.data?.consultant_type || request.type,
//           action_reason: reason,
//         },
//         token
//       );

//       console.log(`✅ تم إرسال تحديث الحالة للخادم:`, result);
//       return result;
//     },

//     onSuccess: (data, variables) => {
//       let message = "";
//       switch (variables.status) {
//         case "accepted":
//           message = "تم قبول طلب الاستشارة بنجاح";
//           break;
//         case "completed":
//           message = "تم بدء الاستشارة بنجاح";
//           break;
//         case "cancelled":
//           message = "تم إلغاء طلب الاستشارة بنجاح";
//           break;
//       }
      
//       console.log(`🎉 ${message} - سيتم إشعار الطرف الآخر`);
//       toast.success(message);
      
//       // التأكد من أن الحدث تم إرساله عبر WebSocket
//       setTimeout(() => {
//         console.log("📢 التأكد من وصول الإشعار للطرف الآخر");
//       }, 1000);
//     },

//     onError: (error: AxiosError) => {
//       console.error("❌ خطأ في تحديث الحالة:", error.response?.data || error.message);
      
//       const errorMessage = (error.response?.data as any)?.message 
//         || "حدث خطأ أثناء تنفيذ العملية، حاول مرة أخرى";
      
//       toast.error(errorMessage);
//     },
//   });

//   const acceptRequest = (request: ConsultationRequest) => {
//     console.log(`✅ قبول الاستشارة: ${request.id}`);
//     return updateStatusMutation.mutateAsync({ request, status: "accepted" });
//   };

//   const startConsultation = (request: ConsultationRequest) => {
//     console.log(`🚀 بدء الاستشارة: ${request.id}`);
//     return updateStatusMutation.mutateAsync({ request, status: "completed" });
//   };

//   const rejectRequest = (request: ConsultationRequest, reason: string) => {
//     console.log(`❌ رفض الاستشارة: ${request.id} - السبب: ${reason}`);
//     return updateStatusMutation.mutateAsync({ request, status: "cancelled", reason });
//   };

//   return {
//     acceptRequest,
//     startConsultation,
//     rejectRequest,
//     isProcessing: updateStatusMutation.isPending,
//   };
// };