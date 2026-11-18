"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, usePathname } from "@/i18n/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { buildLoginHref } from "@/lib/safe-redirect";
import { ReviewStars } from "@/features/service-provider/public-profile/ui/reviews/ReviewStars";
import { useSubmitProgramReview } from "@/features/programs/hooks/useSubmitProgramReview";
import type { Review } from "@/features/programs/types/reviews";

const MAX_COMMENT = 500;

interface CourseReviewFormProps {
  programId: number;
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

export function CourseReviewForm({ programId, isEnrolled, reviews }: CourseReviewFormProps) {
  const t = useTranslations("programs.detail.reviewForm");
  const pathname = usePathname();
  const { session, isLoading, isAuthenticated } = useRequireAuth();
  const { mutate, isPending } = useSubmitProgramReview(programId);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

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

  const userId = Number(session?.user?.id);
  const myReview = reviews.find((r) => Number(r.reviewer?.id) === userId);

  if (myReview) {
    return (
      <div className="rounded-xl border border-[#32A88D]/30 bg-[#32A88D]/5 p-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">{t("yourReview")}</p>
        <div className="flex gap-0.5" aria-label={String(myReview.rating)}>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || isPending) return;
    mutate({
      reviewerId: userId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700">{t("ratingLabel")}</p>
        <ReviewStars
          rating={rating}
          hoverRating={hoverRating}
          onRatingChange={setRating}
          onHoverRatingChange={setHoverRating}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="program-review-comment" className="text-sm font-medium text-gray-700">
          {t("commentLabel")}
        </label>
        <Textarea
          id="program-review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
          maxLength={MAX_COMMENT}
          rows={4}
          disabled={isPending}
          placeholder={t("commentPlaceholder")}
          className="focus-visible:border-[#32A88D]"
        />
        <p className="text-xs text-muted-foreground">
          {t("counter", { count: comment.length, max: MAX_COMMENT })}
        </p>
      </div>

      <Button
        type="submit"
        disabled={rating < 1 || isPending}
        className="w-full sm:w-auto bg-[#32A88D] hover:bg-[#2a8a7a] text-white"
      >
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
