export const translateDay = (day: string, locale: "ar" | "en" = "ar"): string => {
  if (!day) return locale === "ar" ? "غير محدد" : "Not specified";

  const normalizedDay = day.trim().toLowerCase();

  if (locale === "en") {
    const englishDaysMap: Record<string, string> = {
      saturday: "Saturday",
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
    };
    return englishDaysMap[normalizedDay] || day;
  }

  const daysMap: Record<string, string> = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
  };

  return daysMap[normalizedDay] || day;
};

/**
 * دالة لتحويل أيام الأسبوع من العربية إلى الإنجليزية
 */
export const translateDayToEnglish = (day: string): string => {
  if (!day) return "Unknown";
  
  const daysMap: Record<string, string> = {
    // العربية
    'السبت': 'Saturday',
    'الأحد': 'Sunday',
    'الاثنين': 'Monday',
    'الثلاثاء': 'Tuesday',
    'الأربعاء': 'Wednesday',
    'الخميس': 'Thursday',
    'الجمعة': 'Friday',
  };
  
  const normalizedDay = day.trim();
  return daysMap[normalizedDay] || day;
};

/**
 * دالة للحصول على يوم الأسبوع باللغة المطلوبة
 */
export const getLocalizedDay = (
  date: Date | string,
  locale: 'ar' | 'en' = 'ar'
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return "غير محدد";
    
    const dayIndex = dateObj.getDay();
    
    if (locale === 'ar') {
      const arabicDays = [
        'الأحد',
        'الاثنين',
        'الثلاثاء',
        'الأربعاء',
        'الخميس',
        'الجمعة',
        'السبت'
      ];
      return arabicDays[dayIndex];
    } else {
      const englishDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ];
      return englishDays[dayIndex];
    }
  } catch (error) {
    console.error('خطأ في الحصول على اليوم:', error);
    return "غير محدد";
  }
};

/**
 * دالة لترجمة الشهور
 */
export const translateMonth = (month: string): string => {
  const monthsMap: Record<string, string> = {
    // الإنجليزية
    'january': 'يناير',
    'february': 'فبراير',
    'march': 'مارس',
    'april': 'أبريل',
    'may': 'مايو',
    'june': 'يونيو',
    'july': 'يوليو',
    'august': 'أغسطس',
    'september': 'سبتمبر',
    'october': 'أكتوبر',
    'november': 'نوفمبر',
    'december': 'ديسمبر',
    
    // الاختصارات
    'jan': 'يناير',
    'feb': 'فبراير',
    'mar': 'مارس',
    'apr': 'أبريل',
    'jun': 'يونيو',
    'jul': 'يوليو',
    'aug': 'أغسطس',
    'sep': 'سبتمبر',
    'oct': 'أكتوبر',
    'nov': 'نوفمبر',
    'dec': 'ديسمبر',
  };
  
  const normalizedMonth = month.trim().toLowerCase();
  return monthsMap[normalizedMonth] || month;
};