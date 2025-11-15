import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storePatientDetails } from "@/app/api/patient"
import type { PatientFormValues, AxiosErrorResponse } from "@/types/patient"
import { toast } from "sonner"

export const usePatient = (options?: { onValidationError?: (errors: Record<string, string>) => void }) => {
  const axios = useAxiosInstance()

  const storePatientMutation = useMutation({
    mutationFn: (data: PatientFormValues) => storePatientDetails(axios, data),
    onError: (error: AxiosError<AxiosErrorResponse>) => {
      console.log("usePatient mutation error:", error)
      console.log("Error response:", error.response)
      console.log("Error status:", error.response?.status)

      const status = error.response?.status
      const errorData = error.response?.data

      // If validation errors (422) come back, extract and forward them to the caller so they can persist
      if (status === 422 && errorData?.data) {
        const errorFields: Record<string, string> = {}
        const summaryParts: string[] = []

        Object.entries(errorData.data).forEach(([field, value]) => {
          // backend might send either an array of messages or a single string
          let message = ""
          if (Array.isArray(value) && value.length > 0) {
            message = String(value[0])
          } else if (typeof value === "string") {
            message = value
          } else if (value && typeof value === "object") {
            // in case of nested shapes, try to stringify first array entry
            const first = Object.values(value)[0]
            if (Array.isArray(first) && first.length > 0) message = String(first[0])
          }

          if (message) {
            errorFields[field] = message
            summaryParts.push(`${message}`)
          }
        })

        // show a general toast immediately summarizing the validation problem (concatenate messages)
        const summary = summaryParts.length ? `تحقق من البيانات التالية: ${summaryParts.join(" — ")}` : errorData.message || "يرجى مراجعة الحقول المدخلة."
        toast.error(summary)

        // pass parsed field errors back to the consumer (e.g., PatientWrapper) so they persist across steps
        options?.onValidationError?.(errorFields)
        return
      }

      // Other error categories: show a toast summary
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
    },
  })

  return {
    storePatient: storePatientMutation.mutateAsync,
    isStoring: storePatientMutation.isPending,
    storeError: storePatientMutation.error,
  }
}
