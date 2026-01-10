"use client"

import type { ReactNode } from "react"

interface BaseCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function BaseCard({ children, className = "", onClick }: BaseCardProps) {
  return (
    <div
      className={`group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardImageProps {
  children: ReactNode
}

export function CardImage({ children }: CardImageProps) {
  return <div className="relative overflow-hidden">{children}</div>
}

interface CardContentProps {
  children: ReactNode
}

export function CardContent({ children }: CardContentProps) {
  return <div className="p-6">{children}</div>
}

interface CardHeaderProps {
  children: ReactNode
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="mb-4">{children}</div>
}

interface CardFooterProps {
  children: ReactNode
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="flex items-center justify-between pt-4 border-t border-gray-100">{children}</div>
}
