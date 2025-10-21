import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { storePatientDetails } from "@/app/api/patient"
import type { PatientFormValues, AxiosErrorResponse } from "@/types/patient"

export const usePatient = () => {
  const axios = useAxiosInstance()

  const storePatientMutation = useMutation({
    mutationFn: (data: PatientFormValues) => storePatientDetails(axios, data),
    onError: (error: AxiosError<AxiosErrorResponse>) => {
      console.log("usePatient mutation error:", error)
      console.log("Error response:", error.response)
      console.log("Error status:", error.response?.status)
    },
  })

  return {
    storePatient: storePatientMutation.mutateAsync,
    isStoring: storePatientMutation.isPending,
    storeError: storePatientMutation.error,
  }
}
