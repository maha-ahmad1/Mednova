"use client"
import { Clock, Loader2 } from "lucide-react"
import TimeSlotGroup from "../TimeSlotGroup/TimeSlotGroup"

interface Props {
  selectedDate?: Date
  selectedTime?: string
  setSelectedTime: (t: string) => void
  groupedSlots: { morning: string[]; afternoon: string[]; evening: string[] }
  isLoadingSlots?: boolean
  availableSlotsLength?: number
}

export default function TimeSlotsSection({
  selectedDate,
  selectedTime,
  setSelectedTime,
  groupedSlots,
  isLoadingSlots,
  availableSlotsLength,
}: Props) {
  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-2 md:mt-26">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#32A88D]" />
        </div>
        <p className="text-sm sm:text-base font-medium text-gray-700 mb-2">الرجاء اختيار تاريخ أولاً</p>
      </div>
    )
  }

  if (isLoadingSlots) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:mt-26">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-[#32A88D] mb-3 sm:mb-4" />
        <p className="text-xs sm:text-sm text-gray-500">جاري تحميل الأوقات المتاحة...</p>
      </div>
    )
  }

  if (!availableSlotsLength || availableSlotsLength === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-2 md:mt-26">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#32A88D]" />
        </div>
        <p className="text-sm sm:text-base font-medium text-gray-700 mb-2">لا توجد أوقات متاحة</p>
        <p className="text-xs sm:text-sm text-gray-500">يرجى اختيار تاريخ آخر</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar pt-4">
      {groupedSlots.morning.length > 0 && (
        <TimeSlotGroup
          title="الفترة الصباحية"
          times={groupedSlots.morning}
          selectedTime={selectedTime}
          onSelect={setSelectedTime}
        />
      )}

      {groupedSlots.afternoon.length > 0 && (
        <TimeSlotGroup
          title="بعد الظهر"
          times={groupedSlots.afternoon}
          selectedTime={selectedTime}
          onSelect={setSelectedTime}
        />
      )}

      {groupedSlots.evening.length > 0 && (
        <TimeSlotGroup
          title="الفترة المسائية"
          times={groupedSlots.evening}
          selectedTime={selectedTime}
          onSelect={setSelectedTime}
        />
      )}
    </div>
  )
}
