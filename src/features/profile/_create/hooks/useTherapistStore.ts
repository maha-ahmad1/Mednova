import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storeTherapistDetails ,TherapistFormValues} from "@/app/api/therapist"
import type { AxiosErrorResponse } from "@/types/patient"
import { toast } from "sonner"
import { parseServerValidationErrors } from "../utils/serverValidation"



interface UseTherapistOptions {
  onValidationError?: (errors: Record<string, string>) => void;
}

export const useTherapist = (options?: UseTherapistOptions) => {
  const axios = useAxiosInstance()

  const mutation = useMutation({
    mutationFn: (data: TherapistFormValues) => storeTherapistDetails(axios, data),
    onError: (error: AxiosError<AxiosErrorResponse>) => {
      const status = error.response?.status
      const errorData = error.response?.data

      if (status === 422 && errorData?.data) {
        const { fieldErrors, summary } = parseServerValidationErrors(
          errorData.data as Record<string, unknown>
        )

        toast.error(summary || errorData.message || "يرجى مراجعة الحقول المدخلة.")
        options?.onValidationError?.(fieldErrors)
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
    },
  })

  return {
    storeTherapist: mutation.mutateAsync,
    isStoring: mutation.isPending,
    storeError: mutation.error,
  }
}
