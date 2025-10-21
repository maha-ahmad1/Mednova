import type { AxiosError } from "axios"
import { toast } from "sonner"

export const handleFormErrors = <T,>(
  error: AxiosError<{ message?: string; data?: Record<string, string[]> }>,
  setError: (name: keyof T, error: { type: string; message: string }) => void,
) => {
  // معالجة أخطاء الشبكة
  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    toast.error("فشل الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل.")
    return
  }

  const status = error.response?.status
  const errorData = error.response?.data

  // معالجة أخطاء التحقق من الصحة (422)
  if (status === 422 && errorData?.data) {
    let hasErrors = false
    Object.entries(errorData.data).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        setError(field as keyof T, {
          type: "server",
          message: messages[0],
        })
        hasErrors = true
      }
    })

    if (hasErrors) {
      toast.error("يرجى مراجعة البيانات المدخلة والتأكد من صحتها.")
    }
    return
  }

  // معالجة أخطاء المصادقة (401)
  if (status === 401) {
    toast.error("انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.")
    return
  }

  // معالجة أخطاء الصلاحيات (403)
  if (status === 403) {
    toast.error("ليس لديك صلاحية للقيام بهذا الإجراء.")
    return
  }

  // معالجة أخطاء الخادم (500)
  if (status && status >= 500) {
    toast.error("حدث خطأ في الخادم. يرجى المحاولة لاحقاً.")
    return
  }

  // عرض رسالة الخطأ من الخادم إن وجدت
  if (errorData?.message) {
    toast.error(errorData.message)
    return
  }

  // رسالة خطأ عامة
  toast.error("حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.")
}
