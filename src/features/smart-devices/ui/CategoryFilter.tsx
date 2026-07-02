"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { DeviceCategory } from "../types/device.types";

export type CategoryFilterValue = DeviceCategory | "all";

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

const CATEGORY_VALUES: CategoryFilterValue[] = [
  "all",
  "homecare",
  "clinical",
  "accessories",
];

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const t = useTranslations("smartDevices");

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_VALUES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            value === category
              ? "border-[#32A88D] bg-[#32A88D] text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-[#32A88D]/40 hover:text-[#1F6069]",
          )}
        >
          {t(`categories.${category}`)}
        </button>
      ))}
    </div>
  );
}
