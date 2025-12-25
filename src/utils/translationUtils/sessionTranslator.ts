export const translateSessionType = (type: string): string => {
  if (!type) return "غير محدد";
  
  const typesMap: Record<string, string> = {
    // الإنجليزية
    'online': 'أونلاين',
    'in_person': 'حضوري',
    'both': 'أونلاين وحضوري',
    'video': 'فيديو',
    'audio': 'صوتي',
    'chat': 'دردشة',
    
    // العربية
    'أونلاين': 'Online',
    'حضوري': 'In Person',
    'مختلط': 'Hybrid',
    'فيديو': 'Video',
    'صوتي': 'Audio',
    'دردشة': 'Chat',
  };
  
  const normalizedType = type.trim().toLowerCase();
  return typesMap[normalizedType] || type;
};

/**
 * دالة لترجمة أنواع المتخصصين
 */
export const translateProviderType = (type: string): string => {
  if (!type) return "غير محدد";
  
  const typesMap: Record<string, string> = {
    // الإنجليزية
    'therapist': 'معالج نفسي',
    'rehabilitation_center': 'مركز تأهيل',
    'coach': 'مدرب',
    'nutritionist': 'أخصائي تغذية',
    'psychiatrist': 'طبيب نفسي',
    
    // العربية
    'معالج نفسي': 'Therapist',
    'مركز تأهيل': 'Rehabilitation Center',
    'مدرب': 'Coach',
    'أخصائي تغذية': 'Nutritionist',
    'طبيب نفسي': 'Psychiatrist',
  };
  
  const normalizedType = type.trim().toLowerCase();
  return typesMap[normalizedType] || type;
};

/**
 * دالة لترجمة تخصصات طبية
 */
export const translateSpecialty = (specialty: string): string => {
  if (!specialty) return "غير محدد";
  
  const specialtiesMap: Record<string, string> = {
    // الإنجليزية
    'psychology': 'علم النفس',
    'psychiatry': 'الطب النفسي',
    'counseling': 'الإرشاد النفسي',
    'rehabilitation': 'التأهيل',
    'nutrition': 'التغذية',
    'coaching': 'التدريب',
    'family_therapy': 'علاج أسري',
    'child_psychology': 'علم نفس الطفل',
    
    // العربية
    'علم النفس': 'Psychology',
    'الطب النفسي': 'Psychiatry',
    'الإرشاد النفسي': 'Counseling',
    'التأهيل': 'Rehabilitation',
    'التغذية': 'Nutrition',
    'التدريب': 'Coaching',
    'علاج أسري': 'Family Therapy',
    'علم نفس الطفل': 'Child Psychology',
  };
  
  const normalizedSpecialty = specialty.trim().toLowerCase();
  return specialtiesMap[normalizedSpecialty] || specialty;
};