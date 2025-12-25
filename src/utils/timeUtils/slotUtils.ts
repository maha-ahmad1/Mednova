export const categorizeTimeSlots = (slots: string[]): {
  morning: string[];
  afternoon: string[];
  evening: string[];
} => {
  const morningSlots: string[] = [];
  const afternoonSlots: string[] = [];
  const eveningSlots: string[] = [];

  slots.forEach((slot) => {
    try {
      const cleanSlot = slot.trim();
      
      // محاولة استخراج الساعة والدقائق
      const timeMatch = cleanSlot.match(/(\d{1,2}):(\d{2})/);
      
      if (timeMatch) {
        const hour = parseInt(timeMatch[1], 10);
        const minute = timeMatch[2];
        
        // تصنيف الوقت
        if (hour >= 5 && hour < 12) {
          morningSlots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
        } else if (hour >= 12 && hour < 17) {
          afternoonSlots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
        } else if (hour >= 17 || hour < 5) {
          eveningSlots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
        }
      } else {
        // إذا لم يكن بالتنسيق المتوقع، أضفه حسب الساعة إذا أمكن
        if (cleanSlot.toLowerCase().includes('morning') || cleanSlot.toLowerCase().includes('صباح')) {
          morningSlots.push(cleanSlot);
        } else if (cleanSlot.toLowerCase().includes('afternoon') || cleanSlot.toLowerCase().includes('ظهر')) {
          afternoonSlots.push(cleanSlot);
        } else if (cleanSlot.toLowerCase().includes('evening') || cleanSlot.toLowerCase().includes('مساء')) {
          eveningSlots.push(cleanSlot);
        }
      }
    } catch (error) {
      console.warn(`تعذر تصنيف الوقت: ${slot}`, error);
    }
  });

  // ترتيب الأوقات تصاعدياً
  const sortTimes = (times: string[]) => 
    times.sort((a, b) => {
      const [hourA, minuteA] = a.split(':').map(Number);
      const [hourB, minuteB] = b.split(':').map(Number);
      
      if (hourA !== hourB) return hourA - hourB;
      return minuteA - minuteB;
    });

  return {
    morning: sortTimes(morningSlots),
    afternoon: sortTimes(afternoonSlots),
    evening: sortTimes(eveningSlots),
  };
};

/**
 * دالة للتحقق من توفر الوقت
 */
export const isSlotAvailable = (
  slot: string,
  availableSlots: string[],
  selectedDate?: Date
): boolean => {
  if (!selectedDate) return false;
  
  const now = new Date();
  const selectedDateTime = new Date(selectedDate);
  
  // تعيين الوقت من الـ slot
  const [hours, minutes] = slot.split(':').map(Number);
  selectedDateTime.setHours(hours, minutes, 0, 0);
  
  // التحقق إذا كان الوقت في الماضي
  if (selectedDateTime < now) return false;
  
  // التحقق من وجود الوقت في القائمة المتاحة
  return availableSlots.includes(slot);
};

/**
 * دالة لإنشاء فجوات زمنية
 */
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): string[] => {
  const slots: string[] = [];
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute <= endMinute)
  ) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute
      .toString()
      .padStart(2, '0')}`;
    slots.push(timeStr);
    
    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
};