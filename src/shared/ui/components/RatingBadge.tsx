"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingBadgeProps {
  rating: number
  count?: number | null
  tone?: "light" | "dark"
  showCount?: boolean
  className?: string
}

export function RatingBadge({
  rating,
  count,
  tone = "light",
  showCount = true,
  className,
}: RatingBadgeProps) {
  const toneClasses =
    tone === "dark"
      ? "bg-black/70 text-white backdrop-blur-sm"
      : "bg-gray-100 text-gray-700"

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-1 text-sm",
        toneClasses,
        className,
      )}
    >
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {showCount && typeof count === "number" && (
        <span className="text-xs opacity-80">({count})</span>
      )}
    </div>
  )
}
