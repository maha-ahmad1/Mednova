"use client";

import { SearchIcon, FilterIcon, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersBarProps {
  // Search
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchPlaceholder: string;
  
  // Filters
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  
  // View Mode
  viewMode?: "grid" | "list";
  setViewMode?: (mode: "grid" | "list") => void;
  
  // Options
  categories?: Array<{ value: string; label: string }>;
  difficulties?: Array<{ value: string; label: string }>;
  
  // Labels
  categoryLabel?: string;
  difficultyLabel?: string;
}

export function SearchFiltersBar({
  searchQuery,
  setSearchQuery,
  searchPlaceholder,
  filters,
  onFilterChange,
  onClearFilters,
  viewMode,
  setViewMode,
  categories = [],
  difficulties = [],
  categoryLabel = "التصنيف",
  difficultyLabel = "مستوى الصعوبة",
}: SearchFiltersBarProps) {
  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        {/* Search Bar */}
        <div className="lg:col-span-4">
          <div className="relative">
            <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 rounded-xl border-gray-200 focus:border-[#32A88D] focus:ring-[#32A88D] h-12"
            />
          </div>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {categoryLabel}
            </label>
            <Select
              value={filters.category || "الكل"}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger className="rounded-xl border-gray-200 h-12">
                <SelectValue placeholder={`اختر ${categoryLabel}`} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Difficulty Filter */}
        {difficulties.length > 0 && (
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {difficultyLabel}
            </label>
            <Select
              value={filters.difficulty || "الكل"}
              onValueChange={(value) => onFilterChange("difficulty", value)}
            >
              <SelectTrigger className="rounded-xl border-gray-200 h-12">
                <SelectValue placeholder={difficultyLabel} />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* View Mode Toggle */}
        {viewMode && setViewMode && (
          <div className="lg:col-span-2 flex gap-3">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`rounded-none ${
                  viewMode === "grid" ? "bg-[#32A88D] text-white" : ""
                }`}
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={`rounded-none ${
                  viewMode === "list" ? "bg-[#32A88D] text-white" : ""
                }`}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (value && value !== "الكل") {
            return (
              <Badge key={key} variant="secondary" className="rounded-lg px-3 py-1">
                {value}
                <button
                  onClick={() => onFilterChange(key, "الكل")}
                  className="mr-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            );
          }
          return null;
        })}
        
        {searchQuery && (
          <Badge variant="secondary" className="rounded-lg px-3 py-1">
            بحث: {searchQuery}
            <button
              onClick={() => setSearchQuery("")}
              className="mr-2 hover:text-red-500"
            >
              ×
            </button>
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          إزالة جميع الفلاتر
        </Button>
      </div>
    </div>
  );
}