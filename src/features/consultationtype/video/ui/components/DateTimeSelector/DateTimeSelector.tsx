"use client";

import React from "react";
import CalendarSection from "./CalendarSection";
import TimeSlotsSection from "./TimeSlotsSection";
import TimeZoneSelector from "./TimeZoneSelector";

interface Props {
  selectedDate?: Date;
  setSelectedDate: (d?: Date) => void;
  selectedTime?: string;
  setSelectedTime: (t: string) => void;
  timeZone?: string | undefined;
  setTimeZone: (t?: string) => void;
  timeZones: { id: string; label: string; offset: string }[];
  groupedSlots: { morning: string[]; afternoon: string[]; evening: string[] };
  isLoadingSlots?: boolean;
  availableSlotsLength?: number;
}

export default function DateTimeSelector({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, timeZone, setTimeZone, timeZones, groupedSlots, isLoadingSlots, availableSlotsLength }: Props) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
        <div>
          <div className="p-4 sm:p-6 order-1 xl:order-1 relative">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">اختر التاريخ</h3>
              </div>
            </div>
            <CalendarSection selectedDate={selectedDate} setSelectedDate={setSelectedDate} timeZone={timeZone} />
            <div className="">
              <TimeZoneSelector timeZones={timeZones} selectedTimeZone={timeZone || "gmt+3"} onSelect={(id) => setTimeZone && setTimeZone(id)} />
            </div>
          </div>
        </div>

        <div>
          <div className="p-4 sm:p-6 order-2 xl:order-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">اختر الوقت</h3>
              </div>
            </div>
            <TimeSlotsSection selectedDate={selectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} groupedSlots={groupedSlots} isLoadingSlots={isLoadingSlots} availableSlotsLength={availableSlotsLength} />
          </div>
        </div>
      </div>
    </div>
  );
}
