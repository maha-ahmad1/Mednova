"use client";

import { useState, useMemo } from "react";
import { useProgramsQuery } from "../../hooks";
import type { Program, ProgramFilters } from "../../types/program";
// import { ProgramCard } from "./components/ProgramCard"
import { ProgramSkeleton } from "./components/ProgramSkeleton";
import { Search } from "lucide-react";
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
import { ProgramCard } from "@/shared/ui/components/ProgramCard";

export function ProgramsList() {
  const { data, isLoading, error } = useProgramsQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProgramFilters>({
    category: "الكل",
    difficulty: "الكل",
    sortBy: "الأحدث",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort programs
  const filteredAndSortedPrograms = useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data.filter((program: Program) => {
      const matchesSearch =
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    // Sort programs
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "الأكثر تسجيلاً":
          return (b.enrollments_count || 0) - (a.enrollments_count || 0);
        case "الأعلى تقييماً":
          return (b.ratings_avg_rating || 0) - (a.ratings_avg_rating || 0);
        case "الأحدث":
          return b.id - a.id;
        case "الأقل سعراً":
          return a.price - b.price;
        case "الأعلى سعراً":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data?.data, searchQuery, filters]);

  const handleFilterChange = (key: keyof ProgramFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      category: "الكل",
      difficulty: "الكل",
      sortBy: "الأحدث",
    });
  };

  const sortOptions = [
    { value: "الأحدث", label: "الأحدث" },
    { value: "الأكثر تسجيلاً", label: "الأكثر تسجيلاً" },
    { value: "الأعلى تقييماً", label: "الأعلى تقييماً" },
    { value: "الأقل سعراً", label: "الأقل سعراً" },
    { value: "الأعلى سعراً", label: "الأعلى سعراً" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgramSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              حدث خطأ في تحميل البرامج
            </h3>
            <p className="text-red-600">الرجاء المحاولة مرة أخرى لاحقاً</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Search Bar */}
            <div className="lg:col-span-8">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="ابحث عن برنامج تأهيلي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 rounded-xl border-gray-200 focus:border-[#32A88D] focus:ring-[#32A88D] h-12"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب حسب
              </label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger className="rounded-xl border-gray-200 h-12">
                  <SelectValue placeholder="اختر الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {searchQuery && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-lg px-3 py-1">
                بحث: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="mr-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                إزالة جميع الفلاتر
              </Button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            عرض{" "}
            <span className="font-bold text-[#32A88D]">
              {filteredAndSortedPrograms.length}
            </span>{" "}
            برنامج
          </div>
          <div className="text-sm text-gray-500">
            مرتبة حسب:{" "}
            <span className="font-medium text-gray-700">{filters.sortBy}</span>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredAndSortedPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedPrograms.map((program: Program) => (
              <ProgramCard
                key={program.id}
                program={program}
                showCreator={true}
                showEnrollments={true}
                showStatus={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              لم يتم العثور على برامج
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              لا توجد برامج تطابق معايير البحث الخاصة بك. حاول تغيير الفلاتر أو
              البحث بمصطلحات أخرى.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[#32A88D] hover:bg-[#2a8a7a]"
            >
              عرض جميع البرامج
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
