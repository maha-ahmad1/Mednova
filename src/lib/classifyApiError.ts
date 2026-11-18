import type { AxiosError } from "axios"
import * as Sentry from "@sentry/nextjs"
import { apiErrorMessage as t } from "@/lib/apiErrorMessages"

export interface ApiErrorDisplay {
  title: string
  message: string
  /** For Sentry/console only — never render in the UI. */
  technicalDetail?: string
}

// Errors already reported, so re-classifying on every render doesn't spam Sentry.
const reportedErrors = new WeakSet<object>()

const stringify = (value: unknown): string | undefined => {
  if (value === undefined) return undefined
  try {
    return typeof value === "string" ? value : JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export function classifyApiError(error: unknown): ApiErrorDisplay {
  const axiosError = error as AxiosError<Record<string, unknown>> | undefined

  if (axiosError?.code === "ERR_NETWORK" || axiosError?.message === "Network Error") {
    return { title: t("networkTitle"), message: t("networkMsg") }
  }

  const status = axiosError?.response?.status
  const responseData = axiosError?.response?.data

  // Only trust `message` when the response has the agreed envelope (`success` is a boolean).
  // Anything else (e.g. Laravel debug output with exception/file/trace) must never reach the user.
  const isKnownEnvelope =
    !!responseData && typeof responseData === "object" && typeof responseData.success === "boolean"
  const envelopeMessage =
    isKnownEnvelope && typeof responseData.message === "string" && responseData.message
      ? responseData.message
      : undefined

  if (!isKnownEnvelope && axiosError && typeof axiosError === "object" && !reportedErrors.has(axiosError)) {
    reportedErrors.add(axiosError)
    Sentry.captureException(error, {
      extra: { responseData, url: axiosError.config?.url },
    })
  }

  const technicalDetail = !isKnownEnvelope
    ? (stringify(responseData) ?? axiosError?.message)
    : undefined

  if (status === 401) {
    return { title: t("sessionTitle"), message: t("sessionMsg") }
  }
  if (status === 403) {
    return { title: t("forbiddenTitle"), message: t("forbiddenMsg") }
  }
  if (status === 404) {
    return {
      title: t("notFoundTitle"),
      message: envelopeMessage ?? t("notFoundMsg"),
      technicalDetail,
    }
  }
  if (status && status >= 500) {
    return { title: t("serverTitle"), message: t("serverMsg"), technicalDetail }
  }

  if (envelopeMessage) {
    return { title: t("genericTitle"), message: envelopeMessage }
  }

  return { title: t("unexpectedTitle"), message: t("unexpectedMsg"), technicalDetail }
}
