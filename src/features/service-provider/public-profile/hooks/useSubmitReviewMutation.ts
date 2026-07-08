import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { reviewsApi } from "../api/reviews.api";
import type { SubmitReviewPayload, SubmitReviewResponse } from "../types/review";
import type { AxiosError } from "axios";
import { useAxiosInstance as useAxios } from "@/lib/axios/axiosInstance";

export const useSubmitReviewMutation = () => {
  const axios = useAxios();
  const t = useTranslations("specialists.reviewDialog");

  return useMutation<SubmitReviewResponse, AxiosError, SubmitReviewPayload>({
    mutationFn: (payload: SubmitReviewPayload) =>
      reviewsApi.submitReview(axios, payload),
    onSuccess: (data) => {
      toast.success(data.message || t("submitSuccessToast"));
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        t("submitErrorToast");
      toast.error(errorMessage);
    },
  });
};