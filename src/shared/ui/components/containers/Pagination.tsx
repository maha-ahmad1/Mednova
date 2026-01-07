"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  onLoadMore: () => void
  hasMore?: boolean
  isLoading?: boolean
  label?: string
}

export function Pagination({ onLoadMore, hasMore = true, isLoading = false, label = "تحميل المزيد" }: PaginationProps) {
  if (!hasMore) return null

  return (
    <div className="text-center mt-8">
      <Button
        variant="outline"
        className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-8 py-2 bg-transparent"
        onClick={onLoadMore}
        disabled={isLoading}
      >
        {isLoading ? "جاري التحميل..." : label}
      </Button>
    </div>
  )
}
