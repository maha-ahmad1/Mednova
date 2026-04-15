"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetcher } from "@/hooks/useFetcher";
import { useConsultationStore } from "@/store/consultationStore";
import { TimeZoneService } from "@/lib/timezone-service";
import type { ConsultationRequest } from "@/types/consultation";
import ConsultationChatPanel from "@/features/chat/ui/ConsultationChatPanel";

interface ApiResponse {
  success: boolean;
  message: string;
  data: ConsultationRequest[];
  status: string;
}

const ACCEPTED_CHAT_STATUSES: ConsultationRequest["status"][] = [
  "accepted",
  "active",
  "completed",
];

const canAccessChat = (status: ConsultationRequest["status"]) =>
  ACCEPTED_CHAT_STATUSES.includes(status);

const getStatusLabel = (status: ConsultationRequest["status"]) => {
  if (status === "active") return "نشطة";
  if (status === "accepted") return "مقبولة";
  if (status === "completed") return "مكتملة";
  return status;
};

export default function ProfileChatPage() {
  const { data: session } = useSession();
  const [timezone, setTimezone] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ConsultationRequest | null>(null);

  const { requests, setRequests } = useConsultationStore();

  const { data, isLoading } = useFetcher<ApiResponse>(
    ["consultations", "chat-page"],
    `/api/consultation-request/get-status-request?limit=30${timezone ? `&current_time_zone=${timezone}` : ""}`,
    { enabled: !!timezone }
  );

  useEffect(() => {
    setTimezone(TimeZoneService.detectUserTimeZone());
  }, []);

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      console.log("🧪 [TRACE][ProfileChatPage] API hydration -> setRequests(data.data)", {
        timestamp: new Date().toISOString(),
        total: data.data.length,
        ids: data.data.map((item) => ({
          id: item?.id,
          idType: typeof item?.id,
          status: item?.status,
        })),
      });
      setRequests(data.data);
      return;
    }

    if (Array.isArray(data)) {
      console.log("🧪 [TRACE][ProfileChatPage] API hydration -> setRequests(data)", {
        timestamp: new Date().toISOString(),
        total: data.length,
        ids: data.map((item) => ({
          id: item?.id,
          idType: typeof item?.id,
          status: item?.status,
        })),
      });
      setRequests(data);
      return;
    }

    console.log("🧪 [TRACE][ProfileChatPage] API hydration -> setRequests([])", {
      timestamp: new Date().toISOString(),
    });
    setRequests([]);
  }, [data, setRequests]);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const chatRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.type === "chat" && ACCEPTED_CHAT_STATUSES.includes(request.status)
      ),
    [requests]
  );

  useEffect(() => {
    if (!chatRequests.length) {
      setSelectedRequest(null);
      return;
    }

    if (
      !selectedRequest ||
      !chatRequests.some((request) => request.id === selectedRequest.id)
    ) {
      setSelectedRequest(chatRequests[0]);
    }
  }, [chatRequests, selectedRequest]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">يجب تسجيل الدخول للوصول إلى المحادثات</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
      </div>
    );
  }

  return (
    <div className="w-full" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {(!isMobile || !selectedRequest) && (
          <Card className="lg:col-span-1 h-[calc(100vh-220px)] overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#32A88D]" />
                المحادثات
                <Badge className="bg-[#32A88D] text-white">{chatRequests.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto h-[calc(100%-68px)]">
              {chatRequests.length === 0 ? (
                <div className="h-full flex items-center justify-center p-6 text-center text-gray-500 text-sm">
                  لا توجد محادثات للمستخدمين المقبولين حالياً.
                </div>
              ) : (
                chatRequests.map((request) => {
                  const isActive = selectedRequest?.id === request.id;
                  const counterpart =
                    session.role === "patient"
                      ? request.data.consultant
                      : request.data.patient;

                  return (
                    <button
                      key={request.id}
                      type="button"
                      onClick={() => setSelectedRequest(request)}
                      className={`w-full text-right p-4 border-b transition-colors ${
                        isActive ? "bg-[#32A88D]/10" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarImage
                            src={counterpart.image || "/images/placeholder.svg"}
                            alt={counterpart.full_name}
                          />
                          <AvatarFallback className="bg-[#32A88D]/10 text-[#32A88D]">
                            {counterpart.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {counterpart.full_name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {getStatusLabel(request.status)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>
        )}

        {selectedRequest && (
          <div className="lg:col-span-2 h-[calc(100vh-220px)]">
            <Card className="h-full overflow-hidden">
              <ConsultationChatPanel
                request={selectedRequest}
                canShowChat={canAccessChat(selectedRequest.status)}
                onBackToDetails={() => setSelectedRequest(null)}
                backButtonLabel="العودة إلى قائمة المحادثات"
              />
            </Card>
          </div>
        )}

        {!selectedRequest && isMobile && chatRequests.length > 0 && (
          <div className="lg:col-span-2 h-[calc(100vh-220px)] flex items-center justify-center text-gray-500">
            اختر محادثة من القائمة.
          </div>
        )}
      </div>
    </div>
  );
}
