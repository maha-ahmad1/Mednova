import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ReviewDialog } from "./ReviewDialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useSubmitReviewMutation } from "../../hooks/useSubmitReviewMutation";
import type { SubmitReviewPayload, SubmitReviewResponse } from "../../types/review";

// guest    → not logged in (reviewerId 0): show login prompt, never submit
// own      → the viewer owns this profile: no review UI
// reviewed → the viewer already reviewed: show their review, no new one
// can      → show the write-review button
export type ReviewAccess = "guest" | "own" | "reviewed" | "can";

interface ReviewsSectionProps {
  reviewerId: number;
  revieweeId: number;
  revieweeType: "customer" | "program" | "platform";
  revieweeName: string;
  access: ReviewAccess;
  loginHref: string;
  myReview?: { rating: number; comment?: string | null };
  triggerButtonText?: string;
  onReviewSubmitted?: (data: SubmitReviewResponse) => void;
  onReviewError?: (error: Error) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviewerId,
  revieweeId,
  revieweeType,
  revieweeName,
  access,
  loginHref,
  myReview,
  triggerButtonText,
  onReviewSubmitted,
  onReviewError,
}): React.ReactNode => {
  const t = useTranslations("specialists.reviewsSection");
  const tp = useTranslations("specialists.publicProfile.reviews");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync: submitReview, isPending } = useSubmitReviewMutation();

  // Returns the mutation promise: ReviewDialog awaits it and shows the thanks screen
  // only on success. On failure it rejects, so the dialog keeps the form.
  const handleSubmitReview = async (rating: number, comment: string): Promise<void> => {
    if (reviewerId <= 0) throw new Error("Not logged in"); // never send reviewer_id = 0

    const payload: SubmitReviewPayload = {
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      reviewee_type: revieweeType,
      rating,
      comment: comment.trim() || undefined,
    };

    try {
      const data = await submitReview(payload);
      // The dialog closes itself after showing the thanks screen.
      onReviewSubmitted?.(data);
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      onReviewError?.(typedError);
      throw typedError;
    }
  };

  if (access === "own") return null;

  if (access === "guest") {
    return (
      <p className="text-sm text-gray-600">
        {tp("loginPrompt")}{" "}
        <Link href={loginHref} className="font-semibold text-[#32A88D] hover:underline">
          {tp("loginLink")}
        </Link>
      </p>
    );
  }

  if (access === "reviewed" && myReview) {
    return (
      <div className="rounded-xl border border-[#32A88D]/30 bg-[#32A88D]/5 p-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">{tp("yourReview")}</p>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-5 w-5 ${
                s <= myReview.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        {myReview.comment && (
          <p className="mt-2 break-words text-sm text-gray-700">{myReview.comment}</p>
        )}
      </div>
    );
  }

  if (access !== "can") return null;

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D]"
        disabled={isPending}
      >
        <Star className="w-4 h-4 me-2" />
        {triggerButtonText ?? t("addReview")}
      </Button>

      <ReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reviewerId={reviewerId}
        revieweeId={revieweeId}
        revieweeType={revieweeType}
        revieweeName={revieweeName}
        defaultRating={0}
        defaultComment=""
        onSubmit={handleSubmitReview}
        isSubmitting={isPending}
      />
    </div>
  );
};
