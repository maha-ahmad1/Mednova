"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { buildLoginHref } from "@/lib/safe-redirect";
import { ReviewDialog } from "@/features/service-provider/public-profile/ui/reviews/ReviewDialog";
import { useSubmitProgramReview } from "@/features/programs/hooks/useSubmitProgramReview";
import type { Review } from "@/features/programs/types/reviews";
import { MyReviewCard, isOwnReview } from "@/shared/ui/components/reviews";

interface CourseReviewFormProps {
  programId: number;
  programTitle: string;
  isEnrolled: boolean;
  reviews: Review[];
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
      {children}
    </div>
  );
}

// Same review popup as the specialist profile (ReviewDialog): a button opens it,
// and the thanks screen shows only after the server confirms the review.
export function CourseReviewForm({
  programId,
  programTitle,
  isEnrolled,
  reviews,
}: CourseReviewFormProps) {
  const t = useTranslations("programs.detail.reviewForm");
  const pathname = usePathname();
  const { session, isLoading, isAuthenticated } = useRequireAuth();
  const { mutateAsync, isPending } = useSubmitProgramReview(programId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <Notice>
        {t("loginPrompt")}{" "}
        <Link
          href={buildLoginHref(pathname)}
          className="font-semibold text-[#32A88D] hover:underline"
        >
          {t("loginLink")}
        </Link>
      </Notice>
    );
  }

  if (!isEnrolled) return <Notice>{t("enrollPrompt")}</Notice>;

  const userId = Number(session?.user?.id) || 0;
  const myReview = reviews.find((r) => isOwnReview(r, userId));

  // Rejects on failure so ReviewDialog keeps the form (the hook already shows the error toast).
  const handleSubmit = async (rating: number, comment: string) => {
    if (userId <= 0) throw new Error("Not logged in"); // never send reviewer_id = 0
    await mutateAsync({
      reviewerId: userId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  // Kept mounted in both states: after success the list refetches and myReview appears,
  // and the dialog must stay to finish its thanks screen.
  const dialog = (
    <ReviewDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      reviewerId={userId}
      revieweeId={programId}
      revieweeType="program"
      revieweeName={programTitle}
      // One review per person: when it exists the same dialog edits it (the API updates it).
      defaultRating={myReview?.rating ?? 0}
      defaultComment={myReview?.comment ?? ""}
      mode={myReview ? "edit" : "create"}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
    />
  );

  if (myReview) {
    return (
      <>
        {dialog}
        <MyReviewCard
          title={t("yourReview")}
          rating={myReview.rating}
          comment={myReview.comment}
          editLabel={t("editButton")}
          onEdit={() => setIsDialogOpen(true)}
          disabled={isPending}
        />
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
        className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white"
      >
        <Star className="w-4 h-4 me-2" />
        {t("title")}
      </Button>
      {dialog}
    </>
  );
}
