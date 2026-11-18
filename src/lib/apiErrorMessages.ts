/**
 * Locale-aware strings for non-React helpers (`classifyApiError`, `handleBackendFormError`)
 * that cannot call `useTranslations`. Component copy belongs in `src/messages/*.json`.
 * The locale comes from `<html lang>`, which the `[locale]` layout sets.
 */
type ApiErrorKey =
  | "networkTitle"
  | "networkMsg"
  | "sessionTitle"
  | "sessionMsg"
  | "forbiddenTitle"
  | "forbiddenMsg"
  | "notFoundTitle"
  | "notFoundMsg"
  | "serverTitle"
  | "serverMsg"
  | "genericTitle"
  | "unexpectedTitle"
  | "unexpectedMsg"
  | "reviewFields"
  | "validationPrefix"

const messages: Record<"ar" | "en", Record<ApiErrorKey, string>> = {
  ar: {
    networkTitle: "تعذر الاتصال",
    networkMsg: "تأكد من اتصال الإنترنت وحاول مرة أخرى.",
    sessionTitle: "انتهت الجلسة",
    sessionMsg: "الرجاء تسجيل الدخول مرة أخرى.",
    forbiddenTitle: "غير مصرح",
    forbiddenMsg: "ليس لديك صلاحية للوصول لهذا المحتوى.",
    notFoundTitle: "غير موجود",
    notFoundMsg: "الخدمة غير متاحة حاليًا، جرّب لاحقًا.",
    serverTitle: "خطأ في الخادم",
    serverMsg: "حدث خطأ بالخادم، يرجى المحاولة لاحقًا.",
    genericTitle: "حدث خطأ",
    unexpectedTitle: "حدث خطأ غير متوقع",
    unexpectedMsg: "يرجى المحاولة لاحقًا.",
    reviewFields: "يرجى مراجعة الحقول المدخلة.",
    validationPrefix: "تحقق من البيانات التالية:",
  },
  en: {
    networkTitle: "Connection failed",
    networkMsg: "Check your internet connection and try again.",
    sessionTitle: "Session expired",
    sessionMsg: "Please sign in again.",
    forbiddenTitle: "Not authorized",
    forbiddenMsg: "You do not have permission to access this content.",
    notFoundTitle: "Not found",
    notFoundMsg: "This service is currently unavailable, please try again later.",
    serverTitle: "Server error",
    serverMsg: "A server error occurred, please try again later.",
    genericTitle: "Something went wrong",
    unexpectedTitle: "An unexpected error occurred",
    unexpectedMsg: "Please try again later.",
    reviewFields: "Please review the entered fields.",
    validationPrefix: "Please check the following:",
  },
}

export const apiErrorMessage = (key: ApiErrorKey): string => {
  const lang =
    typeof document !== "undefined" && document.documentElement.lang.startsWith("en")
      ? "en"
      : "ar"
  return messages[lang][key]
}
