"use client";

import { Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MyReviewCardProps {
  title: string;
  rating: number;
  comment?: string | null;
  editLabel: string;
  onEdit: () => void;
  disabled?: boolean;
}

// The current user's own review (one per person), with an edit action.
export function MyReviewCard({
  title,
  rating,
  comment,
  editLabel,
  onEdit,
  disabled = false,
}: MyReviewCardProps) {
  return (
    <div className="rounded-xl border border-[#32A88D]/30 bg-[#32A88D]/5 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={disabled}
          className="border-[#32A88D]/40 text-[#32A88D] hover:bg-[#32A88D]/10 hover:text-[#2a8a7a]"
        >
          <Pencil className="me-1.5 h-3.5 w-3.5" />
          {editLabel}
        </Button>
      </div>
      <div className="flex gap-0.5" aria-label={String(rating)}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-5 w-5 ${
              s <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      {comment && <p className="mt-2 break-words text-sm text-gray-700">{comment}</p>}
    </div>
  );
}
