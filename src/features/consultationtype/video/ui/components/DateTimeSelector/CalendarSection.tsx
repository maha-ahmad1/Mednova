"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";

interface Props {
  selectedDate?: Date;
  setSelectedDate: (d?: Date) => void;
  timeZone?: string | undefined;
}

export default function CalendarSection({ selectedDate, setSelectedDate, timeZone }: Props) {
  return (
    <div className="p-4 sm:p-6 order-1 xl:order-1 relative">
      {/* <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">اختر التاريخ</h3>
        </div>
      </div> */}

      <div className="mb-4 sm:mb-6 w-full max-w-[350px] mx-auto">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date || undefined);
          }}
          locale={ar}
          className="rounded-md !cursor-pointer w-full"
          timeZone={timeZone}
          disabled={(date) => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return date < yesterday;
          }}
        />
      </div>
    </div>
  );
}
