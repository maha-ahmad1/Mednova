"use client";

import type React from "react";
import { useTranslations } from "next-intl";
import type { ConsultationRequest } from "@/types/consultation";
import {
  User,
  ChevronLeft,
  MessageCircle,
  Video as VideoIcon,
  ExternalLink,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { getStatusBadge, getTypeIcon } from "@/lib/consultation-helpers";
import ConsultationActions from "./ConsultationActions";
import { useEffect, useCallback } from "react"; // أضف useEffect
import { useConsultationStore } from "@/store/consultationStore";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { History } from "lucide-react";
import { getStatusBadge, getTypeIcon } from "@/features/consultations/utils/consultation-helpers";
import MeasurementSection from "@/features/measurements/ui/MeasurementSection";

// Formats the appointment day/time using the caller's translated day names
const formatAppointmentDateTime = (
  request: ConsultationRequest,
  getDayLabel: (day: string) => string,
) => {
  if (request.data?.appointment) {
    const appointment = request.data.appointment;
    const localizedDay = getDayLabel(appointment.requested_day);

    let timeDisplay = appointment.requested_time;
    if (appointment.requested_time) {
      const timeParts = appointment.requested_time.split(':');
      if (timeParts.length >= 2) {
        timeDisplay = `${timeParts[0]}:${timeParts[1]}`;
      }
    }

    return {
      fullDate: `${localizedDay} ${timeDisplay}`,
      day: localizedDay,
      time: timeDisplay,
    };
  }
  return null;
};

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
  const t = useTranslations("consultations.panel");
  const tDays = useTranslations("consultations.panel.days");
  const tStatus = useTranslations("consultations.status");
  const tMeasurements = useTranslations("measurements");
  const getStatusLabel = (status: string) => tStatus(status as "pending" | "accepted" | "cancelled" | "active" | "completed");
  const getDayLabel = (day: string) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days.includes(day) ? tDays(day as (typeof days)[number]) : day;
  };
  // ✅ احصل على أحدث نسخة من الـ store
  const { requests } = useConsultationStore();
  const storeRequest = requests.find((r) => r.id === initialRequest.id);

  // ✅ استخدم الطلب من الـ store إذا كان موجوداً، وإلا استخدم الـ API
  const displayRequest = storeRequest || initialRequest;

  const patient = displayRequest.data.patient;
  const consultant = displayRequest.data.consultant;

  // ✅ معلومات تاريخ الحجز
  const appointmentInfo = formatAppointmentDateTime(displayRequest, getDayLabel);


  // ✅ ✅ ✅ **الجزء الأهم:** اكتشاف إذا كان الرابط من البوشر
  const isZoomLinkFromPusher = useCallback(() => {
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
  }, [storeRequest, initialRequest.video_room_link]);

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
      appointment: displayRequest.data?.appointment,
    });
  }, [displayRequest, storeRequest, isZoomLinkFromPusher, initialRequest.status]);

  const renderDetailsContent = () => (
    <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* ✅ مؤشر مصدر البيانات */}
      {isZoomLinkFromPusher() && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <RefreshCw className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">
              {t("liveUpdateBanner")}
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
                  {t("live")}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <VideoIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-800 text-lg">
                  {t("videoTitle")}
                </h4>
                <p className="text-blue-600 text-sm">
                  {isZoomLinkFromPusher()
                    ? t("videoDescLive")
                    : t("videoDescNormal")}
                </p>
              </div>
            </div>

            <Button
              onClick={() =>
                window.open(String(displayRequest.video_room_link), "_blank")
              }
              className=" cursor-pointer w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <VideoIcon className="w-5 h-5" />
              <span className="font-semibold">
                {isZoomLinkFromPusher()
                  ? t("joinNowLive")
                  : t("joinZoom")}
              </span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-blue-500">
                {t("linkOpensNewWindow")}
              </p>
              {isZoomLinkFromPusher() && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  ⚡ {t("liveUpdate")}
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
        <DetailSection
          title={
            displayRequest.data.consultant_type === "therapist"
              ? t("therapistDataTitle")
              : t("centerDataTitle")
          }
        >
          <FieldRow
            icon={User}
            label={t("fullNameLabel")}
            value={consultant.full_name}
          />
        </DetailSection>
      )}

      {userRole === "consultable" && (
        <DetailSection title={t("patientDataTitle")}>
          <FieldRow
            icon={User}
            label={t("fullNameLabel")}
            value={patient.full_name}
          />
          {!!patient?.id && (
            <div className="py-2.5 md:py-0 md:mt-3">
              <Link
                href={`/profile/consultations/patients/${patient.id}/measurements?patientName=${encodeURIComponent(patient.full_name)}`}
                className="min-h-11 inline-flex items-center gap-1.5 text-sm font-medium text-[#32A88D] hover:underline"
              >
                <History className="w-4 h-4" />
                {tMeasurements("historyLinkText")}
              </Link>
            </div>
          )}
        </DetailSection>
      )}

      <DetailSection title={t("consultationInfoTitle")}>
        <FieldRow
          label={t("consultationTypeLabel")}
          value={displayRequest.type === "chat" ? t("typeChat") : t("typeVideo")}
        />

        {appointmentInfo && (
          <FieldRow
            icon={Calendar}
            label={t("bookingDateLabel")}
            value={appointmentInfo.fullDate}
          />
        )}

        <FieldRow
          label={t("statusLabel")}
          value={getStatusBadge(displayRequest.status, getStatusLabel)}
        />
      </DetailSection>

      {displayRequest.type === "chat" &&
        ["accepted", "active", "completed"].includes(displayRequest.status) && (
          <div className="mb-6 sm:mb-8">
            <Button asChild className=" cursor-pointer  w-full bg-[#32A88D] hover:bg-[#2a8a7a] text-white py-3">
              <Link href="/profile/chat">
                <MessageCircle className="w-5 h-5 ml-2" />
                {t("openChat")}
              </Link>
            </Button>
          </div>
        )}

      {/* Same workspace card/scroll region as the session controls below —
          not a separate trailing module. Placed above the action buttons
          since it's the most time-critical, actionable data during a live
          session. */}
      <MeasurementSection request={displayRequest} userRole={userRole} />

      <ConsultationActions
        request={displayRequest} // ✅ استخدم displayRequest
        onRequestUpdate={onRequestUpdate}
        userRole={userRole}
      />
    </div>
  );

  return (
    <div className={`lg:col-span-2 ${isMobile ? "block" : "block"}`}>
      <Card className="rounded-none border-0 bg-white shadow-none h-full flex flex-col md:bg-gradient-to-b md:from-white md:to-gray-50/50 md:border md:border-gray-200 md:rounded-2xl md:shadow-lg">
        <CardHeader className="pb-3 border-b border-gray-100 md:border-gray-200 md:bg-gradient-to-r md:from-gray-50 md:to-white md:rounded-t-2xl">
          {/* App bar — mobile only */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              aria-label={t("back")}
              onClick={onBackToList}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 active:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-gray-800">
              {t("title")}
            </h1>
          </div>
          <div className="flex items-center gap-2 ps-1 md:hidden">
            {getStatusBadge(displayRequest.status, getStatusLabel)}
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {getTypeIcon(displayRequest.type)}
              {displayRequest.type === "chat" ? t("typeChat") : t("typeVideo")}
            </span>
          </div>

          {/* Header row — md and up (unchanged design) */}
          <div className="hidden items-center justify-between md:flex">
            <div className="flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToList}
                  className="lg:hidden"
                >
                  <ChevronLeft className="w-4 h-4 ml-1" />
                  {t("back")}
                </Button>
              )}
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#32A88D]" />
                {t("title")}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {getTypeIcon(displayRequest.type)}
              <div className="scale-75 sm:scale-100 origin-right">
                {getStatusBadge(displayRequest.status, getStatusLabel)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="h-full">{renderDetailsContent()}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 md:mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
        {title}
      </h3>
      <div className="divide-y divide-gray-100 md:divide-y-0 md:space-y-4">
        {children}
      </div>
    </div>
  );
}

function FieldRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 md:p-4 md:bg-white md:rounded-xl md:border md:border-gray-100 md:shadow-sm">
      {Icon && (
        <div className="hidden md:block p-1 sm:p-2 bg-[#32A88D]/10 rounded-lg">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5 md:text-sm md:text-gray-600 md:mb-1">
          {label}
        </p>
        <div className="font-semibold text-gray-800 text-sm sm:text-base break-words">
          {value}
        </div>
      </div>
    </div>
  );
}