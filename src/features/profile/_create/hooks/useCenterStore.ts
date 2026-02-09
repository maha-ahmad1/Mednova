import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storeCenterDetails, type CenterFormValues } from "@/app/api/center"
import type { AxiosErrorResponse } from "@/types/patient"
import { handleBackendFormError } from "@/lib/backendFormErrors"

interface UseCenterOptions {
  onValidationError?: (errors: Record<string, string>) => void
}

export const useCenterStore = (options?: UseCenterOptions) => {
  const axios = useAxiosInstance()

  const mutation = useMutation({
    mutationFn: (data: CenterFormValues) => storeCenterDetails(axios, data),
    onError: (error: AxiosError<AxiosErrorResponse>) => {
      handleBackendFormError(error, options?.onValidationError)
    },
  })

  return {
    storeCenter: mutation.mutateAsync,
    isStoring: mutation.isPending,
    storeError: mutation.error,
  }
}
