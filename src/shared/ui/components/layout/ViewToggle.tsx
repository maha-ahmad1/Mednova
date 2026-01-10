"use client"

import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

interface ViewToggleProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex border border-gray-200 rounded-xl overflow-hidden">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewModeChange("grid")}
        className={`rounded-none ${viewMode === "grid" ? "bg-[#32A88D] text-white" : ""}`}
      >
        <Grid className="w-5 h-5" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewModeChange("list")}
        className={`rounded-none ${viewMode === "list" ? "bg-[#32A88D] text-white" : ""}`}
      >
        <List className="w-5 h-5" />
      </Button>
    </div>
  )
}
