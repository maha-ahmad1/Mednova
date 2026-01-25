"use client"

import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CourseReviewsProps {
  rating: number
  reviewCount: number
}

export function CourseReviews({ rating, reviewCount }: CourseReviewsProps) {
  const reviews = [
    { stars: 5, percentage: 65 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 8 },
    { stars: 2, percentage: 4 },
    { stars: 1, percentage: 3 }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">تقييمات الطلاب</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Overall Rating */}
        <div className="text-center">
          {/* <div className="text-5xl font-bold text-gray-900 mb-2">{rating.toFixed(1)}</div> */}
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-gray-600">تصنيف الدورة</div>
          <div className="text-sm text-gray-500 mt-1">{reviewCount} تقييم</div>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2">
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-600 w-4">{review.stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={review.percentage} className="flex-1 h-2" />
                <span className="text-sm text-gray-600 w-12">{review.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Reviews */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((review) => (
            <div key={review} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div>
                  <div className="font-medium">طالب مجهول</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                محتوى رائع وشرح واضح. البرنامج ساعدني كثيراً في تحسين مهاراتي.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}