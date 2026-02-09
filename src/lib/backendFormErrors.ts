import type { AxiosError } from "axios"
import { toast } from "sonner"

interface BackendErrorResponse {
  message?: string
  data?: Record<string, unknown>
}

type FieldErrors = Record<string, string>

const pushFieldError = (
  bag: FieldErrors,
  key: string,
  message: string,
  summaryParts: string[],
) => {
  if (!key || !message) return

  if (!bag[key]) {
    bag[key] = message
    summaryParts.push(message)
  }
}

const normalizeFieldPath = (path: string) => path.replace(/\[(\d+)\]/g, ".$1").replace(/^\.+|\.+$/g, "")



const stripKnownPrefix = (path: string): string | null => {
  const prefixes = ["therapist_details.", "center_details.", "patient_details.", "location_details."]
  const found = prefixes.find((prefix) => path.startsWith(prefix))
  if (!found) return null
  return path.slice(found.length)
}

const aliasFieldPath = (path: string): string[] => {
  const aliases = new Set<string>([path])

  if (path.startsWith("medicalSpecialties") || path.startsWith("medical_specialties")) {
    aliases.add("medical_specialties_id")
    aliases.add("specialty_id")
  }

  const strippedPath = stripKnownPrefix(path)
  if (strippedPath) aliases.add(strippedPath)

  if (path.startsWith("schedules")) {
    const cleaned = path.replace(/^schedules\.\d+\.?/, "")
    if (cleaned) aliases.add(cleaned)
  }

  return Array.from(aliases)
}

const collectValidationErrors = (
  value: unknown,
  path: string,
  bag: FieldErrors,
  summaryParts: string[],
) => {
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      const message = value.map(String).find(Boolean)
      if (!message) return

      const normalizedPath = normalizeFieldPath(path)
      aliasFieldPath(normalizedPath).forEach((key) => {
        pushFieldError(bag, key, message, summaryParts)
      })
      return
    }

    value.forEach((item, index) => {
      const nextPath = path ? `${path}.${index}` : String(index)
      collectValidationErrors(item, nextPath, bag, summaryParts)
    })
    return
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, nestedValue]) => {
      const nextPath = path ? `${path}.${key}` : key
      collectValidationErrors(nestedValue, nextPath, bag, summaryParts)
    })
    return
  }

  if (typeof value === "string" || typeof value === "number") {
    const normalizedPath = normalizeFieldPath(path)
    aliasFieldPath(normalizedPath).forEach((key) => {
      pushFieldError(bag, key, String(value), summaryParts)
    })
  }
}

export const extractValidationErrors = (
  errorData?: BackendErrorResponse,
): { fieldErrors: Record<string, string>; summary: string } => {
  const fieldErrors: FieldErrors = {}
  const summaryParts: string[] = []

  if (!errorData?.data) {
    return {
      fieldErrors,
      summary: errorData?.message || "يرجى مراجعة الحقول المدخلة.",
    }
  }

  Object.entries(errorData.data).forEach(([field, value]) => {
    collectValidationErrors(value, field, fieldErrors, summaryParts)
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
