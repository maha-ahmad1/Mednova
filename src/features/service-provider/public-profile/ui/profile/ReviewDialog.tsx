"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  therapistId: number | string;
  therapistName: string;
  onSubmit?: (rating: number, comment: string) => Promise<void>;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  therapistId,
  therapistName,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // دالة لعرض النجوم
  const renderStars = (currentRating: number, hoverRating: number) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoverRating || rating);

      return (
        <button
          key={index}
          type="button"
          className="p-1 focus:outline-none focus:ring-2 focus:ring-[#32A88D] focus:ring-offset-2 rounded-full"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={isSubmitting || isSubmitted}
        >
          <Star
            className={cn(
              "w-10 h-10 transition-all duration-200",
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200",
              "hover:scale-110 active:scale-95"
            )}
          />
        </button>
      );
    });
  };

  // دالة إرسال التقييم
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("يرجى اختيار تقييم من 1 إلى 5 نجوم");
      return;
    }

    if (!comment.trim()) {
      toast.error("يرجى كتابة تعليقك");
      return;
    }

    setIsSubmitting(true);

    try {
      // إذا تم تمرير دالة onSubmit مخصصة
      if (onSubmit) {
        await onSubmit(rating, comment);
      } else {
        // أو استدعاء API افتراضي
        await submitReviewToAPI();
      }

      setIsSubmitted(true);
      toast.success("تم إرسال تقييمك بنجاح!");

      // إغلاق الـ Dialog بعد 2 ثانية
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
      }, 2000);
    } catch (error) {
      console.error("خطأ في إرسال التقييم:", error);
      toast.error("حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة إرسال إلى API (يمكن تعديلها)
  const submitReviewToAPI = async () => {
    // هنا يمكنك استدعاء API الخاص بك
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        therapistId,
        therapistName,
        rating,
        comment,
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("فشل إرسال التقييم");
    }

    return response.json();
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  // إغلاق الـ Dialog
  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      if (!isSubmitted) {
        resetForm();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg rounded-2xl">
        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <DialogHeader className="text-center pt-8">
          {isSubmitted ? (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                شكراً لك!
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                تم إرسال تقييمك بنجاح
              </DialogDescription>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[#32A88D]" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                اكتب تقييمك
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                شاركنا تجربتك مع {therapistName}
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {!isSubmitted ? (
          <>
            {/* النجوم */}
            <div className="py-6">
              <div className="text-center mb-4">
                <p className="text-gray-700 font-medium mb-2">
                  كيف تقيم تجربتك؟
                </p>
                <p className="text-sm text-gray-500">
                  اختر من 1 إلى 5 نجوم
                </p>
              </div>

              <div className="flex justify-center gap-1 mb-8">
                {renderStars(rating, hoverRating)}
              </div>

              <div className="text-center">
                {rating > 0 && (
                  <p className="text-lg font-semibold text-[#32A88D]">
                    {rating} من 5
                  </p>
                )}
              </div>
            </div>

            {/* التعليق */}
            <div className="space-y-4">
              <label htmlFor="comment" className="text-gray-700 font-medium">
                شاركنا المزيد من التفاصيل
              </label>
              <Textarea
                id="comment"
                placeholder="اكتب تعليقك هنا... (اختياري)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[120px] resize-none rounded-xl border-gray-300 focus:border-[#32A88D] focus:ring-[#32A88D]"
              />
              <p className="text-sm text-gray-500">
                مشاركة تجربتك تساعد الآخرين على اتخاذ قرار أفضل
              </p>
            </div>

            {/* زر الإرسال */}
            <DialogFooter className="mt-6">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري الإرسال...</span>
                  </div>
                ) : (
                  "إرسال التقييم"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          // رسالة النجاح
          <div className="py-8 text-center">
            <p className="text-gray-600 mb-6">
              شكراً لمشاركتك رأيك معنا. تقييمك يساعدنا في تحسين خدماتنا.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <p>سيتم إغلاق النافذة تلقائياً...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};