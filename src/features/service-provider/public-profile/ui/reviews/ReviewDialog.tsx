


import React, { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, X, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewStars } from './ReviewStars';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewerId: number;
  revieweeId: number;
  revieweeType: 'customer' | 'program';
  revieweeName: string;
  /** Must reject on failure so the dialog keeps the form instead of showing the thanks screen. */
  onSubmit: (rating: number, comment: string) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultRating?: number;
  defaultComment?: string;
  /** "edit" when the user already has a review (one per person) and is updating it. */
  mode?: 'create' | 'edit';
  onClose?: () => void;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  reviewerId,
  revieweeId,
  revieweeType,
  revieweeName,
  onSubmit,
  isSubmitting = false,
  defaultRating = 0,
  defaultComment = '',
  mode = 'create',
  onClose,
}) => {
  const isEdit = mode === 'edit';
  const t = useTranslations('specialists.reviewDialog');
  const dir = useLocale() === 'ar' ? 'rtl' : 'ltr';
  const [rating, setRating] = useState(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(defaultComment);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // Reset the fields only when the dialog opens. In edit mode the defaults change right
  // after a successful save (the list refetches); re-running on that would wipe the thanks screen.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setRating(defaultRating);
      setComment(defaultComment);
      setIsSubmitted(false);
    }
    wasOpenRef.current = open;
  }, [open, defaultRating, defaultComment]);

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setIsSubmitted(false);
  };

  const handleClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!isSubmitting) {
      onOpenChange(false);
      if (!isSubmitted) {
        resetForm();
      }
      onClose?.();
    }
  };

  const hasChanges = rating !== defaultRating || comment.trim() !== defaultComment.trim();

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting || (isEdit && !hasChanges)) return;

    try {
      await onSubmit(rating, comment);
    } catch {
      // The mutation already shows the error toast; keep the form and the user's input.
      return;
    }

    // Thanks screen only after the server confirmed the review, then auto-close.
    setIsSubmitted(true);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      onOpenChange(false);
      resetForm();
      onClose?.();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* showCloseButton={false}: the shared dialog adds its own physical right-4 X;
          we keep a single close button that follows the reading direction (end side). */}
      <DialogContent
        showCloseButton={false}
        className="gap-0 p-6 sm:max-w-md rounded-2xl"
        dir={dir}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute end-3 top-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader className="items-center text-center sm:text-center gap-1 pt-2">
          {isSubmitted ? (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {t('thanksTitle')}
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                {isEdit ? t('editThanksDesc') : t('thanksDesc')}
              </DialogDescription>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-[#32A88D]/10 rounded-full flex items-center justify-center mb-2">
                <Star className="w-7 h-7 text-[#32A88D]" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {isEdit ? t('editTitle') : t('title')}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {t('subtitle', { name: revieweeName })}
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {!isSubmitted ? (
          <>
            <div className="mt-5 rounded-xl bg-gray-50 px-4 py-4">
              <div className="text-center mb-2">
                <p className="text-gray-800 font-semibold">
                  {t('ratingPrompt')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('ratingHint')}
                </p>
              </div>

              <div className="flex justify-center">
                <ReviewStars
                  rating={rating}
                  hoverRating={hoverRating}
                  onRatingChange={setRating}
                  onHoverRatingChange={setHoverRating}
                  disabled={isSubmitting}
                  size="lg"
                />
              </div>

              {/* Fixed height so the dialog doesn't jump when a star is picked */}
              <p className="h-5 mt-1 text-center text-sm font-semibold text-[#32A88D]">
                {rating > 0 ? t('ratingOutOf', { rating }) : null}
              </p>
            </div>

            <div className="mt-5 space-y-2 text-start">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                {t('detailsLabel')}
              </label>
              <Textarea
                id="comment"
                placeholder={t('commentPlaceholder')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[96px] resize-none rounded-xl border-gray-300 focus:border-[#32A88D] focus:ring-[#32A88D]"
              />
              <p className="text-xs text-gray-500">
                {t('detailsHint')}
              </p>
            </div>

            <DialogFooter className="mt-6 sm:justify-stretch">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0 || (isEdit && !hasChanges)}
                className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl h-12 text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('submitting')}</span>
                  </div>
                ) : (
                  isEdit ? t('editSubmitButton') : t('submitButton')
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-600 mb-6">
              {t('thanksNote')}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <p>{t('closingNote')}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};