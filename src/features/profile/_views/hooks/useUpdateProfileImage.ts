"use client"

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { toast } from "sonner"

export type UserType = "therapist" | "center" | "patient"

type UpdateProfileImageOptions = {
  userType: UserType
  userId?: string
  onSuccess?: (imageUrl: string) => void
  onError?: (error: string) => void
  refetch?: () => void
}

type UpdatePayload = {
  image: File
  customer_id?: string
}

export const useUpdateProfileImage = (options: UpdateProfileImageOptions) => {
  const axios = useAxiosInstance()

  // Map user type to API endpoint
  const getEndpoint = (userType: UserType): string => {
    const endpoints: Record<UserType, string> = {
      therapist: "/api/therapist/update",
      center: "/api/center/update",
      patient: "/api/patient/update",
    }
    return endpoints[userType]
  }

  const mutation = useMutation({
    mutationFn: async (data: UpdatePayload) => {
      const formData = new FormData()
      formData.append("image", data.image)

      // Add customer_id if provided
      if (data.customer_id) {
        formData.append("customer_id", data.customer_id)
      }

      const endpoint = getEndpoint(options.userType)
      const response = await axios.post(endpoint, formData)
      return response.data
    },
    onError: (err: AxiosError) => {
      const respData = err.response?.data as unknown as { message?: string } | undefined

      const message = respData?.message || err.message || "حدث خطأ أثناء تحديث الصورة"

      toast.error(String(message))
      options.onError?.(String(message))
    },
    onSuccess: (data) => {
      toast.success("تم تحديث الصورة بنجاح")

      // Extract image URL from response
      const imageUrl = data?.data?.image || data?.image

      if (imageUrl) {
        options.onSuccess?.(imageUrl)
      }

      options.refetch?.()
    },
  })

  return {
    updateImage: mutation.mutateAsync,
    isUpdating: mutation.status === "pending",
    updateError: mutation.error,
  }
}
