// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { slotsApi, CheckAvailableSlotsParams } from "@/app/api/slots";
// import { format, parseISO } from "date-fns";
// import { ar } from "date-fns/locale";
// import { useSession } from "next-auth/react";

// interface UseAvailableSlotsParams
//   extends Omit<CheckAvailableSlotsParams, "date" | "day"> {
//   selectedDate?: Date;
//   enabled?: boolean;
//   token?: string;
// }

// export const useAvailableSlots = ({
//   consultant_id,
//   consultant_type,
//   selectedDate,
//   type_appointment,
//   patient_id,
//   enabled = true,
// }: UseAvailableSlotsParams) => {
//   const { data: session } = useSession();
//   const token = session?.accessToken;
//   // تحويل التاريخ إلى الصيغة المطلوبة
//   const getFormattedParams = () => {
//     if (!selectedDate) return null;

//     // تحويل التاريخ إلى تنسيق YYYY-MM-DD
//     const dateStr = format(selectedDate, "yyyy-MM-dd");

//     // الحصول على اليوم بالأنجليزية (Monday, Tuesday, etc.)
//     const day = format(selectedDate, "EEEE", { locale: ar });

//     // تحويل اليوم إلى الإنجليزية للـ API
//     const dayMap: Record<string, string> = {
//       'الأحد': 'Sunday',
//       'الاثنين': 'Monday',
//       'الثلاثاء': 'Tuesday',
//       'الأربعاء': 'Wednesday',
//       'الخميس': 'Thursday',
//       'الجمعة': 'Friday',
//       'السبت': 'Saturday',
//     };

//     return {
//       consultant_id,
//       consultant_type,
//       day: dayMap[day] || day,
//       date: dateStr,
//       type_appointment,
//       patient_id,
//     };
//   };

//   const params = getFormattedParams();

//   return useQuery({
//     queryKey: ["availableSlots", params ],
//     queryFn: () => {
//       if (!params) throw new Error("No date selected");
//       return slotsApi.checkAvailableSlots(params, token);
//     },
//     enabled: enabled && !!params && !!token,  
//     select: (data) => {
//       if (!data.success) return [];

//       // تحويل الفتحات إلى تنسيق الوقت فقط (HH:mm)
//       return data.data.available_slots.map((slot) => {
//         try {
//           const date = parseISO(slot);
//           return format(date, "HH:mm");
//         } catch (error) {
//           console.error("Error parsing slot:", slot, error);
//           return slot.split(" ")[1]; // استخراج الوقت مباشرة
//         }
//       });
//     },
//     onError: (error) => {
//       console.error("Error fetching available slots:", error);
//     },
//   });
// };


"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { slotsApi, CheckAvailableSlotsParams } from "@/app/api/slots";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { useSession } from "next-auth/react";

interface UseAvailableSlotsParams
  extends Omit<CheckAvailableSlotsParams, "date" | "day"> {
  selectedDate?: Date;
  enabled?: boolean;
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

  // ------------------------
  // 1) استخدام useMemo مع التخزين المؤقت
  // ------------------------
  const { params, shouldFetch } = useMemo(() => {
    if (!selectedDate || !consultant_id || !consultant_type || !token || !enabled) {
      return { params: null, shouldFetch: false };
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const day = format(selectedDate, "EEEE", { locale: ar });

    const dayMap: Record<string, string> = {
      "الأحد": "Sunday",
      "الاثنين": "Monday",
      "الثلاثاء": "Tuesday",
      "الأربعاء": "Wednesday",
      "الخميس": "Thursday",
      "الجمعة": "Friday",
      "السبت": "Saturday",
    };

    return {
      params: {
        consultant_id,
        consultant_type,
        day: dayMap[day] || day,
        date: dateStr,
        type_appointment,
        patient_id,
      },
      shouldFetch: true,
    };
  }, [
    selectedDate,
    consultant_id,
    consultant_type,
    type_appointment,
    patient_id,
    enabled,
    token,
  ]);

  // ------------------------
  // 2) إضافة إعدادات لمنع التكرار
  // ------------------------
  return useQuery({
    queryKey: ["availableSlots", params?.consultant_id, params?.date],
    queryFn: async () => {
      if (!params) {
        throw new Error("No valid parameters");
      }
      
      try {
        const response = await slotsApi.checkAvailableSlots(params, token!);
        
        // التحقق من وجود بيانات صحيحة
        if (!response.success || !response.data?.available_slots) {
          return []; // إرجاع مصفوفة فارغة بدلاً من خطأ
        }
        
        return response.data.available_slots;
      } catch (error: any) {
        // التعامل مع حالة 422 بشكل صريح
        if (error?.status === 422) {
          return []; // لا توجد مواعيد متاحة
        }
        throw error;
      }
    },
    enabled: shouldFetch,
    
    // إعدادات مهمة لتحسين الأداء
    staleTime: 5 * 60 * 1000, // 5 دقائق قبل إعادة الجلب
    gcTime: 10 * 60 * 1000, // 10 دقائق للتخزين المؤقت
    retry: 1, // محاولة واحدة فقط عند الفشل
    retryDelay: 1000, // تأخير ثانية واحدة قبل إعادة المحاولة
    
    // إعدادات لمنع الطلبات غير الضرورية
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    
    // ------------------------
    // 3) فلترة البيانات بأمان
    // ------------------------
    select: (data) => {
      if (!Array.isArray(data)) return [];
      
      const slots = data.map((slot) => {
        try {
          const date = parseISO(slot);
          return format(date, "HH:mm");
        } catch {
          // محاولات بديلة لفهم التنسيق
          if (slot.includes('T')) {
            const timePart = slot.split('T')[1]?.substring(0, 5);
            return timePart || slot;
          }
          if (slot.includes(' ')) {
            return slot.split(' ')[1]?.substring(0, 5) || slot;
          }
          return slot;
        }
      }).filter((slot): slot is string => {
        // فلترة الأوقات غير الصالحة
        return typeof slot === 'string' && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(slot);
      }).sort(); // ترتيب الأوقات

      return slots;
    },

    onError: (err) => {
       console.error("Error fetching available slots:", err);
      // يمكن إضافة إشعار خطأ هنا إذا لزم الأمر
    },
  });
};