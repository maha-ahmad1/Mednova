"use client";

import { useState } from "react";
import { Check, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ConsultationRequest } from "@/types/consultation";
import RejectDialog from "./RejectDialog";
import { useConsultationRequestActions } from "../../hooks/useConsultationRequestActions";

interface ConsultationActionsProps {
  request: ConsultationRequest;
  onRequestUpdate: (request: ConsultationRequest) => void;
  token?: string;
  userRole?: "consultable" | "patient" | undefined;
}

export default function ConsultationActions({
  request,
  onRequestUpdate,
  token,
  userRole,
}: ConsultationActionsProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  // console.log("request rejected", request);

  const { acceptRequest, startConsultation, rejectRequest, isProcessing } =
    useConsultationRequestActions(token, userRole);

  const handleAccept = async () => {
    try {
      await acceptRequest(request);
      onRequestUpdate({ ...request, status: "accepted" });
    } catch {
      toast.error("فشل قبول الطلب، حاول مرة أخرى");
    }
  };

  const handleStartConsultation = async () => {
    try {
      await startConsultation(request);
      onRequestUpdate({ ...request, status: "completed" });
    } catch {
      toast.error("فشل اكمال الطلب، حاول مرة أخرى");
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      await rejectRequest(request, reason);
      onRequestUpdate({ ...request, status: "cancelled" });
      setRejectDialogOpen(false);
    } catch {
      toast.error("فشل الغاء الطلب، حاول مرة أخرى");
    }
  };

  if (userRole === "patient") {
    return (
      <>
        {request.status == "pending" && (
          <Button
            onClick={() => setRejectDialogOpen(true)}
            disabled={isProcessing}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                جاري الرفض...
              </>
            ) : (
              "إلغاء الإستشارة"
            )}
          </Button>
        )}

        <RejectDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          onConfirm={handleRejectConfirm}
          isLoading={isProcessing}
        />

        {request.status === "cancelled" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg sm:rounded-xl">
            {/* <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" /> */}
            <p className="font-semibold text-red-800 text-sm sm:text-lg">
              تم إلغاء طلب الاستشارة
            </p>
            <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
              سيتم إعلام المريض بقرار الإلغاء
            </p>
          </div>
        )}

        {request.status === "completed" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl">
            <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
            <p className="font-semibold text-green-800 text-sm sm:text-lg">
              تم إكمال الاستشارة بنجاح
            </p>
            <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
              شكراً لك على تقديم خدمة مميزة للمريض
            </p>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
        {request.status === "pending" && (
          <>
            <Button
              onClick={handleAccept}
              disabled={isProcessing}
              className="cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  جاري القبول...
                </>
              ) : (
                <>
                  {/* <Check className="w-4 h-4 sm:w-5 sm:h-5" /> */}
                  قبول الطلب
                </>
              )}
            </Button>

            <Button
              onClick={() => setRejectDialogOpen(true)}
              disabled={isProcessing}
              variant="outline"
              className="cursor-pointer border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
            >
              {/* <X className="w-4 h-4 sm:w-5 sm:h-5" /> */}
              إلغاء الإستشارة
            </Button>
          </>
        )}

        {request.status === "accepted" && (
          <Button
            onClick={handleStartConsultation}
            disabled={isProcessing}
            className=" cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                جاري البدء...
              </>
            ) : (
              <>
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                بدء المحادثة الآن
              </>
            )}
          </Button>
        )}

        {request.status === "active" && (
          <div className="w-full">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-blue-800 text-sm sm:text-base">
                  في انتظار موعد الاستشارة
                </p>
                <p className="text-xs sm:text-sm text-blue-600">
                  سيتم بدء الاستشارة في الموعد المحدد
                </p>
              </div>
            </div>

            <Button
              onClick={handleStartConsultation}
              disabled={isProcessing}
              className=" cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  جاري البدء...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                  بدء الاستشارة مبكراً
                </>
              )}
            </Button>
          </div>
        )}
        
        {request.status === "completed" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl">
            <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
            <p className="font-semibold text-green-800 text-sm sm:text-lg">
              تم إكمال الاستشارة بنجاح
            </p>
            <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
              شكراً لك على تقديم خدمة مميزة للمريض
            </p>
          </div>
        )}

        {request.status === "cancelled" && (
          <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg sm:rounded-xl">
            {/* <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" /> */}
            <p className="font-semibold text-red-800 text-sm sm:text-lg">
              تم رفض طلب الاستشارة
            </p>
            <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
              سيتم إعلام المريض بقرار الرفض
            </p>
          </div>
        )}
      </div>

      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        isLoading={isProcessing}
      />
    </>
  );
}




