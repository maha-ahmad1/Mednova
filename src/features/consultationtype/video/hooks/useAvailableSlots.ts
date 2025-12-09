"use client";

import { useQuery } from "@tanstack/react-query";
import { slotsApi, CheckAvailableSlotsParams } from "@/app/api/slots";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { useSession } from "next-auth/react";

interface UseAvailableSlotsParams
  extends Omit<CheckAvailableSlotsParams, "date" | "day"> {
  selectedDate?: Date;
  enabled?: boolean;
  token?: string;
}

export const useAvailableSlots = ({
  consultant_id,
  consultant_type,
  selectedDate,
  type_appointment,
  patient_id,
  enabled = true,
}: UseAvailableSlotsParams) => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  // تحويل التاريخ إلى الصيغة المطلوبة
  const getFormattedParams = () => {
    if (!selectedDate) return null;

    // تحويل التاريخ إلى تنسيق YYYY-MM-DD
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    // الحصول على اليوم بالأنجليزية (Monday, Tuesday, etc.)
    const day = format(selectedDate, "EEEE", { locale: ar });

    // تحويل اليوم إلى الإنجليزية للـ API
    const dayMap: Record<string, string> = {
      'الأحد': 'Sunday',
      'الاثنين': 'Monday',
      'الثلاثاء': 'Tuesday',
      'الأربعاء': 'Wednesday',
      'الخميس': 'Thursday',
      'الجمعة': 'Friday',
      'السبت': 'Saturday',
    };

    return {
      consultant_id,
      consultant_type,
      day: dayMap[day] || day,
      date: dateStr,
      type_appointment,
      patient_id,
    };
  };

  const params = getFormattedParams();

  return useQuery({
    queryKey: ["availableSlots", params ],
    queryFn: () => {
      if (!params) throw new Error("No date selected");
      return slotsApi.checkAvailableSlots(params, token);
    },
    enabled: enabled && !!params && !!token,  
    select: (data) => {
      if (!data.success) return [];

      // تحويل الفتحات إلى تنسيق الوقت فقط (HH:mm)
      return data.data.available_slots.map((slot) => {
        try {
          const date = parseISO(slot);
          return format(date, "HH:mm");
        } catch (error) {
          console.error("Error parsing slot:", slot, error);
          return slot.split(" ")[1]; // استخراج الوقت مباشرة
        }
      });
    },
    onError: (error) => {
      console.error("Error fetching available slots:", error);
    },
  });
};
