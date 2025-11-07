"use client";

import type React from "react";
import type { ConsultationRequest } from "@/types/consultation";
import { User, Mail, Phone, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStatusBadge, getTypeIcon } from "@/lib/consultation-helpers";
import ConsultationActions from "./ConsultationActions";
import { useSession } from "next-auth/react";

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

  // const role =
  //   session?.role === "consultable"
  //     ? "consultable"
  //     : session?.role === "patient"
  //     ? "patient"
  //     : undefined;

  return (
    <div className={`lg:col-span-2 ${isMobile ? "block" : "block"}`}>
      <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg h-full">
        <CardHeader className="pb-3 sm:pb-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
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
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3 flex-1">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#32A88D]" />
              تفاصيل الاستشارة
            </CardTitle>
            <div className="flex items-center gap-1 sm:gap-2">
              {getTypeIcon(request.type)}
              <div className="scale-75 sm:scale-100 origin-right">
                {getStatusBadge(request.status)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {/* عرض البيانات حسب الدور */}
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
                  <InfoCard
                    icon={Phone}
                    label="رقم الهاتف"
                    value={patient.phone}
                  />
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
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {getStatusBadge(request.status)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    تاريخ الإنشاء
                  </p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {new Date(request.created_at).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">الوقت</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {new Date(request.created_at).toLocaleTimeString("ar-SA")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ConsultationActions
            request={request}
            onRequestUpdate={onRequestUpdate}
            token={session?.accessToken}
            userRole={userRole}
          />
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
