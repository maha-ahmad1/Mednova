"use client";

import type React from "react";
import type { ConsultationRequest } from "@/types/consultation";
import {
  User,
  Mail,
  Phone,
  ChevronLeft,
  MessageCircle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadge, getTypeIcon } from "@/lib/consultation-helpers";
import ConsultationActions from "./ConsultationActions";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ChatInterface from "@/features/chat/ui/ChatInterface";

interface ConsultationDetailsProps {
  request: ConsultationRequest;
  isMobile: boolean;
  onBackToList: () => void;
  onRequestUpdate: (request: ConsultationRequest) => void;
  userRole: "patient" | "consultable" | undefined;
}

export default function ConsultationDetails({
  request,
  isMobile,
  onBackToList,
  onRequestUpdate,
  userRole,
}: ConsultationDetailsProps) {
  const patient = request.data.patient;
  const consultant = request.data.consultant;
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");

  const canShowChat = ["accepted", "active", "completed"].includes(
    request.status
  );

  const renderDetailsContent = () => (
    <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
      {userRole === "patient" && (
        <>
          {/* Consultant Info Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
              بيانات{" "}
              {request.data.consultant_type === "therapist"
                ? "المعالج"
                : "المركز"}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <InfoCard
                icon={User}
                label="الاسم الكامل"
                value={consultant.full_name}
              />
              <InfoCard
                icon={Mail}
                label="البريد الإلكتروني"
                value={consultant.email}
              />
              <InfoCard
                icon={Phone}
                label="رقم الهاتف"
                value={consultant.phone}
              />
            </div>
          </div>
        </>
      )}

      {userRole === "consultable" && (
        <>
          {/* Patient Info Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
              بيانات المريض
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <InfoCard
                icon={User}
                label="الاسم الكامل"
                value={patient.full_name}
              />
              <InfoCard
                icon={Mail}
                label="البريد الإلكتروني"
                value={patient.email}
              />
              <InfoCard icon={Phone} label="رقم الهاتف" value={patient.phone} />
            </div>
          </div>
        </>
      )}

      {/* Consultation Details Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
          معلومات الاستشارة
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              نوع الاستشارة
            </p>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {request.type === "chat" ? "محادثة نصية" : "استشارة فيديو"}
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              حالة الاستشارة
            </p>
            <div className="font-semibold text-gray-800 text-sm sm:text-base">
              {getStatusBadge(request.status)}
            </div>
          </div>

         
        </div>
      </div>

      {canShowChat && (
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={() => setActiveTab("chat")}
            className="w-full bg-[#32A88D] hover:bg-[#2a8a7a] text-white py-3"
          >
            <MessageCircle className="w-5 h-5 ml-2" />
            الانتقال إلى المحادثة
          </Button>
        </div>
      )}

      <ConsultationActions
        request={request}
        onRequestUpdate={onRequestUpdate}
        token={session?.accessToken}
        userRole={userRole}
      />
    </div>
  );

  const renderChatContent = () => {
    if (!canShowChat) {
      return (
        <div className="p-8 text-center h-full flex items-center justify-center">
          <div>
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              المحادثة غير متاحة
            </h3>
            <p className="text-gray-500 text-sm">
              {request.status === "pending"
                ? "يجب قبول الاستشارة أولاً لبدء المحادثة"
                : request.status === "cancelled"
                ? "تم رفض هذه الاستشارة"
                : "لا يمكن الوصول إلى المحادثة في الوقت الحالي"}
            </p>
            <Button
              onClick={() => setActiveTab("details")}
              variant="outline"
              className="mt-4"
            >
              العودة إلى التفاصيل
            </Button>
          </div>
        </div>
      );
    }

    return (
      <ChatInterface
        chatRequest={{
          id: request.id,
          patient_id: request.data.patient.id,
          consultant_id: request.data.consultant.id,
          consultant_type: request.data.consultant_type,
          status: request.status,
          first_patient_message_at: request.data.first_patient_message_at,
          first_consultant_message_at: request.data.first_consultant_reply_at,
          patient_message_count: request.data.patient_message_count,
          consultant_message_count: request.data.consultant_message_count,
          max_messages_for_patient: request.data.max_messages_for_patient,
          created_at: request.created_at,
          updated_at: request.updated_at,
          consultant_full_name: request.data.consultant.full_name,
          patient_full_name: request.data.patient.full_name,
          patient_image: request.data.patient.image,
          consultant_image: request.data.consultant.image,
        }}
        onBack={() => setActiveTab("details")}
      />
    );
  };

  return (
    <div className={`lg:col-span-2 ${isMobile ? "block" : "block"}`}>
      <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg h-full flex flex-col">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToList}
                  className="lg:hidden"
                >
                  <ChevronLeft className="w-4 h-4 ml-1" />
                  رجوع
                </Button>
              )}
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#32A88D]" />
                تفاصيل الاستشارة
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {getTypeIcon(request.type)}
              <div className="scale-75 sm:scale-100 origin-right">
                {getStatusBadge(request.status)}
              </div>
            </div>
          </div>

          {canShowChat && (
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "details" | "chat")
              }
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="details"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#32A88D] transition-all"
                >
                  <Info className="w-4 h-4" />
                  التفاصيل
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#32A88D] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  المحادثة
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          {canShowChat ? (
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="details" className="m-0 h-full">
                {renderDetailsContent()}
              </TabsContent>
              <TabsContent value="chat" className="m-0 h-full">
                {renderChatContent()}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-full">{renderDetailsContent()}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
      <div className="p-1 sm:p-2 bg-[#32A88D]/10 rounded-lg">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
      </div>
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-gray-600 mb-1">{label}</p>
        <p className="font-semibold text-gray-800 text-sm sm:text-base break-all">
          {value}
        </p>
      </div>
    </div>
  );
}
