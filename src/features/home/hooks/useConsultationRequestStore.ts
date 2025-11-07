import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { toast } from "sonner";

interface ConsultationRequest {
  patient_id: string | number;
  consultant_id: string | number;
  consultant_type: string;
  consultant_nature: string;
  requested_day?: string | undefined;
  requested_time?: string | undefined;
  type_appointment?: string | undefined;
}

export const useConsultationRequestStore = () => {
  const axios = useAxiosInstance();

  const mutation = useMutation({
    mutationFn: async (data: ConsultationRequest) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const res = await axios.post("/api/consultation-request/store", formData);
      return res.data;
    },

    onSuccess: () => {
      toast.success("تم إرسال طلبك بنجاح، الرجاء انتظار موافقة المختص");
    },

    onError: (error: AxiosError) => {
      console.error("❌ Error:", error.response?.data || error.message);

      type ErrorResponse = {
        message?: string;
        data?: Record<string, string>;
      };

      const errorData = error.response?.data as ErrorResponse | undefined;

      let errorMessage = "حدث خطأ غير متوقع، حاول مرة أخرى";

      if (errorData) {
        if (errorData.data) {
          const messages = Object.values(errorData.data).filter(
            (val) => typeof val === "string"
          ) as string[];

          if (messages.length > 0) {
            errorMessage = messages.join("\n");
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }

      toast.error(errorMessage);
    },
  });

  return {
    storeConsultationRequest: mutation.mutateAsync,
    Loading: mutation.isPending,
  };
};
