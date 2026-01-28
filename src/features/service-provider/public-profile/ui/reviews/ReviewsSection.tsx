import React, { useState } from "react";
import { ReviewDialog } from "./ReviewDialog";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { useSubmitReviewMutation } from "../../hooks/useSubmitReviewMutation";
import type { SubmitReviewPayload, SubmitReviewResponse } from "../../types/review";

interface ReviewsSectionProps {
  reviewerId: number;
  revieweeId: number;
  revieweeType: "customer" | "program" | "platform";
  revieweeName: string;
  existingReview?: {
    rating: number;
    comment: string;
  };
  showTriggerButton?: boolean;
  triggerButtonText?: string;
  onReviewSubmitted?: (data: SubmitReviewResponse) => void;
  onReviewError?: (error: Error) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviewerId,
  revieweeId,
  revieweeType,
  revieweeName,
  existingReview,
  showTriggerButton = true,
  triggerButtonText = "أضف تقييم",
  onReviewSubmitted,
  onReviewError,
}): React.ReactNode => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: submitReview, isPending } = useSubmitReviewMutation();

  const handleSubmitReview = (rating: number, comment: string): void => {
    const payload: SubmitReviewPayload = {
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      reviewee_type: revieweeType,
      rating,
      comment: comment.trim() || undefined,
    };

    submitReview(payload, {
      onSuccess: (data) => {
        setIsDialogOpen(false);
        onReviewSubmitted?.(data);
      },
      onError: (error) => {
        const typedError = error instanceof Error ? error : new Error(String(error));
        onReviewError?.(typedError);
      },
    });
  };

  return (
    <div className="space-y-4">
      {showTriggerButton && (
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D]"
          disabled={isPending}
        >
          {existingReview ? (
            <>
              <MessageSquare className="w-4 h-4 ml-2" />
              تعديل التقييم
            </>
          ) : (
            <>
              <Star className="w-4 h-4 ml-2" />
              {triggerButtonText}
            </>
          )}
        </Button>
      )}

      <ReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reviewerId={reviewerId}
        revieweeId={revieweeId}
        revieweeType={revieweeType}
        revieweeName={revieweeName}
        defaultRating={existingReview?.rating ?? 0}
        defaultComment={existingReview?.comment ?? ""}
        onSubmit={handleSubmitReview}
        isSubmitting={isPending}
      />

      {/* يمكن إضافة قائمة التقييمات هنا */}
      {/* <ReviewList revieweeId={revieweeId} revieweeType={revieweeType} /> */}
    </div>
  );
};