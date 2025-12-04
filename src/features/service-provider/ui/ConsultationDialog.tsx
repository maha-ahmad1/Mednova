"use client";

import React from "react";
import { MessageSquare, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useConsultationRequestStore } from "@/features/home/hooks/useConsultationRequestStore";
import { toast } from "sonner";
import { ServiceProvider } from '../types/provider';


interface ConsultationDialogProps {
  provider: ServiceProvider;
}

export const ConsultationDialog: React.FC<ConsultationDialogProps> = ({ provider }) => {
  const { data: session } = useSession();
  const { storeConsultationRequest, Loading: isSubmitting } = useConsultationRequestStore();
  const handleRequest = async (type: "chat" | "video") => {
    if (!session?.user?.id) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      const payload = {
        patient_id: session.user.id,
        consultant_id: provider.id,
        consultant_type: provider.type_account === "therapist" ? "therapist" : "rehabilitation_center",
        consultant_nature: type,
        ...(type === "video" && {
          requested_day: "Thursday",
          requested_time: "2025-10-30 14:00",
          type_appointment: "online"
        })
      };

      await storeConsultationRequest(payload);
    //   toast.success("تم إرسال طلبك بنجاح، الرجاء انتظار الموافقة ");
    } catch (error) {
    //   toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى");
      console.error("❌ Error sending consultation request:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="cursor-pointer w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          طلب استشارة
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-[#32A88D]" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-800">
              اختر نوع الاستشارة
            </DialogTitle>
            <p className="text-gray-600 mt-2">مع {provider.full_name}</p>
          </div>
        </DialogHeader>
        
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4">
            {/* استشارة نصية */}
            <button
              onClick={() => handleRequest("chat")}
              disabled={isSubmitting}
              className="group flex flex-col items-center gap-3 p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-blue-700">استشارة نصية</span>
              <span className="text-xs text-blue-600 text-center">محادثة فورية عبر النص</span>
            </button>

            {/* استشارة فيديو */}
            <button
              onClick={() => handleRequest("video")}
              disabled={isSubmitting}
              className="group flex flex-col items-center gap-3 p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-green-700">استشارة فيديو</span>
              <span className="text-xs text-green-600 text-center">مكالمة فيديو مباشرة</span>
            </button>
          </div>

          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 mt-6 p-4 bg-gray-50 rounded-xl">
              <Loader2 className="w-5 h-5 text-[#32A88D] animate-spin" />
              <span className="text-gray-600">جاري إرسال الطلب...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};