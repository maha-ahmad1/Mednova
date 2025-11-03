import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useAxiosInstance } from "@/lib/axios/axiosInstance"
import { toast } from "sonner"

interface ConsultationRequest {
  patient_id: string | number;
  consultant_id: string | number
  consultant_type: string
  consultant_nature: string
  requested_day?: string |undefined
  requested_time?: string | undefined
  type_appointment?: string | undefined
}

export const useConsultationRequestStore = () => {
  const axios = useAxiosInstance()

  const mutation = useMutation({
    mutationFn: async (data: ConsultationRequest) => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      const res = await axios.post("/api/consultation-request/store", formData)
      return res.data
    },

    onSuccess: () => {
      toast.success("تم إرسال طلب الاستشارة بنجاح ✅")
    },

    onError: (error: AxiosError) => {
      console.error("❌ Error:", error.response?.data || error.message)
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقًا")
    },
  })

  return {
    storeConsultationRequest: mutation.mutateAsync,
    Loading: mutation.isPending,
    
  }
}
