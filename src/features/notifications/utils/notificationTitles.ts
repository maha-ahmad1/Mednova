const normalizeType = (type: string): string => type.trim().toLowerCase();

export const getNotificationTitleByType = (type: string): string => {
  const normalized = normalizeType(type);

  const titleMap: Record<string, string> = {
    consultation_requested: "طلب استشارة جديد",
    consultation_accepted: "تم قبول طلب الاستشارة",
    consultation_active: "تم تفعيل الاستشارة",
    consultation_cancelled: "تم إلغاء طلب الاستشارة",
    consultation_cancelled_by_consultant: "تم إلغاء طلب الاستشارة",
    consultation_cancelled_by_patient: "تم إلغاء طلب الاستشارة",
    consultation_completed: "تم إكمال الاستشارة",
    consultation_updated: "تحديث حالة الاستشارة",
    message: "رسالة جديدة",
    comment: "تعليق جديد",
    like: "إعجاب جديد",
    follow: "متابعة جديدة",
    system: "إشعار نظام",
    alert: "تنبيه",
    account_approved: "تم قبول حسابك",
    account_rejected: "تم رفض حسابك",
  };

  return titleMap[normalized] || "إشعار";
};
