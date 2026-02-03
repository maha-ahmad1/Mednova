import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storeCenterDetails, type CenterFormValues } from "@/app/api/center"
import type { AxiosErrorResponse } from "@/types/patient"
import { toast } from "sonner"
import { parseServerValidationErrors } from "../utils/serverValidation"

interface UseCenterOptions {
  onValidationError?: (errors: Record<string, string>) => void
}

export const useCenterStore = (options?: UseCenterOptions) => {
  const axios = useAxiosInstance() //useAxiosInstance عادة يكون Hook جاهز من عندك لتهيئة Axios مع التوكن أو الإعدادات العامة.

  const mutation = useMutation({
    mutationFn: (data: CenterFormValues) => storeCenterDetails(axios, data), //هي الدالة التي سترسل البيانات للسيرفر (storeCenterDetails
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
    storeCenter: mutation.mutateAsync,
    isStoring: mutation.isPending,
    storeError: mutation.error,
  }
}
