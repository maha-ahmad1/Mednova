"use client"

import { Award } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({ title = "حدث خطأ", description = "تعذر تحميل البيانات", onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-20">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-red-600">{description}</p>
        {onRetry && (
          <Button
            variant="outline"
            className="mt-4 border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
            onClick={onRetry}
          >
            إعادة المحاولة
          </Button>
        )}
      </div>
    </div>
  )
}
