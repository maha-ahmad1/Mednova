"use client"

import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { ViewToggle } from "../layout/ViewToggle"
 import { SortDropdown } from "./SortDropdown"
import { ViewToggle } from "@/shared/ui/components/layout/ViewToggle"

interface FilterOption {
  value: string
  label: string
}

interface SearchFiltersBarProps {
  // Search
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string

  // Filters
  filters: Array<{
    key: string
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
  }>

  // View Mode (optional)
  viewMode?: "grid" | "list"
  onViewModeChange?: (mode: "grid" | "list") => void

  // Sort
  sortBy?: string
  sortOptions?: string[]
  onSortChange?: (value: string) => void

  // Actions
  onClearFilters: () => void
}

export function SearchFiltersBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  filters,
  viewMode,
  onViewModeChange,
  sortBy,
  sortOptions = [],
  onSortChange,
  onClearFilters,
}: SearchFiltersBarProps) {
  const hasActiveFilters = filters.some((f) => f.value && f.value !== "الكل") || searchQuery

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        {/* Search Bar */}
        <div className={`lg:col-span-${filters.length === 0 ? 12 : 4}`}>
          <div className="relative">
            <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-12 rounded-xl border-gray-200 focus:border-[#32A88D] focus:ring-[#32A88D] h-12"
            />
          </div>
        </div>

        {/* Dynamic Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">{filter.label}</label>
            <Select value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="rounded-xl border-gray-200 h-12">
                <SelectValue placeholder={`اختر ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* View Toggle and Sort */}
        {(viewMode || sortOptions.length > 0) && (
          <div className="lg:col-span-2 flex gap-3">
            {viewMode && onViewModeChange && <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />}
            {sortOptions.length > 0 && sortBy && onSortChange && (
              <SortDropdown sortBy={sortBy} onSortChange={onSortChange} options={sortOptions} />
            )}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((filter) => {
            if (filter.value && filter.value !== "الكل") {
              return (
                <Badge key={filter.key} variant="secondary" className="rounded-lg px-3 py-1">
                  {filter.value}
                  <button onClick={() => filter.onChange("الكل")} className="mr-2 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )
            }
            return null
          })}

          {searchQuery && (
            <Badge variant="secondary" className="rounded-lg px-3 py-1">
              بحث: {searchQuery}
              <button onClick={() => onSearchChange("")} className="mr-2 hover:text-red-500">
                ×
              </button>
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-gray-500 hover:text-gray-700">
            إزالة جميع الفلاتر
          </Button>
        </div>
      )}
    </div>
  )
}
