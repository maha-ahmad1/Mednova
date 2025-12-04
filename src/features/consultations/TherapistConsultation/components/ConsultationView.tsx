"use client";

import { useState, useEffect } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { ConsultationRequest, UserType } from "@/types/consultation";
import { Card, CardContent } from "@/components/ui/card";
import ConsultationList from "./ConsultationList";
import ConsultationDetails from "./ConsultationDetails";
import { useFetcher } from "@/hooks/useFetcher";
import { useSession } from "next-auth/react";
import { useConsultationStore } from "@/store/consultationStore";
import { useEchoNotifications } from '@/hooks/useEchoNotifications';

interface ConsultationViewProps {
  userType?: UserType;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ConsultationRequest[];
  status: string;
}

export default function ConsultationView({}: ConsultationViewProps) {


  const { data, isLoading, error } = useFetcher<ApiResponse>(
    ["consultations"],
    "/api/consultation-request/get-status-request?limit=30"
  );

  const { requests, setRequests, updateRequest } = useConsultationStore();
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { data: session } = useSession();

  const roleMap: Record<string, "patient" | "consultable"> = {
    patient: "patient",
    therapist: "consultable",
    rehabilitation_center: "consultable",
  };

  const role = roleMap[session?.role ?? ""] ?? undefined;

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setRequests(data.data);
    } else if (Array.isArray(data)) {
      setRequests(data);
    } else {
      setRequests([]);
    }
  }, [data, setRequests]);

  useEffect(() => {
    if (error) {
      toast.error("حدث خطأ في جلب طلبات الاستشارة");
      console.log("Error loading consultations:", error.message);
    }
  }, [error]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSelectRequest = (request: ConsultationRequest) => {
    setSelectedRequest(request);
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
  };

  const handleRequestUpdate = (updatedRequest: ConsultationRequest) => {
    // تحديث الطلب في الـ store مباشرة
    updateRequest(updatedRequest.id, updatedRequest);
    
    // تحديث الطلب المحدد
    setSelectedRequest(updatedRequest);
    
    console.log("🔄 تم تحديث الطلب في الـ store:", updatedRequest);
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#32A88D] mx-auto mb-4" />
          <span className="text-gray-600 text-lg">
            جاري تحميل طلبات الاستشارة...
          </span>
        </div>
      </div>
    );
  }

  return (
   <div className="w-full bg-gray-50 py-6 px-4 lg:pb-6 lg:pt-8" dir="rtl">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 mx-auto max-w-5xl w-full gap-4 lg:grid-cols-3 sm:gap-6 lg:gap-8">
      {isMobile ? (
        selectedRequest ? (
          <ConsultationDetails
            request={selectedRequest}
            isMobile={isMobile}
            onBackToList={handleBackToList}
            userRole={role}
            onRequestUpdate={handleRequestUpdate}
          />
        ) : (
          <ConsultationList
            requests={requests}
            selectedRequest={selectedRequest}
            onSelectRequest={handleSelectRequest}
            isMobile={isMobile}
            onBackToList={handleBackToList}
            userRole={role}
          />
        )
      ) : (
        <>
          <ConsultationList
            requests={requests} 
            selectedRequest={selectedRequest}
            onSelectRequest={handleSelectRequest}
            isMobile={isMobile}
            onBackToList={handleBackToList}
            userRole={role}
          />
          {selectedRequest ? (
            <ConsultationDetails
              request={selectedRequest}
              isMobile={isMobile}
              onBackToList={handleBackToList}
              userRole={role}
              onRequestUpdate={handleRequestUpdate}
            />
          ) : (
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg h-full flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
                <CardContent className="text-center py-8 sm:py-12 px-4 sm:px-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#32A88D]" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
                    اختر طلب استشارة
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
                    {requests.length === 0 
                      ? "لا توجد طلبات استشارة حالياً" 
                      : "اختر طلب استشارة من القائمة على اليمين لعرض التفاصيل الكاملة واتخاذ الإجراء المناسب"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  </div>
</div>
  );
}