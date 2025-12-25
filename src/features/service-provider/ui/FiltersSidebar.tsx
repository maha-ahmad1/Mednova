"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";
import {
  SearchFilters,
  ProviderType,
  MedicalSpecialty,
} from "../types/provider";
import { countries } from "@/constants/countries";

interface FiltersSidebarProps {
  selectedTab: ProviderType;
  onTabChange: (tab: ProviderType) => void;
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onClearFilters: () => void;
  specialties: MedicalSpecialty[];
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  selectedTab,
  onTabChange,
  filters,
  onFilterChange,
  onClearFilters,
  specialties,
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
        {/* Filter Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <FilterIcon className="w-5 h-5 text-[#32A88D]" />
          <h3 className="text-lg font-semibold text-gray-800">الفلاتر</h3>
        </div>
        {/* Type Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">النوع</h4>
          <div className="space-y-2">
            <button
              onClick={() => onTabChange("all")}
              className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedTab === "all"
                  ? "bg-[#32A88D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => onTabChange("therapist")}
              className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedTab === "therapist"
                  ? "bg-[#32A88D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              المختصون
            </button>
            <button
              onClick={() => onTabChange("center")}
              className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedTab === "center"
                  ? "bg-[#32A88D] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              المراكز التأهيلية
            </button>
          </div>
        </div>
        {/* Specialties Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">التخصصات</h4>
          <Select
            value={filters.specialty}
            onValueChange={(value) => onFilterChange("specialty", value)}
          >
            <SelectTrigger className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]">
              <SelectValue placeholder="اختر التخصص" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id.toString()}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Location Filters */}
        {/* <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">الدولة</h4>
            <div className="relative">
              <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={filters.country}
                onChange={(e) => onFilterChange("country", e.target.value)}
                placeholder="ابحث بالدولة"
                className="w-full pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">المدينة</h4>
            <div className="relative">
              <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={filters.city}
                onChange={(e) => onFilterChange("city", e.target.value)}
                placeholder="ابحث بالمدينة"
                className="w-full pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]"
              />
            </div>
          </div>
        </div> */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">الدولة</h4>
            <Select
              value={filters.country}
              onValueChange={(value) => {
                onFilterChange("country", value);
                onFilterChange("city", ""); // إعادة تعيين المدينة عند تغيير الدولة
              }}
            >
              <SelectTrigger className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]">
                <SelectValue placeholder="اختر الدولة" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {countries.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* City Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">المدينة</h4>
            <Select
              value={filters.city}
              onValueChange={(value) => onFilterChange("city", value)}
              disabled={!filters.country} // تعطيل اختيار المدينة إذا لم تُختَر الدولة
            >
              <SelectTrigger className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {countries
                  .find((c) => c.name === filters.country)
                  ?.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full mt-6 border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-lg"
        >
          مسح الكل
        </Button>
      </div>
    </div>
  );
};
