import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi } from "../api/reviews.api";
import type { SubmitReviewPayload, SubmitReviewResponse } from "../types/review";
import type { AxiosError } from "axios";
import { useAxiosInstance as useAxios } from "@/lib/axios/axiosInstance";

export const useSubmitReviewMutation = () => {
  const axios = useAxios();

  return useMutation<SubmitReviewResponse, AxiosError, SubmitReviewPayload>({
    mutationFn: (payload: SubmitReviewPayload) =>
      reviewsApi.submitReview(axios, payload),
    onSuccess: (data) => {
      toast.success(data.message || "تم إرسال تقييمك بنجاح!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "حدث خطأ أثناء إرسال التقييم";
      toast.error(errorMessage);
    },
  });
};