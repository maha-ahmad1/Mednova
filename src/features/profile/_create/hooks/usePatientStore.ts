import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storePatientDetails } from "@/app/api/patient"
import type { PatientFormValues, AxiosErrorResponse } from "@/types/patient"
import { toast } from "sonner"
import { parseServerValidationErrors } from "../utils/serverValidation"

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
        const { fieldErrors, summary } = parseServerValidationErrors(
          errorData.data as Record<string, unknown>
        )

        toast.error(summary || errorData.message || "يرجى مراجعة الحقول المدخلة.")
        options?.onValidationError?.(fieldErrors)
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
