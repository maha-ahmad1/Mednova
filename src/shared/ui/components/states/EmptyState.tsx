"use client"

import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = "لا توجد نتائج",
  description = "لم نتمكن من العثور على أي نتائج تطابق بحثك",
  actionLabel = "مسح الفلاتر",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <SearchIcon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="bg-[#32A88D] hover:bg-[#2a8a7a]">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
