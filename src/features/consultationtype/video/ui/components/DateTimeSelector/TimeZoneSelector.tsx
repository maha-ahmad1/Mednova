"use client";

import React from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeZone {
  id: string;
  label: string;
  offset: string;
}

interface Props {
  timeZones: TimeZone[];
  selectedTimeZone: string;
  onSelect: (id: string) => void;
}

export default function TimeZoneSelector({ timeZones, selectedTimeZone, onSelect }: Props) {
  const [open, setOpen] = React.useState(false);

  const getLabel = () => {
    const tz = timeZones.find((t) => t.id === selectedTimeZone);
    return tz ? tz.label : "اختر المنطقة الزمنية";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">المنطقة الزمنية</span>
        </div>
      </div>

      <div className="relative z-20">
        <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-xs sm:text-sm truncate">{getLabel()}</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform flex-shrink-0", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute left-0 right-0 z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {timeZones.map((tz) => (
              <button key={tz.id} type="button" onClick={() => { onSelect(tz.id); setOpen(false); }} className={cn("cursor-pointer w-full text-right px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors text-xs sm:text-sm first:rounded-t-xl last:rounded-b-xl", selectedTimeZone === tz.id && "bg-[#32A88D]/10 text-[#32A88D] font-medium")}>
                {tz.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <Globe className="w-3 h-3" />
        <span>جميع الأوقات محسوبة حسب المنطقة الزمنية المحددة</span>
      </div>
    </div>
  );
}
