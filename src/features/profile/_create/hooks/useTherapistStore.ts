import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storeTherapistDetails, TherapistFormValues } from "@/app/api/therapist"
import type { AxiosErrorResponse } from "@/types/patient"
import { handleBackendFormError } from "@/lib/backendFormErrors"

interface UseTherapistOptions {
  onValidationError?: (errors: Record<string, string>) => void
}

export const useTherapist = (options?: UseTherapistOptions) => {
  const axios = useAxiosInstance()

  const mutation = useMutation({
    mutationFn: (data: TherapistFormValues) => storeTherapistDetails(axios, data),
    onError: (error: AxiosError<AxiosErrorResponse>) => {
      handleBackendFormError(error, options?.onValidationError)
    },
  })

  return {
    storeTherapist: mutation.mutateAsync,
    isStoring: mutation.isPending,
    storeError: mutation.error,
  }
}
