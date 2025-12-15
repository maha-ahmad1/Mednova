"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useFetcher } from "@/hooks/useFetcher";
import type { ServiceProvider } from "@/features/service-provider/types/provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConsultationTypeStore } from "@/store/ConsultationTypeStore";
import { useConsultationRequestStore } from "@/features/home/hooks/useConsultationRequestStore";
import { ar, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { slotsApi, type CheckAvailableSlotsParams } from "@/app/api/slots";
// import type { Provider } from "@/types/Provider" // Declare the Provider type

// تم إزالة timeZones الثابتة لأنها ستستورد من TimeZoneService

export function useBookingLogic({
  doctorId,
  patientId,
}: {
  doctorId?: string;
  patientId?: string;
}) {
  const { currentConsultation, clearConsultation, setConsultation } =
    useConsultationTypeStore();
  const effectiveDoctorId = doctorId || currentConsultation?.providerId;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [groupedSlots, setGroupedSlots] = useState({
    morning: [] as string[],
    afternoon: [] as string[],
    evening: [] as string[],
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: provider, isLoading: isLoadingProvider } =
    useFetcher<ServiceProvider | null>(
      ["providerProfile", effectiveDoctorId],
      effectiveDoctorId ? `/api/customer/${effectiveDoctorId}` : null
    );

  // اكتشاف المنطقة الزمنية للمستخدم عند التحميل
  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedTimeZone(detectedTimeZone);
  }, []);

  const consultantType = useMemo(() => {
    if (currentConsultation?.consultantType)
      return currentConsultation.consultantType;
    return provider?.type_account === "therapist"
      ? "therapist"
      : "rehabilitation_center";
  }, [currentConsultation, provider]);

  // دالة للحصول على التوكن بشكل آمن
  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token") || "";
    }
    return "";
  }, []);

  const ensureDate = useCallback(
    (date: Date | string | null | undefined): Date | null => {
      if (!date) return null;

      // If already a Date object, return it
      if (date instanceof Date) {
        return isNaN(date.getTime()) ? null : date;
      }

      // If it's a string, try to convert it
      if (typeof date === "string") {
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      return null;
    },
    []
  );

  // دالة لتحميل الأوقات المتاحة مع المنطقة الزمنية
  const loadAvailableSlots = useCallback(
    async (date: Date, timezone: string) => {
      const validDate = ensureDate(date);
      if (!validDate) {
        console.error("تاريخ غير صحيح:", date);
        setGroupedSlots({ morning: [], afternoon: [], evening: [] });
        return;
      }

      if (!effectiveDoctorId || !consultantType || !validDate) {
        console.error("بيانات غير كافية لتحميل الأوقات");
        setGroupedSlots({ morning: [], afternoon: [], evening: [] });
        return;
      }

      setIsLoadingSlots(true);

      try {
        // تنسيق التاريخ بشكل مناسب للـ API
        const formattedDate = validDate.toISOString().split("T")[0]; // YYYY-MM-DD
        // const dayName = getArabicDayName(date);
        const dayName = getEnglishDay(validDate);
        console.log("بيانات طلب الأوقات:", {
          date: formattedDate,
          dayName,
          timezone,
          doctorId: effectiveDoctorId,
          consultantType,
        });

        // معلمات الـ API
        const params: CheckAvailableSlotsParams = {
          consultant_id: effectiveDoctorId,
          consultant_type: consultantType,
          day: dayName,
          date: formattedDate,
          type_appointment: "online",
          patient_id: patientId || session?.user?.id,
        };

        const token = getAuthToken();
        console.log("جاري طلب الأوقات المتاحة من API...");

        // استدعاء الـ API الحقيقي
        const response = await slotsApi.checkAvailableSlots(params, token);

        console.log("استجابة API للأوقات المتاحة:", response);

        if (
          response.success &&
          response.data &&
          response.data.available_slots
        ) {
          const slots = response.data.available_slots;
          console.log("الأوقات المستلمة:", slots);

          // تصنيف الأوقات إلى فترات
          const morningSlots: string[] = [];
          const afternoonSlots: string[] = [];
          const eveningSlots: string[] = [];

          slots.forEach((slot) => {
            // تنظيف وتنسيق الوقت
            const cleanSlot = slot.trim();
            const timeMatch = cleanSlot.match(/(\d{1,2}):(\d{2})/);

            if (timeMatch) {
              const hour = Number.parseInt(timeMatch[1]);
              const minute = timeMatch[2];
              const formattedTime = `${hour
                .toString()
                .padStart(2, "0")}:${minute}`;

              if (hour >= 17 && hour < 23) {
                eveningSlots.push(formattedTime);
              } else if (hour >= 4 && hour < 12) {
                morningSlots.push(formattedTime);
              } else if (hour >= 12 && hour < 17) {
                afternoonSlots.push(formattedTime);
              } else {
                eveningSlots.push(formattedTime);
              }
            }
          });

          // ترتيب الأوقات تصاعدياً
          morningSlots.sort((a, b) => a.localeCompare(b));
          afternoonSlots.sort((a, b) => a.localeCompare(b));
          eveningSlots.sort((a, b) => a.localeCompare(b));

          setGroupedSlots({
            morning: morningSlots,
            afternoon: afternoonSlots,
            evening: eveningSlots,
          });

          console.log("الأوقات المصنفة بنجاح");
        } else {
          console.warn("لا توجد أوقات متاحة لهذا اليوم");
          setGroupedSlots({ morning: [], afternoon: [], evening: [] });
        }
      } catch (error: unknown) {
        console.error("خطأ في تحميل الأوقات المتاحة:", error);

        // عرض تفاصيل الخطأ إن وُجدت بشكل آمن
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          error !== null
        ) {
          const err = error as { response?: { data?: unknown } };
          console.error("تفاصيل الخطأ:", err.response?.data);
        }

        setGroupedSlots({ morning: [], afternoon: [], evening: [] });
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [
      effectiveDoctorId,
      consultantType,
      patientId,
      session?.user?.id,
      getAuthToken,
      ensureDate,
    ]
  );

  // tأثير عند تغيير التاريخ أو المنطقة الزمنية
  useEffect(() => {
    if (selectedDate && selectedTimeZone) {
      console.log("تغيير التاريخ أو المنطقة الزمنية، جاري تحميل الأوقات...");
      loadAvailableSlots(selectedDate, selectedTimeZone);
      setSelectedTime(""); // إعادة تعيين الوقت المحدد
    } else if (!selectedDate || !selectedTimeZone) {
      setGroupedSlots({ morning: [], afternoon: [], evening: [] });
    }
  }, [selectedDate, selectedTimeZone, loadAvailableSlots]);

  // تأثير لتحديث المنطقة الزمنية للمستخدم عند التحميل
  useEffect(() => {
    if (!selectedTimeZone && provider) {
      const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSelectedTimeZone(detectedTimeZone);
      console.log("تعيين المنطقة الزمنية التلقائية:", detectedTimeZone);
    }
  }, [provider, selectedTimeZone]);

  const handleTimeZoneChange = useCallback(
    (newTimeZone?: string) => {
      if (!newTimeZone) return;
      console.log("تغيير المنطقة الزمنية إلى:", newTimeZone);
      setSelectedTimeZone(newTimeZone);

      // إعادة تحميل الأوقات إذا كان هناك تاريخ محدد
      if (selectedDate) {
        loadAvailableSlots(selectedDate, newTimeZone);
      }
    },
    [selectedDate]
  );

  const handleSelectDate = useCallback(
    (date: Date | undefined | string) => {
      if (date === undefined) {
        setSelectedDate(undefined);
      } else {
        const validDate = ensureDate(date);
        setSelectedDate(validDate || undefined);
      }
      if (date) {
        setSelectedTime(""); // إعادة تعيين الوقت عند تغيير التاريخ
      }
    },
    [ensureDate]
  );

  const handleSelectTime = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const { storeConsultationRequest, Loading: isSubmitting } =
    useConsultationRequestStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
      router.push("/login");
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
        // timezone: selectedTimeZone, // إضافة المنطقة الزمنية
      };

      console.log("بيانات الحجز المرسلة للـAPI:", {
        requested_time: `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime}`,
        selectedDate: selectedDate,
        selectedDateUTC: selectedDate?.toISOString(),
        selectedDateLocal: selectedDate?.toLocaleString(),
        timezone: selectedTimeZone,
      });

      await storeConsultationRequest(consultationData);

      setConsultation({
        providerId: effectiveDoctorId,
        providerName: provider?.full_name || "غير محدد",
        consultationType: "video",
        consultantType: consultantType,
        requestedDay: getEnglishDay(selectedDate),
        requestedTime: `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime}`,
        appointmentType: "online",
        // timezone: selectedTimeZone, // إضافة المنطقة الزمنية
      });

      router.push("/payment");

      setSelectedTime("");
      setSelectedDate(undefined);
    } catch (error) {
      console.error("❌ خطأ في حجز الفيديو:", error);
      toast.error("حدث خطأ أثناء الحجز");
    }
  };

  const getSpecialty = () => {
    if (consultantType === "therapist")
      return (
        provider?.therapist_details?.medical_specialties?.name || "تخصص المختص"
      );
    return provider?.center_details?.services?.[0]?.name || "خدمات تأهيلية";
  };

  const getAddress = () =>
    provider?.location_details?.formatted_address || "عنوان غير محدد";

  const getProviderImage = () =>
    provider?.image ||
    (consultantType === "therapist"
      ? "/default-doctor.png"
      : "/default-center.png");

  const getProviderIcon = () =>
    consultantType === "therapist" ? "Users" : "Building2";

  const formatDateArabic = (date: Date) =>
    format(date, "dd MMMM yyyy", { locale: ar });

  // حساب عدد الأوقات المتاحة
  const availableSlotsLength = useMemo(
    () =>
      groupedSlots.morning.length +
      groupedSlots.afternoon.length +
      groupedSlots.evening.length,
    [groupedSlots]
  );

  // تحويل الأوقات إلى مصفوفة مسطحة إذا لزم الأمر
  const availableSlots = useMemo(
    () => [
      ...groupedSlots.morning,
      ...groupedSlots.afternoon,
      ...groupedSlots.evening,
    ],
    [groupedSlots]
  );

  return {
    // state
    selectedDate,
    setSelectedDate: handleSelectDate,
    selectedTime,
    setSelectedTime: handleSelectTime,
    selectedTimeZone,
    setSelectedTimeZone: handleTimeZoneChange,
    timeZone: selectedTimeZone,
    setTimeZone: handleTimeZoneChange,
    isPageLoading,
    isLoadingProvider,
    isLoadingSlots,
    // data
    provider,
    providerType: consultantType,
    availableSlots,
    groupedSlots,
    availableSlotsLength,
    // actions
    handleBooking,
    isSubmitting,
    loadAvailableSlots,
    // utils
    getEnglishDay,
    formatDateArabic,
    getSpecialty,
    getAddress,
    getProviderImage,
    getProviderIcon,
    clearConsultation,
  } as const;
}
