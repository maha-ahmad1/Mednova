export const ARABIC_DAYS = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
] as const;

export const ENGLISH_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const;

export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر'
] as const;

export const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const;

/**
 * أنظمة الجلسات المدعومة
 */
export const SESSION_TYPES = {
  ONLINE: 'online',
  IN_PERSON: 'in_person',
  HYBRID: 'hybrid',
  VIDEO: 'video',
  AUDIO: 'audio',
  CHAT: 'chat',
} as const;

/**
 * أنواع المتخصصين
 */
export const PROVIDER_TYPES = {
  THERAPIST: 'therapist',
  REHAB_CENTER: 'rehabilitation_center',
  COACH: 'coach',
  NUTRITIONIST: 'nutritionist',
  PSYCHIATRIST: 'psychiatrist',
} as const;