import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ReviewDialog } from "./ReviewDialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MyReviewCard } from "@/shared/ui/components/reviews";
import { useSubmitReviewMutation } from "../../hooks/useSubmitReviewMutation";
import type { SubmitReviewPayload, SubmitReviewResponse } from "../../types/review";

// guest    → not logged in (reviewerId 0): show login prompt, never submit
// own      → the viewer owns this profile: no review UI
// reviewed → the viewer already reviewed: show their review with an edit button (one per person)
// can      → show the write-review button
export type ReviewAccess = "guest" | "own" | "reviewed" | "can";

interface ReviewsSectionProps {
  reviewerId: number;
  revieweeId: number;
  revieweeType: "customer" | "program";
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

  // Rendered next to every logged-in state: after a successful submit the list refetches and
  // access flips to "reviewed"; keeping the dialog mounted lets the thanks screen finish.
  const dialog = (
    <ReviewDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      reviewerId={reviewerId}
      revieweeId={revieweeId}
      revieweeType={revieweeType}
      revieweeName={revieweeName}
      // One review per person: when one exists the same dialog edits it (the API updates it).
      defaultRating={myReview?.rating ?? 0}
      defaultComment={myReview?.comment ?? ""}
      mode={access === "reviewed" && myReview ? "edit" : "create"}
      onSubmit={handleSubmitReview}
      isSubmitting={isPending}
    />
  );

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
      <>
        {dialog}
        <MyReviewCard
          title={tp("yourReview")}
          rating={myReview.rating}
          comment={myReview.comment}
          editLabel={tp("editYourReview")}
          onEdit={() => setIsDialogOpen(true)}
          disabled={isPending}
        />
      </>
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

      {dialog}
    </div>
  );
};
