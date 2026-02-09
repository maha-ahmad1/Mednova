import type { AxiosError } from "axios"
import { toast } from "sonner"

interface BackendErrorResponse {
  message?: string
  data?: Record<string, unknown>
}

export const extractValidationErrors = (
  errorData?: BackendErrorResponse,
): { fieldErrors: Record<string, string>; summary: string } => {
  const fieldErrors: Record<string, string> = {}
  const summaryParts: string[] = []

  if (!errorData?.data) {
    return {
      fieldErrors,
      summary: errorData?.message || "يرجى مراجعة الحقول المدخلة.",
    }
  }

  Object.entries(errorData.data).forEach(([field, value]) => {
    let message = ""

    if (Array.isArray(value) && value.length > 0) {
      message = String(value[0])
    } else if (typeof value === "string") {
      message = value
    } else if (value && typeof value === "object") {
      const first = Object.values(value)[0]
      if (Array.isArray(first) && first.length > 0) {
        message = String(first[0])
      }
    }

    if (message) {
      fieldErrors[field] = message
      summaryParts.push(message)
    }
  })

  const summary = summaryParts.length
    ? `تحقق من البيانات التالية: ${summaryParts.join(" — ")}`
    : errorData.message || "يرجى مراجعة الحقول المدخلة."

  return { fieldErrors, summary }
}

export const handleBackendFormError = (
  error: AxiosError<BackendErrorResponse>,
  onValidationError?: (errors: Record<string, string>) => void,
) => {
  const status = error.response?.status
  const errorData = error.response?.data

  if (status === 422 && errorData?.data) {
    const { fieldErrors, summary } = extractValidationErrors(errorData)
    toast.error(summary)
    onValidationError?.(fieldErrors)
    return
  }

  if (status === 401) {
    toast.error("انتَهَت جلستك. يرجى تسجيل الدخول مرة أخرى.")
    return
  }

  if (status && status >= 500) {
    toast.error("حدث خطأ في الخادم. يرجى المحاولة لاحقًا.")
    return
  }

  if (errorData?.message) {
    toast.error(errorData.message)
    return
  }

  toast.error("حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.")
}
