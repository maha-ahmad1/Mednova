"use client"

import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LockedContentOverlayProps {
  isLocked: boolean
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
  children: React.ReactNode
}

export function LockedContentOverlay({
  isLocked,
  title = "هذا المحتوى مدفوع",
  description = "اشترك للوصول إلى المحتوى الكامل",
  ctaLabel = "اشترك الآن",
  ctaHref,
  className,
  children,
}: LockedContentOverlayProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className={cn(isLocked && "pointer-events-none select-none opacity-80")}>{children}</div>
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-black/70 via-black/40 to-black/20 p-6 text-center text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-white/80">{description}</p>
          </div>
          {ctaHref ? (
            <Button asChild size="sm" className="rounded-full bg-white/90 text-[#1F6069] hover:bg-white">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : (
            <Button size="sm" className="rounded-full bg-white/90 text-[#1F6069] hover:bg-white">
              {ctaLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
