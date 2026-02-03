export type ServerFieldErrors = Record<string, string>

type ServerValidationResult = {
  fieldErrors: ServerFieldErrors
  summary: string | null
}

const extractMessage = (value: unknown): string | null => {
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]) : null
  }
  if (typeof value === "string") {
    return value
  }
  if (value && typeof value === "object") {
    const firstNested = Object.values(value)[0]
    if (Array.isArray(firstNested)) {
      return firstNested.length > 0 ? String(firstNested[0]) : null
    }
    if (typeof firstNested === "string") {
      return firstNested
    }
  }
  return null
}

export const parseServerValidationErrors = (
  data?: Record<string, unknown>
): ServerValidationResult => {
  const fieldErrors: ServerFieldErrors = {}
  const summaryParts: string[] = []

  if (!data) {
    return { fieldErrors, summary: null }
  }

  Object.entries(data).forEach(([field, value]) => {
    const message = extractMessage(value)
    if (!message) {
      return
    }
    fieldErrors[field] = message
    summaryParts.push(message)
  })

  const summary = summaryParts.length
    ? `تحقق من البيانات التالية: ${summaryParts.join(" — ")}`
    : null

  return { fieldErrors, summary }
}
