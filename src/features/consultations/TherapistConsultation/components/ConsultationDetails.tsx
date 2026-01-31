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
  Video as VideoIcon,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getStatusBadge, getTypeIcon } from "@/lib/consultation-helpers";
import ConsultationActions from "./ConsultationActions";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react"; // أضف useEffect
import ChatInterface from "@/features/chat/ui/ChatInterface";
import { useConsultationStore } from "@/store/consultationStore";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge, getTypeIcon } from "@/features/consultations/utils/consultation-helpers";
interface ConsultationDetailsProps {
  request: ConsultationRequest;
  isMobile: boolean;
  onBackToList: () => void;
  onRequestUpdate: (request: ConsultationRequest) => void;
  userRole: "patient" | "consultable" | undefined;
}

export default function ConsultationDetails({
  request: initialRequest,
  isMobile,
  onBackToList,
  onRequestUpdate,
  userRole,
}: ConsultationDetailsProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");

  // ✅ احصل على أحدث نسخة من الـ store
  const { requests } = useConsultationStore();
  const storeRequest = requests.find((r) => r.id === initialRequest.id);

  // ✅ استخدم الطلب من الـ store إذا كان موجوداً، وإلا استخدم الـ API
  const displayRequest = storeRequest || initialRequest;

  const patient = displayRequest.data.patient;
  const consultant = displayRequest.data.consultant;

  // ✅ استخدم حالة الـ store، ليس الـ API
  const canShowChat = ["accepted", "active", "completed"].includes(
    displayRequest.status
  );

  // ✅ ✅ ✅ **الجزء الأهم:** اكتشاف إذا كان الرابط من البوشر
  const isZoomLinkFromPusher = () => {
    if (!storeRequest) return false;

    // ✅ ✅ ✅ **التصحيح:** قارن بين الـ store والـ API الأصلي
    const hasLinkInStore = !!storeRequest.video_room_link;
    const hasLinkInAPI = !!initialRequest.video_room_link;

    console.log("🔍 اكتشاف مصدر رابط الزوم:", {
      storeHasLink: hasLinkInStore,
      apiHasLink: hasLinkInAPI,
      storeLink: storeRequest.video_room_link,
      apiLink: initialRequest.video_room_link,
    });

    // ✅ الرابط من البوشر إذا كان موجوداً في الـ store ولكن ليس في الـ API
    return hasLinkInStore && !hasLinkInAPI;
  };

  // ✅ وظيفة التحقق من ظهور زر الزوم
const shouldShowZoomButton = () => {
  const conditions = {
    isVideo: displayRequest.type === "video",
    isActiveStatus: displayRequest.status === "active", // فقط active
    hasZoomLink: !!displayRequest.video_room_link,
    isFromPusher: isZoomLinkFromPusher(),
  };

  console.log("🔍 شروط زر الزوم:", conditions);

  // ✅ يظهر الزر فقط عندما تكون الحالة active
  if (conditions.isVideo && conditions.isActiveStatus && conditions.hasZoomLink) {
    console.log("✅ زر الزوم سيظهر! المصدر:",
      conditions.isFromPusher ? "البوشر (Real-time)" : "API (أصلي)");
    return true;
  }

  return false;
};

  // ✅ تسجيل التشخيص في الكونسول
  useEffect(() => {
    console.log("🎯 تحليل طلب الاستشارة:", {
      requestId: displayRequest.id,
      type: displayRequest.type,
      status: displayRequest.status,
      video_room_link: displayRequest.video_room_link,
      source: isZoomLinkFromPusher() ? "البوشر" : "API",
      initialStatus: initialRequest.status,
      storeStatus: storeRequest?.status,
    });
  }, [displayRequest, storeRequest]);

  const renderDetailsContent = () => (
    <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* ✅ مؤشر مصدر البيانات */}
      {isZoomLinkFromPusher() && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <RefreshCw className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">
              تم تحديث رابط الزوم مباشرةً
            </span>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
            Real-time
          </Badge>
        </div>
      )}

      {shouldShowZoomButton() && (
        <div className="mb-6 sm:mb-8 animate-in fade-in duration-500">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 relative overflow-hidden">
            {/* مؤشر البوشر */}
            {isZoomLinkFromPusher() && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-300">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  مباشر
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <VideoIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-800 text-lg">
                  استشارة فيديو مباشرة
                </h4>
                <p className="text-blue-600 text-sm">
                  {isZoomLinkFromPusher()
                    ? "تم إنشاء الرابط مباشرة - انقر للانضمام"
                    : "انقر للانضمام إلى جلسة الزوم"}
                </p>
              </div>
            </div>

            <Button
              onClick={() =>
                window.open(String(displayRequest.video_room_link), "_blank")
              }
              className={`w-full ${
                isZoomLinkFromPusher()
                  ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              } text-white py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all`}
            >
              <VideoIcon className="w-5 h-5" />
              <span className="font-semibold">
                {isZoomLinkFromPusher()
                  ? "انضم الآن (مباشر)"
                  : "انضم إلى جلسة الزوم"}
              </span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-blue-500">
                سيتم فتح الرابط في نافذة جديدة
              </p>
              {isZoomLinkFromPusher() && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  ⚡ تحديث مباشر
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* زر تشخيص - يظهر فقط في التطوير */}
      {/* {process.env.NODE_ENV === 'development' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("🔍 تشخيص زر الزوم:");
            console.log("1. طلب الـ API (الأصلي):", initialRequest);
            console.log("2. طلب الـ Store (المحدث):", storeRequest);
            console.log("3. الطلب المعروض:", displayRequest);
            console.log("4. رابط الزوم:", displayRequest.video_room_link);
            console.log("5. من البوشر؟", isZoomLinkFromPusher());
            console.log("6. يظهر الزر؟", shouldShowZoomButton());
            console.log("7. جميع الطلبات في الـ store:", requests);
          }}
          className="mb-4 text-xs"
        >
          <RefreshCw className="w-3 h-3 ml-1" />
          تشخيص بيانات الزوم
        </Button>
      )} */}

      {userRole === "patient" && (
        <>
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
              بيانات{" "}
              {displayRequest.data.consultant_type === "therapist"
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
              {displayRequest.type === "chat" ? "محادثة نصية" : "استشارة فيديو"}
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              حالة الاستشارة
            </p>
            <div className="font-semibold text-gray-800 text-sm sm:text-base">
              {getStatusBadge(displayRequest.status)}
            </div>
          </div>
        </div>
      </div>

      {displayRequest.type === "chat" &&
        ["accepted", "active"].includes(displayRequest.status) && (
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
        request={displayRequest} // ✅ استخدم displayRequest
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
              {displayRequest.status === "pending"
                ? "يجب قبول الاستشارة أولاً لبدء المحادثة"
                : displayRequest.status === "cancelled"
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
          id: displayRequest.id,
          patient_id: displayRequest.data.patient.id,
          consultant_id: displayRequest.data.consultant.id,
          consultant_type: displayRequest.data.consultant_type,
          status: displayRequest.status,
          first_patient_message_at:
            displayRequest.data.first_patient_message_at,
          first_consultant_message_at:
            displayRequest.data.first_consultant_reply_at,
          patient_message_count: displayRequest.data.patient_message_count,
          consultant_message_count:
            displayRequest.data.consultant_message_count,
          max_messages_for_patient:
            displayRequest.data.max_messages_for_patient,
          created_at: displayRequest.created_at,
          updated_at: displayRequest.updated_at,
          consultant_full_name: displayRequest.data.consultant.full_name,
          patient_full_name: displayRequest.data.patient.full_name,
          patient_image: displayRequest.data.patient.image,
          consultant_image: displayRequest.data.consultant.image,
          // video_room_link: displayRequest.video_room_link,
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
              {getTypeIcon(displayRequest.type)}
              <div className="scale-75 sm:scale-100 origin-right">
                {getStatusBadge(displayRequest.status)}
              </div>
           
            </div>
          </div>

          {displayRequest.type === "chat" && canShowChat && (
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
