// src/features/service-provider/ui/components/ReviewsSection.tsx
import { Button } from "@/components/ui/button";
import { Star, Edit } from "lucide-react";

interface ReviewsSectionProps {
  totalReviews: number;
  onWriteReview?: () => void;
}

export default function ReviewsSection({
  totalReviews,
  onWriteReview,
}: ReviewsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Reviews List */}
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          آخر التقييمات
        </h4>
        {totalReviews > 0 ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-600">لا توجد تقييمات لعرضها بعد</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              لا توجد تقييمات بعد
            </h4>
            <p className="text-gray-600 mb-6">
              كن أول من يشارك تجربته مع هذا المختص
            </p>
            <Button
              onClick={onWriteReview}
              className="bg-[#32A88D] hover:bg-[#2D977F]"
            >
              <Edit className="w-5 h-5 ml-2" />
              اكتب تقييم
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}