// "use client";

// import { useState } from "react";
// import { Check, Video, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import type { ConsultationRequest } from "@/types/consultation";
// import RejectDialog from "./RejectDialog";
// import { useConsultationRequestActions } from "../../hooks/useConsultationRequestActions";
// import { useConsultationStore } from "@/store/consultationStore"; // تأكد من المسار

// interface ConsultationActionsProps {
//   request: ConsultationRequest;
//   onRequestUpdate: (request: ConsultationRequest) => void;
//   token?: string;
//   userRole?: "consultable" | "patient" | undefined;
// }

// export default function ConsultationActions({
//   request,
//   onRequestUpdate,
//   token,
//   userRole,
// }: ConsultationActionsProps) {
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const updateRequestInStore = useConsultationStore((state) => state.updateRequest);

//   const { acceptRequest, startConsultation, rejectRequest, isProcessing } =
//     useConsultationRequestActions(token, userRole);

//   const handleAccept = async () => {
//     try {
//       console.log(`🔄 معالجة قبول الاستشارة: ${request.id}`);
      
//       // تحديث الحالة محلياً أولاً
//       const updatedRequest = { ...request, status: "accepted" as const };
//       onRequestUpdate(updatedRequest);
//       updateRequestInStore(request.id, { status: "accepted" });
      
//       // ثم إرسال الطلب للخادم
//       await acceptRequest(request);
      
//       console.log(`✅ تم قبول الاستشارة بنجاح: ${request.id}`);
      
//     } catch (error) {
//       console.error(`❌ فشل قبول الاستشارة: ${request.id}`, error);
//       // التراجع عن التحديث المحلي في حالة الخطأ
//       onRequestUpdate({ ...request, status: "pending" });
//       updateRequestInStore(request.id, { status: "pending" });
//     }
//   };

//   const handleStartConsultation = async () => {
//     try {
//       console.log(`🔄 بدء الاستشارة: ${request.id}`);
      
//       // تحديث الحالة محلياً أولاً
//       const updatedRequest = { ...request, status: "completed" as const };
//       onRequestUpdate(updatedRequest);
//       updateRequestInStore(request.id, { status: "completed" });
      
//       // ثم إرسال الطلب للخادم
//       await startConsultation(request);
      
//       console.log(`✅ تم بدء الاستشارة بنجاح: ${request.id}`);
      
//     } catch (error) {
//       console.error(`❌ فشل بدء الاستشارة: ${request.id}`, error);
//       // التراجع عن التحديث المحلي في حالة الخطأ
//       const originalStatus = request.status === "accepted" ? "accepted" : "pending";
//       onRequestUpdate({ ...request, status: originalStatus });
//       updateRequestInStore(request.id, { status: originalStatus });
//     }
//   };

//   const handleRejectConfirm = async (reason: string) => {
//     try {
//       console.log(`🔄 معالجة رفض الاستشارة: ${request.id}`);
      
//       // تحديث الحالة محلياً أولاً
//       const updatedRequest = { ...request, status: "cancelled" as const };
//       onRequestUpdate(updatedRequest);
//       updateRequestInStore(request.id, { status: "cancelled" });
      
//       // ثم إرسال الطلب للخادم
//       await rejectRequest(request, reason);
      
//       setRejectDialogOpen(false);
//       console.log(`✅ تم رفض الاستشارة بنجاح: ${request.id}`);
      
//     } catch (error) {
//       console.error(`❌ فشل رفض الاستشارة: ${request.id}`, error);
//       // التراجع عن التحديث المحلي في حالة الخطأ
//       onRequestUpdate({ ...request, status: "pending" });
//       updateRequestInStore(request.id, { status: "pending" });
//     }
//   };

  
//   if (userRole === "patient") {
//     return (
//       <>
//         {request.status == "pending" && (
//           <Button
//             onClick={() => setRejectDialogOpen(true)}
//             disabled={isProcessing}
//             variant="outline"
//             className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 w-full"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//                 جاري الرفض...
//               </>
//             ) : (
//               "إلغاء الإستشارة"
//             )}
//           </Button>
//         )}

