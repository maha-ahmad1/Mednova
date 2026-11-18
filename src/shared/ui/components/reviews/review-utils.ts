// Reviews API now returns a shortened reviewer name and no image (privacy), so the UI
// renders a letter avatar. These helpers stay tolerant of both the old and new shapes.

export interface ReviewerLike {
  id?: number | string | null;
  full_name?: string | null;
  name?: string | null;
}

export interface ReviewLike {
  reviewer?: ReviewerLike | null;
  /** Set by the API when the review belongs to the current user (if provided). */
  is_mine?: boolean | null;
}

export const getReviewerName = (reviewer?: ReviewerLike | null): string =>
  (reviewer?.full_name ?? reviewer?.name ?? "").trim();

/** First letter of the name (Arabic or Latin), upper-cased; "?" when there's no name. */
export const getReviewerInitial = (name: string): string => {
  const first = Array.from(name.trim())[0];
  return first ? first.toLocaleUpperCase() : "?";
};

/** One review per person: prefer the API's own flag, fall back to matching the reviewer id. */
export const isOwnReview = (review: ReviewLike, userId: number): boolean => {
  if (userId <= 0) return false;
  if (typeof review.is_mine === "boolean") return review.is_mine;
  return Number(review.reviewer?.id) === userId;
};
