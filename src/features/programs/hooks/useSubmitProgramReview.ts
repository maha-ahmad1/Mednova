import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useAxiosInstance } from "@/lib/axios/axiosInstance";
import { reviewsApi } from "@/features/service-provider/public-profile/api/reviews.api";
import { getReviewErrorMessage } from "@/features/service-provider/public-profile/utils/review-error";
import type { SubmitReviewResponse } from "@/features/service-provider/public-profile/types/review";

interface SubmitProgramReviewInput {
  // TODO: إزالة reviewer_id بعد ما الباك يأخذ الهوية من التوكن
  reviewerId: number;
  rating: number;
  comment?: string;
}

export const useSubmitProgramReview = (programId: number) => {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const t = useTranslations("programs.detail.reviewForm");

  return useMutation<SubmitReviewResponse, AxiosError, SubmitProgramReviewInput>({
    mutationFn: ({ reviewerId, rating, comment }) =>
      reviewsApi.submitReview(axios, {
        reviewer_id: reviewerId,
        reviewee_id: programId,
        reviewee_type: "program",
        rating,
        ...(comment ? { comment } : {}),
      }),
    onSuccess: (data) => {
      toast.success(data.message || t("submitSuccess"));
      // Refresh the list (own review) and the program (average, count, distribution).
      queryClient.invalidateQueries({ queryKey: ["ratings", "program", programId] });
      queryClient.invalidateQueries({ queryKey: ["program", programId] });
    },
    onError: (error) => {
      toast.error(getReviewErrorMessage(error, t("submitError"), t("forbidden")));
    },
  });
};
