export const detectUserTimeZone = (): string => {
  if (typeof window === 'undefined') return 'Asia/Riyadh'; // افتراضي للخادم
  
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('خطأ في اكتشاف المنطقة الزمنية:', error);
    return 'Asia/Riyadh'; // افتراضي
  }
};

/**
 * دالة للتحويل بين المناطق الزمنية
 */
export const convertTimeZone = (
  time: string,
  fromZone: string,
  toZone: string
): string => {
  try {
    // استخدام الـ Intl.DateTimeFormat للتحويل
    const date = new Date(`1970-01-01T${time}Z`);
    
    const fromFormatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: fromZone,
    });
    
    const toFormatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: toZone,
    });
    
    const fromTime = fromFormatter.format(date);
    const toTime = toFormatter.format(date);
    
    return toTime;
  } catch (error) {
    console.error('خطأ في تحويل المنطقة الزمنية:', error);
    return time; // إرجاع الوقت الأصلي في حالة الخطأ
  }
};

/**
 * قائمة المناطق الزمنية المدعومة
 */
export const SUPPORTED_TIME_ZONES = [
  { value: 'Asia/Riyadh', label: 'السعودية (الرياض)', offset: '+03:00' },
  { value: 'Asia/Dubai', label: 'الإمارات (دبي)', offset: '+04:00' },
  { value: 'Asia/Kuwait', label: 'الكويت', offset: '+03:00' },
  { value: 'Asia/Qatar', label: 'قطر', offset: '+03:00' },
  { value: 'Asia/Bahrain', label: 'البحرين', offset: '+03:00' },
  { value: 'Africa/Cairo', label: 'مصر (القاهرة)', offset: '+02:00' },
  { value: 'Asia/Beirut', label: 'لبنان (بيروت)', offset: '+02:00' },
  { value: 'Asia/Amman', label: 'الأردن (عمان)', offset: '+03:00' },
  { value: 'Europe/London', label: 'المملكة المتحدة (لندن)', offset: '+00:00' },
  { value: 'America/New_York', label: 'أمريكا (نيويورك)', offset: '-05:00' },
];

/**
 * دالة للحصول على تسمية المنطقة الزمنية
 */
export const getTimeZoneLabel = (timeZone: string): string => {
  const found = SUPPORTED_TIME_ZONES.find(tz => tz.value === timeZone);
  return found ? found.label : timeZone;
};