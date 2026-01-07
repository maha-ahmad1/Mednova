"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Filter, ChevronDown } from "lucide-react"

interface SortDropdownProps {
  sortBy: string
  onSortChange: (value: string) => void
  options: string[]
}

export function SortDropdown({ sortBy, onSortChange, options }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-xl border-gray-200 h-12 bg-transparent">
          <Filter className="ml-2 w-5 h-5" />
          ترتيب حسب
          <ChevronDown className="mr-2 w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSortChange(option)}
            className={sortBy === option ? "bg-[#32A88D]/10 text-[#32A88D]" : ""}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
