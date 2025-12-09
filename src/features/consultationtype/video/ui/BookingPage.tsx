"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  MapPin,
  Clock,
  CalendarIcon,
  Loader2,
  Globe,
  ChevronDown,
  RefreshCw,
  Video,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useFetcher } from "@/hooks/useFetcher";
import BookingPageSkeleton from "./BookingPageSkeleton";
import Image from "next/image";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConsultationTypeStore } from "@/store/ConsultationTypeStore";
import { useConsultationRequestStore } from "@/features/home/hooks/useConsultationRequestStore";

// المناطق الزمنية المتاحة
const timeZones = [
  { id: "gmt+3", label: "توقيت الرياض (GMT+3)", offset: "+03:00" },
  { id: "gmt+4", label: "توقيت دبي (GMT+4)", offset: "+04:00" },
  { id: "gmt+2", label: "توقيت القاهرة (GMT+2)", offset: "+02:00" },
  { id: "gmt+5", label: "توقيت باكستان (GMT+5)", offset: "+05:00" },
];

interface BookingPageProps {
  doctorId?: string;
  patientId?: string;
}

// Minimal provider shape used in this component
interface Provider {
  full_name?: string;
  image?: string;
  type_account?: string;
  therapist_details?: { medical_specialties?: { name?: string } };
  center_details?: { services?: { name?: string }[] };
  location_details?: { formatted_address?: string };
}

