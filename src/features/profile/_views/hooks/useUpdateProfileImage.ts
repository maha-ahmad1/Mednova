"use client"

import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export type UserType = "therapist" | "center" | "patient"

type UpdateProfileImageResponse = {
  image?: string
  data?: {
    image?: string
    user?: {
      image?: string
    }
  }
}

type UpdateProfileImageSuccessPayload = {
  data: unknown
  imageUrl?: string
}

type UpdateProfileImageOptions = {
  userType: UserType
  userId?: string
  onSuccess?: (payload: UpdateProfileImageSuccessPayload) => void
  onError?: (error: string) => void
  refetch?: () => void
}

type UpdatePayload = {
  image: File
  customer_id?: string
}

export const useUpdateProfileImage = (options: UpdateProfileImageOptions) => {
  const axios = useAxiosInstance()
  const { update } = useSession()
  const router = useRouter()

  const getEndpoint = (userType: UserType): string => {
    const endpoints: Record<UserType, string> = {
      therapist: "/api/therapist/update",
      center: "/api/center/update",
      patient: "/api/patient/update",
    }
    return endpoints[userType]
  }

  const mutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      const formData = new FormData()
      formData.append("image", payload.image)

      if (payload.customer_id) {
        formData.append("customer_id", payload.customer_id)
      }

      const endpoint = getEndpoint(options.userType)
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },

    onError: (err: AxiosError) => {
      const respData = err.response?.data as { message?: string } | undefined
      const message = respData?.message || err.message || "حدث خطأ أثناء تحديث الصورة"
      toast.error(String(message))
      options.onError?.(String(message))
    },

    onSuccess: async (data) => {
      try {
        const parsedData = data as UpdateProfileImageResponse
        const imageUrl =
          parsedData?.data?.image || parsedData?.image || parsedData?.data?.user?.image

        if (imageUrl) {
          const imageWithVersion = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}v=${Date.now()}`

          await update({
            image: imageWithVersion,
            user: {
              image: imageWithVersion,
            },
          })

          // force session re-fetch so all useSession consumers (e.g. Navbar/UserMenu) re-render
          await update()
          router.refresh()

          options.onSuccess?.({ data, imageUrl: imageWithVersion })
        } else {
          options.onSuccess?.({ data })
        }

        options.refetch?.()
      } catch (error) {
        console.error("Error updating session:", error)
        toast.error("تم تحديث الصورة لكن حدث خطأ في تحديث الجلسة")
      }
    },
  })

  return {
    updateImage: mutation.mutateAsync,
    isUpdating: mutation.status === "pending",
    updateError: mutation.error,
  }
}
