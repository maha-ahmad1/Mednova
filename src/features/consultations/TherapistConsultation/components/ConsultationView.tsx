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

interface ConsultationViewProps {
  userType?: UserType;
}
interface ApiResponse {
  success: boolean;
  message: string;
  data: ConsultationRequest[];
  status: string;
}
export default function ConsultationView({}: // userType = "therapist",
ConsultationViewProps) {
  const { data, isLoading, error } = useFetcher<ApiResponse>(
    ["consultations"],
    "/api/consultation-request/get-status-request"
  );

  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showRequestList, setShowRequestList] = useState(true);

  const { data: session } = useSession();
  console.log("rols ", session?.role);

  // const role =
  //   session?.role === "consultable"
  //     ? "consultable"
  //     : session?.role === "patient"
  //     ? "patient"
  //     : undefined;
  const roleMap: Record<string, "patient" | "consultable"> = {
    patient: "patient",
    therapist: "consultable",
    rehabilitation_center: "consultable",
  };

  const role = roleMap[session?.role ?? ""] ?? undefined;

  useEffect(() => {
    console.log("📦 Raw data from API:", data);

    if (Array.isArray(data?.data)) {
      setRequests(data.data);
    } else if (Array.isArray(data)) {
      setRequests(data);
    } else {
      setRequests([]);
    }

    console.log("✅ consultations (normalized):", data?.data || data);
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error("حدث خطأ في جلب طلبات الاستشارة");
      console.log("Error loading consultations:", error.message);
    }
  }, [error]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowRequestList(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSelectRequest = (request: ConsultationRequest) => {
    setSelectedRequest(request);
    if (isMobile) {
      setShowRequestList(false);
    }
  };

  const handleBackToList = () => {
    setShowRequestList(true);
  };

  const handleRequestUpdate = (updatedRequest: ConsultationRequest) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
    );
    setSelectedRequest(updatedRequest);
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
    <div
      className="container max-w-7xl mx-auto sm:px-4 sm:py-6 md:ml-10 flex-1 bg-gray-50 py-6 px-4"
      dir="rtl"
    >
      <div className="grid grid-cols-1 mx-auto max-w-5xl w-full space-y-6 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {(showRequestList || !isMobile) && (
          <ConsultationList
            requests={requests}
            selectedRequest={selectedRequest}
            onSelectRequest={handleSelectRequest}
            isMobile={isMobile}
            onBackToList={handleBackToList}
            userRole={role}
          />
        )}

        {((!showRequestList && isMobile) || !isMobile) && selectedRequest && (
          <ConsultationDetails
            request={selectedRequest}
            isMobile={isMobile}
            onBackToList={handleBackToList}
            userRole={role}
            onRequestUpdate={handleRequestUpdate}
          />
        )}

        {!selectedRequest && (!isMobile || (isMobile && showRequestList)) && (
          <div className="lg:col-span-2 hidden lg:block">
            <Card className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg h-full flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
              <CardContent className="text-center py-8 sm:py-12 px-4 sm:px-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#32A88D]" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
                  اختر طلب استشارة
                </h3>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
                  اختر طلب استشارة من القائمة على اليمين لعرض التفاصيل الكاملة
                  واتخاذ الإجراء المناسب
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