export default function BookingPage({ doctorId, patientId }: BookingPageProps) {
  const { currentConsultation, clearConsultation } = useConsultationTypeStore();
  const effectiveDoctorId = doctorId || currentConsultation?.providerId;

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("gmt+3");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: provider, isLoading: isLoadingProvider } =
    useFetcher<Provider | null>(
      ["providerProfile", effectiveDoctorId],
      effectiveDoctorId ? `/api/customer/${effectiveDoctorId}` : null
    );

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const consultantType = useMemo(() => {
    if (currentConsultation?.consultantType) {
      return currentConsultation.consultantType;
    }
    return provider?.type_account === "therapist"
      ? "therapist"
      : "rehabilitation_center";
  }, [currentConsultation, provider]);

  const {
    data: availableSlotsRaw,
    isLoading: isLoadingSlots,
    refetch: refetchSlots,
  } = useAvailableSlots({
    consultant_id: effectiveDoctorId || "",
    consultant_type: consultantType,
    selectedDate,
    type_appointment: "online",
    patient_id: patientId,
    enabled: !!selectedDate && !!effectiveDoctorId && !!session?.user?.id,
  });
  const availableSlots = useMemo(
    () => (availableSlotsRaw ?? []) as string[],
    [availableSlotsRaw]
  );
  const { storeConsultationRequest, Loading: isSubmitting } =
    useConsultationRequestStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedDate && session?.user?.id) {
      refetchSlots();
    }
  }, [selectedDate, refetchSlots, session?.user?.id]);

  const getEnglishDay = (date: Date): string => {
    const dayMap: Record<string, string> = {
      الأحد: "Sunday",
      الاثنين: "Monday",
      الثلاثاء: "Tuesday",
      الأربعاء: "Wednesday",
      الخميس: "Thursday",
      الجمعة: "Friday",
      السبت: "Saturday",
    };

    const arabicDay = format(date, "EEEE", { locale: ar });
    return dayMap[arabicDay] || format(date, "EEEE", { locale: enUS });
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("الرجاء اختيار التاريخ والوقت");
      return;
    }

    if (!session?.user?.id) {
      // toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!effectiveDoctorId) {
      toast.error("لا يوجد معرف للمستشار");
      return;
    }

    try {
      const consultationData = {
        patient_id: session.user.id,
        consultant_id: effectiveDoctorId,
        consultant_type: consultantType,
        consultant_nature: "video",
        requested_day: getEnglishDay(selectedDate),
        requested_time: `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime}`,
        type_appointment: "online",
      };

      console.log("بيانات الحجز:", consultationData);

      

      await storeConsultationRequest(consultationData);
      router.push("/payment");

      clearConsultation();

      toast.success(
        "تم حجز الموعد بنجاح، سيتم إرسال التأكيد إلى بريدك الإلكتروني"
      );

      setSelectedTime("");
      setSelectedDate(undefined);
    } catch (error) {
      console.error("خطأ في الحجز:", error);
      toast.error("حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى");
    }
  };

  const handleTimeZoneSelect = (timeZoneId: string) => {
    setSelectedTimeZone(timeZoneId);
    setShowTimeZoneDropdown(false);
  };

  const getSelectedTimeZoneLabel = () => {
    const timeZone = timeZones.find((tz) => tz.id === selectedTimeZone);
    return timeZone ? timeZone.label : "اختر المنطقة الزمنية";
  };

  const getSpecialty = () => {
    if (consultantType === "therapist") {
      return (
        provider?.therapist_details?.medical_specialties?.name || "تخصص المختص"
      );
    } else {
      return provider?.center_details?.services?.[0]?.name || "خدمات تأهيلية";
    }
  };

  const getAddress = () => {
    return provider?.location_details?.formatted_address || "عنوان غير محدد";
  };

  const getProviderImage = () => {
    if (provider?.image) {
      return provider.image;
    }
    return consultantType === "therapist"
      ? "/default-doctor.png"
      : "/default-center.png";
  };

  const getProviderIcon = () => {
    return consultantType === "therapist" ? Users : Building2;
  };

  const ProviderIcon = getProviderIcon();

  const groupedSlots = useMemo(() => {
    const groups = {
      morning: [] as string[],
      afternoon: [] as string[],
      evening: [] as string[],
    };

    availableSlots.forEach((slot) => {
      const hour = Number.parseInt(slot.split(":")[0]);

      if (hour < 12) {
        groups.morning.push(slot);
      } else if (hour < 17) {
        groups.afternoon.push(slot);
      } else {
        groups.evening.push(slot);
      }
    });

    groups.morning.sort();
    groups.afternoon.sort();
    groups.evening.sort();

    return groups;
  }, [availableSlots]);

  const formatDateArabic = (date: Date) => {
    return format(date, "dd MMMM yyyy", { locale: ar });
  };

  // if (status === "loading") {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader2 className="w-8 h-8 animate-spin text-[#32A88D]" />
  //       {/* <span className="mr-2">جاري التحقق من المصادقة...</span> */}
  //     </div>
  //   );
  // }

  // if (!session) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen px-4">
  //       <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
  //         <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
  //           <Video className="w-8 h-8 text-red-600" />
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح</h2>
  //         <p className="text-gray-600 mb-6">
  //           يجب تسجيل الدخول لحجز موعد استشارة
  //         </p>
  //         <Button
  //           onClick={() => router.push("/login")}
  //           className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white"
  //         >
  //           تسجيل الدخول
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  if (isPageLoading || isLoadingProvider) {
    return <BookingPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-2">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-4 sm:px-6 py-2 rounded-full mb-3 sm:mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium text-[#32A88D]">
              حجز المواعيد
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
            حجز موعد استشارة بالفيديو
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            اختر التاريخ والوقت المناسبين لحجز موعد استشارتك مع{" "}
            {consultantType === "therapist" ? "المختص" : "المركز"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center mb-3 sm:mb-4 overflow-hidden">
                  <Image
                    src={getProviderImage() || "/placeholder.svg"}
                    alt={
                      provider?.full_name ||
                      (consultantType === "therapist" ? "المختص" : "المركز")
                    }
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {provider?.full_name || "غير محدد"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {getSpecialty()}
                </p>

                <div className="flex items-center gap-2 mt-3 sm:mt-4 text-gray-500">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-center">
                    {getAddress()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  معلومات الحجز
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {/* <div className="flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base text-gray-600">
                      نوع المزود
                    </span>
                    <Badge
                      className={cn(
                        "hover:bg-opacity-90 text-xs sm:text-sm",
                        consultantType === "therapist"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                      )}
                    >
                      <ProviderIcon className="w-3 h-3 mr-1" />
                      {consultantType === "therapist" ? "معالج" : "مركز تأهيل"}
                    </Badge>
                  </div> */}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base text-gray-600">
                      الخدمة
                    </span>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm max-w-[60%] truncate">
                      {getSpecialty()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base text-gray-600">
                      المدة
                    </span>
                    <span className="text-sm sm:text-base font-medium">
                      45 دقيقة
                    </span>
                  </div>

                  {selectedDate && selectedTime && (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base text-gray-600">
                          التاريخ
                        </span>
                        <div className="text-right">
                          <div className="text-sm sm:text-base font-medium">
                            {formatDateArabic(selectedDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm sm:text-base text-gray-600">
                          الوقت
                        </span>
                        <div className="text-right">
                          <div className="text-sm sm:text-base font-medium">
                            {selectedTime}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base text-gray-600">
                      نوع الموعد
                    </span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs sm:text-sm">
                      <Video className="w-3 h-3 mr-1" />
                      استشارة فيديو
                    </Badge>
                  </div>

                  {/* <div className="flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base text-gray-600">
                      الحالة
                    </span>
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs sm:text-sm">
                      في انتظار التأكيد
                    </Badge>
                  </div> */}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-[#32A88D] text-[#32A88D]  rounded-xl py-5 sm:py-6 text-sm sm:text-base cursor-pointer hover:bg-[#32A88D]/10 hover:border-[#2a8a7a] hover:text-[#2a8a7a] transition-colors flex items-center justify-center"
              onClick={() => router.back()}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              الرجوع
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
                <div className="p-4 sm:p-6 order-1 xl:order-1 relative">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        اختر التاريخ
                      </h3>
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6 w-full max-w-[350px] mx-auto ">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date || undefined);
                        setSelectedTime("");
                      }}
                      className="rounded-md  !cursor-pointer w-full"
                      timeZone={timeZone}
                      disabled={(date) => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        return date < yesterday;
                      }}
                    />
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          المنطقة الزمنية
                        </span>
                      </div>
                    </div>

                    <div className="relative z-20">
                      <button
                        type="button"
                        onClick={() =>
                          setShowTimeZoneDropdown(!showTimeZoneDropdown)
                        }
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-xs sm:text-sm truncate ">
                            {getSelectedTimeZoneLabel()}
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-gray-500 transition-transform flex-shrink-0",
                            showTimeZoneDropdown && "rotate-180"
                          )}
                        />
                      </button>

                      {showTimeZoneDropdown && (
                        <div className="absolute left-0 right-0 z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {timeZones.map((tz) => (
                            <button
                              key={tz.id}
                              type="button"
                              onClick={() => handleTimeZoneSelect(tz.id)}
                              className={cn(
                                "cursor-pointer w-full text-right px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors text-xs sm:text-sm first:rounded-t-xl last:rounded-b-xl",
                                selectedTimeZone === tz.id &&
                                  "bg-[#32A88D]/10 text-[#32A88D] font-medium"
                              )}
                            >
                              {tz.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Globe className="w-3 h-3" />
                      <span>
                        جميع الأوقات محسوبة حسب المنطقة الزمنية المحددة
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 order-2 xl:order-2">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        اختر الوقت
                      </h3>
                    </div>

                    {/* {selectedDate && (
                      <button
                        type="button"
                        onClick={() => refetchSlots()}
                        disabled={isLoadingSlots}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-[#32A88D] hover:text-[#2a8a7a] transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={cn("w-3 h-3 sm:w-4 sm:h-4", isLoadingSlots && "animate-spin")} />
                        <span className="hidden sm:inline">تحديث</span>
                      </button>
                    )} */}
                  </div>

                  {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-2 md:mt-26 ">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#32A88D]" />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-700 mb-2">
                        الرجاء اختيار تاريخ أولاً
                      </p>
                    </div>
                  ) : isLoadingSlots ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:mt-26 ">
                      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-[#32A88D] mb-3 sm:mb-4" />
                      <p className="text-xs sm:text-sm text-gray-500">
                        جاري تحميل الأوقات المتاحة...
                      </p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-2 md:mt-26  ">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#32A88D]" />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-gray-700 mb-2">
                        لا توجد أوقات متاحة
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        يرجى اختيار تاريخ آخر
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar pt-4">
                      {groupedSlots.morning.length > 0 && (
                        <div className="mb-10">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            الفترة الصباحية
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {groupedSlots.morning.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                  "cursor-pointer px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 transition-all text-xs sm:text-sm font-medium",
                                  selectedTime === time
                                    ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white border-[#32A88D] shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#32A88D] hover:bg-[#32A88D]/5"
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {groupedSlots.afternoon.length > 0 && (
                        <div className="mb-10">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            بعد الظهر
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {groupedSlots.afternoon.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                  "cursor-pointer px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 transition-all text-xs sm:text-sm font-medium",
                                  selectedTime === time
                                    ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white border-[#32A88D] shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#32A88D] hover:bg-[#32A88D]/5"
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {groupedSlots.evening.length > 0 && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            الفترة المسائية
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {groupedSlots.evening.map((time) => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                  "cursor-pointer px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 transition-all text-xs sm:text-sm font-medium",
                                  selectedTime === time
                                    ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white border-[#32A88D] shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#32A88D] hover:bg-[#32A88D]/5"
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className=" ">
              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || isSubmitting}
              className="cursor-pointer w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>جاري الحجز...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>تأكيد الحجز</span>
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </Button>

              {/* {!selectedDate || !selectedTime ? (
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 sm:mt-4">
                  يرجى اختيار التاريخ والوقت لتفعيل زر الحجز
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 text-center mt-3 sm:mt-4">
                  بالضغط على تأكيد الحجز فإنك توافق على شروط وأحكام الخدمة
                </p>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
