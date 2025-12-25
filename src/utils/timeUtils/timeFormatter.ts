export const formatTime = (time24: string): string => {
  if (!time24 || time24.trim() === "") return "غير محدد";

  try {
    // التعامل مع تنسيقات مختلفة للوقت
    let timeStr = time24.trim();
    
    // إزالة أي مسافات زائدة
    timeStr = timeStr.replace(/\s+/g, '');
    
    // التعامل مع وقت يحتوي على AM/PM بالفعل
    if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
      return timeStr;
    }

    // البحث عن النمط HH:MM أو H:MM
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    
    if (!timeMatch) {
      // محاولة تنسيقات أخرى
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const minute = minutes || "00";
      
      if (isNaN(hour)) return timeStr; // إرجاع النص الأصلي إذا لم نستطع التحليل
      
      const ampm = hour >= 12 ? 'م' : 'ص';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute.padStart(2, '0')} ${ampm}`;
    }

    const [, hourStr, minuteStr] = timeMatch;
    const hour = parseInt(hourStr, 10);
    
    if (hour < 0 || hour > 23) return timeStr;

    const ampm = hour >= 12 ? 'م' : 'ص';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minuteStr} ${ampm}`;
  } catch (error) {
    console.error('خطأ في تنسيق الوقت:', error);
    return time24; // إرجاع النص الأصلي في حالة الخطأ
  }
};

/**
 * دالة لتنسيق المدة
 */
export const formatDuration = (minutes: number | string): string => {
  const mins = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;
  
  if (isNaN(mins)) return "غير محدد";
  
  if (mins < 60) {
    return `${mins} دقيقة`;
  }
  
  const hours = Math.floor(mins / 60);
  const remainingMinutes = mins % 60;
  
  return remainingMinutes > 0
    ? `${hours} ساعة و ${remainingMinutes} دقيقة`
    : `${hours} ساعة`;
};

/**
 * دالة لتحويل التاريخ إلى صيغة قابلة للقراءة
 */
export const formatDateForDisplay = (date: Date | string, locale: string = 'ar'): string => {
  if (!date) return "غير محدد";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return "تاريخ غير صالح";
    
    if (locale === 'ar') {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return dateObj.toLocaleDateString('ar-SA', options);
    } else {
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error);
    return "غير محدد";
  }
};