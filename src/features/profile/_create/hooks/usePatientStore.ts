import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storePatientDetails } from "@/app/api/patient"
import type { PatientFormValues, AxiosErrorResponse } from "@/types/patient"
import { handleBackendFormError } from "@/lib/backendFormErrors"

export const usePatient = (options?: { onValidationError?: (errors: Record<string, string>) => void }) => {
  const axios = useAxiosInstance()

  const storePatientMutation = useMutation({
    mutationFn: (data: PatientFormValues) => storePatientDetails(axios, data),
    onError: (error: AxiosError<AxiosErrorResponse>) => {
      handleBackendFormError(error, options?.onValidationError)
    },
  })

  return {
    storePatient: storePatientMutation.mutateAsync,
    isStoring: storePatientMutation.isPending,
    storeError: storePatientMutation.error,
  }
}
