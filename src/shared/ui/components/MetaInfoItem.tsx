"use client"

import { cn } from "@/lib/utils"

interface MetaInfoItemProps {
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  iconClassName?: string
}

export function MetaInfoItem({ icon, children, className, iconClassName }: MetaInfoItemProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-gray-600", className)}>
      <span className={cn("text-[#32A88D]", iconClassName)}>{icon}</span>
      <span>{children}</span>
    </div>
  )
}