//         <RejectDialog
//           open={rejectDialogOpen}
//           onOpenChange={setRejectDialogOpen}
//           onConfirm={handleRejectConfirm}
//           isLoading={isProcessing}
//         />

//         {request.status === "cancelled" && (
//           <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg sm:rounded-xl">
//             {/* <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" /> */}
//             <p className="font-semibold text-red-800 text-sm sm:text-lg">
//               تم إلغاء طلب الاستشارة
//             </p>
//             <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
//               سيتم إعلام المريض بقرار الإلغاء
//             </p>
//           </div>
//         )}

//         {request.status === "completed" && (
//           <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl">
//             <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
//             <p className="font-semibold text-green-800 text-sm sm:text-lg">
//               تم إكمال الاستشارة بنجاح
//             </p>
//             <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
//               شكراً لك على تقديم خدمة مميزة للمريض
//             </p>
//           </div>
//         )}
//       </>
//     );
//   }
//   return (
//     <>
//       <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
//         {request.status === "pending" && (
//           <>
//             <Button
//               onClick={handleAccept}
//               disabled={isProcessing}
//               className="cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
//             >
//               {isProcessing ? (
//                 <>
//                   <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//                   جاري القبول...
//                 </>
//               ) : (
//                 <>
//                   {/* <Check className="w-4 h-4 sm:w-5 sm:h-5" /> */}
//                   قبول الطلب
//                 </>
//               )}
//             </Button>

//             <Button
//               onClick={() => setRejectDialogOpen(true)}
//               disabled={isProcessing}
//               variant="outline"
//               className="cursor-pointer border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
//             >
//               {/* <X className="w-4 h-4 sm:w-5 sm:h-5" /> */}
//               إلغاء الإستشارة
//             </Button>
//           </>
//         )}

//         {request.status === "accepted" && (
//           <Button
//             onClick={handleStartConsultation}
//             disabled={isProcessing}
//             className=" cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//                 جاري البدء...
//               </>
//             ) : (
//               <>
//                 <Video className="w-4 h-4 sm:w-5 sm:h-5" />
//                 بدء المحادثة الآن
//               </>
//             )}
//           </Button>
//         )}

//         {request.status === "active" && (
//           <div className="w-full">
//             <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
//               <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
//               <div className="flex-1">
//                 <p className="font-semibold text-blue-800 text-sm sm:text-base">
//                   في انتظار موعد الاستشارة
//                 </p>
//                 <p className="text-xs sm:text-sm text-blue-600">
//                   سيتم بدء الاستشارة في الموعد المحدد
//                 </p>
//               </div>
//             </div>

//             <Button
//               onClick={handleStartConsultation}
//               disabled={isProcessing}
//               className=" cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
//             >
//               {isProcessing ? (
//                 <>
//                   <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
//                   جاري البدء...
//                 </>
//               ) : (
//                 <>
//                   <Video className="w-4 h-4 sm:w-5 sm:h-5" />
//                   بدء الاستشارة مبكراً
//                 </>
//               )}
//             </Button>
//           </div>
//         )}
        
//         {request.status === "completed" && (
//           <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl">
//             <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
//             <p className="font-semibold text-green-800 text-sm sm:text-lg">
//               تم إكمال الاستشارة بنجاح
//             </p>
//             <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
//               شكراً لك على تقديم خدمة مميزة للمريض
//             </p>
//           </div>
//         )}

//         {request.status === "cancelled" && (
//           <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg sm:rounded-xl">
//             {/* <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" /> */}
//             <p className="font-semibold text-red-800 text-sm sm:text-lg">
//               تم رفض طلب الاستشارة
//             </p>
//             <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
//               سيتم إعلام المريض بقرار الرفض
//             </p>
//           </div>
//         )}
//       </div>

//       <RejectDialog
//         open={rejectDialogOpen}
//         onOpenChange={setRejectDialogOpen}
//         onConfirm={handleRejectConfirm}
//         isLoading={isProcessing}
//       />
//     </>
//   );
// }
