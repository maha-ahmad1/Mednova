"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFetcher } from "@/hooks/useFetcher";
// import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConsultationTypeStore } from "@/store/ConsultationTypeStore";
import { useConsultationRequestStore } from "@/features/home/hooks/useConsultationRequestStore";
import { ar, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { useAvailableSlots } from "@/features/consultationtype/video/hooks/useAvailableSlots";


const timeZones = [
  { id: "gmt+3", label: "توقيت الرياض (GMT+3)", offset: "+03:00" },
  { id: "gmt+4", label: "توقيت دبي (GMT+4)", offset: "+04:00" },
  { id: "gmt+2", label: "توقيت القاهرة (GMT+2)", offset: "+02:00" },
  { id: "gmt+5", label: "توقيت باكستان (GMT+5)", offset: "+05:00" },
];

interface Provider {
  full_name?: string;
  image?: string;
  type_account?: string;
  therapist_details?: { medical_specialties?: { name?: string } };
  center_details?: { services?: { name?: string }[] };
  location_details?: { formatted_address?: string };
}

export function useBookingLogic({ doctorId, patientId }: { doctorId?: string; patientId?: string }) {
  const { currentConsultation, clearConsultation, setConsultation } = useConsultationTypeStore();
  const effectiveDoctorId = doctorId || currentConsultation?.providerId;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("gmt+3");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined);

  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: provider, isLoading: isLoadingProvider } = useFetcher<Provider | null>(["providerProfile", effectiveDoctorId], effectiveDoctorId ? `/api/customer/${effectiveDoctorId}` : null);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const consultantType = useMemo(() => {
    if (currentConsultation?.consultantType) return currentConsultation.consultantType;
    return provider?.type_account === "therapist" ? "therapist" : "rehabilitation_center";
  }, [currentConsultation, provider]);

  const { data: availableSlotsRaw, isLoading: isLoadingSlots, refetch: refetchSlots } = useAvailableSlots({
    consultant_id: effectiveDoctorId || "",
    consultant_type: consultantType,
    selectedDate,
    type_appointment: "online",
    patient_id: patientId,
    enabled: !!selectedDate && !!effectiveDoctorId && !!session?.user?.id,
  });

  const availableSlots = useMemo(() => (availableSlotsRaw ?? []) as string[], [availableSlotsRaw]);

  const { storeConsultationRequest, Loading: isSubmitting } = useConsultationRequestStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedDate && session?.user?.id) refetchSlots();
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
      };

      await storeConsultationRequest(consultationData);

      setConsultation({
        providerId: effectiveDoctorId,
        providerName: provider?.full_name || "غير محدد",
        consultationType: "video",
        consultantType: consultantType,
        requestedDay: getEnglishDay(selectedDate),
        requestedTime: `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime}`,
        appointmentType: "online",
      });

      router.push("/payment");

      setSelectedTime("");
      setSelectedDate(undefined);
    } catch (error) {
      console.error("❌ خطأ في حجز الفيديو:", error);
    }
  };

  const handleTimeZoneSelect = (timeZoneId: string) => setSelectedTimeZone(timeZoneId);

  const getSpecialty = () => {
    if (consultantType === "therapist") return provider?.therapist_details?.medical_specialties?.name || "تخصص المختص";
    return provider?.center_details?.services?.[0]?.name || "خدمات تأهيلية";
  };

  const getAddress = () => provider?.location_details?.formatted_address || "عنوان غير محدد";

  const getProviderImage = () => provider?.image || (consultantType === "therapist" ? "/default-doctor.png" : "/default-center.png");

  const getProviderIcon = () => (consultantType === "therapist" ? "Users" : "Building2");

  const groupedSlots = useMemo(() => {
    const groups = { morning: [] as string[], afternoon: [] as string[], evening: [] as string[] };
    availableSlots.forEach((slot) => {
      const hour = Number.parseInt(slot.split(":")[0]);
      if (hour < 12) groups.morning.push(slot);
      else if (hour < 17) groups.afternoon.push(slot);
      else groups.evening.push(slot);
    });
    groups.morning.sort(); groups.afternoon.sort(); groups.evening.sort();
    return groups;
  }, [availableSlots]);

  const formatDateArabic = (date: Date) => format(date, "dd MMMM yyyy", { locale: ar });

  return {
    // state
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedTimeZone,
    setSelectedTimeZone: handleTimeZoneSelect,
    timeZone,
    setTimeZone,
    isPageLoading,
    isLoadingProvider,
    // data
    provider,
    providerType: consultantType,
    availableSlots,
    groupedSlots,
    isLoadingSlots,
    refetchSlots,
    // actions
    handleBooking,
    isSubmitting,
    // utils
    getEnglishDay,
    formatDateArabic,
    getSpecialty,
    getAddress,
    getProviderImage,
    timeZones,
    clearConsultation,
  } as const;
}
