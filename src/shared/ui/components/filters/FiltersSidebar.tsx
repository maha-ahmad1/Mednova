"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { FilterIcon } from "lucide-react"

interface FiltersSidebarProps {
  children: ReactNode
  onClearFilters: () => void
  title?: string
}

export function FiltersSidebar({ children, onClearFilters, title = "الفلاتر" }: FiltersSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
        {/* Filter Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <FilterIcon className="w-5 h-5 text-[#32A88D]" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>

        {/* Dynamic Filter Content */}
        {children}

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full mt-6 border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-lg bg-transparent"
        >
          مسح الكل
        </Button>
      </div>
    </div>
  )
}

interface FilterSectionProps {
  title: string
  children: ReactNode
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      {children}
    </div>
  )
}
