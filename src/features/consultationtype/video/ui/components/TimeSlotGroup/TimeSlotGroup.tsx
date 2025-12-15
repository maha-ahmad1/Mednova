"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  times: string[];
  selectedTime?: string;
  onSelect: (t: string) => void;
}

export default function TimeSlotGroup({ title, times, selectedTime, onSelect }: Props) {
  if (!times || times.length === 0) return null;

  return (
    <div className="mb-10">
      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {times.map((time) => (
          <button key={time} type="button" onClick={() => onSelect(time)} className={cn(
            "cursor-pointer px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 transition-all text-xs sm:text-sm font-medium",
            selectedTime === time
              ? "bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white border-[#32A88D] shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-[#32A88D] hover:bg-[#32A88D]/5"
          )}>
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
