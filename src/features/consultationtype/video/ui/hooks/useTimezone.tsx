// // hooks/useTimezone.ts
// import { useState, useEffect, useCallback } from 'react';
// import { TimeZoneService } from '@/lib/timezone-service';

// export const useTimezone = (customerId?: number) => {
//   const [userTimezone, setUserTimezone] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // جلب المنطقة الزمنية المحفوظة للمستخدم
//   const fetchUserTimezone = useCallback(async () => {
//     if (!customerId) {
//       // إذا لم يكن هناك customerId، نستخدم المنطقة المكتشفة
//       const detectedZone = TimeZoneService.detectUserTimeZone();
//       setUserTimezone(detectedZone);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       // جلب المنطقة الزمنية من API
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/get-timezone?customer_id=${customerId}`);
      
//       if (!response.ok) {
//         throw new Error('فشل جلب المنطقة الزمنية');
//       }

//       const data = await response.json();
      
//       if (data.timezone && TimeZoneService.isValidTimezone(data.timezone)) {
//         setUserTimezone(data.timezone);
//       } else {
//         // إذا لم تكن المنطقة صالحة، نستخدم المنطقة المكتشفة
//         const detectedZone = TimeZoneService.detectUserTimeZone();
//         setUserTimezone(detectedZone);
//       }
//     } catch (err) {
//       console.error('خطأ في جلب المنطقة الزمنية:', err);
//       setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف');
      
//       // استخدام المنطقة المكتشفة كبديل
//       const detectedZone = TimeZoneService.detectUserTimeZone();
//       setUserTimezone(detectedZone);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [customerId]);

//   // تحديث المنطقة الزمنية في API
//   const updateUserTimezone = useCallback(async (timezone: string) => {
//     if (!customerId || !TimeZoneService.isValidTimezone(timezone)) {
//       return false;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/update-timezone`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           customer_id: customerId,
//           timezone
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('فشل تحديث المنطقة الزمنية');
//       }

//       setUserTimezone(timezone);
//       return true;
//     } catch (err) {
//       console.error('خطأ في تحديث المنطقة الزمنية:', err);
//       setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف');
//       return false;
//     }
//   }, [customerId]);

//   // تحويل الوقت بين المناطق
//   const convertTime = useCallback((
//     time: string,
//     fromZone: string,
//     toZone: string,
//     date?: Date
//   ): string => {
//     return TimeZoneService.convertTimeBetweenZones(time, fromZone, toZone, date);
//   }, []);

//   // تنسيق التاريخ حسب المنطقة الزمنية
//   const formatDate = useCallback((date: Date, format: string): string => {
//     if (!userTimezone) return date.toLocaleDateString();
//     return TimeZoneService.formatDateTime(date, format, userTimezone);
//   }, [userTimezone]);

//   // اكتشاف المنطقة الحالية
//   const detectTimezone = useCallback((): string => {
//     return TimeZoneService.detectUserTimeZone();
//   }, []);

//   useEffect(() => {
//     fetchUserTimezone();
//   }, [fetchUserTimezone]);

//   return {
//     userTimezone,
//     isLoading,
//     error,
//     setUserTimezone,
//     updateUserTimezone,
//     convertTime,
//     formatDate,
//     detectTimezone,
//     refetch: fetchUserTimezone
//   };
// };