"use client"
import CalendarSection from "./CalendarSection"
import TimeSlotsSection from "./TimeSlotsSection"
import TimeZoneSelector from "./TimeZoneSelector"

interface Props {
  selectedDate?: Date
  setSelectedDate: (d?: Date) => void
  selectedTime?: string
  setSelectedTime: (t: string) => void
  timeZone?: string | undefined
  setTimeZone: (t?: string) => void
  groupedSlots: { morning: string[]; afternoon: string[]; evening: string[] }
  isLoadingSlots?: boolean
  availableSlotsLength?: number
  customerId?: number
  apiBaseUrl?: string
  onTimeZoneChange?: (timezone: string) => void // كولباك عند تغيير التايم زون
}

export default function DateTimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  timeZone,
  setTimeZone,
  groupedSlots,
  isLoadingSlots,
  availableSlotsLength,
  customerId,
  apiBaseUrl,
  onTimeZoneChange,
}: Props) {
  const handleTimeZoneChange = (newTimeZone: string) => {
    setTimeZone(newTimeZone)

    // إعادة تعيين التاريخ والوقت المحدد لإجبار المستخدم على اختيار جديد بالتايم زون الجديد
    if (selectedDate || selectedTime) {
      // يمكن إبقاء التاريخ المحدد أو إعادة تعيينه حسب المتطلبات
      // setSelectedDate(undefined);
      setSelectedTime("")
    }

    // استدعاء الكولباك لتحديث البيانات في المكون الأب
    if (onTimeZoneChange) {
      onTimeZoneChange(newTimeZone)
    }
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
        <div>
          <div className="p-4 sm:p-6 order-1 xl:order-1 relative">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">اختر التاريخ</h3>
              </div>
            </div>
            <CalendarSection selectedDate={selectedDate} setSelectedDate={setSelectedDate} timeZone={timeZone} />

            <div className="mt-6">
              <TimeZoneSelector
                selectedTimeZone={timeZone || ""}
                onSelect={handleTimeZoneChange}
                customerId={customerId}
                apiBaseUrl={apiBaseUrl}
              />
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
            <TimeSlotsSection
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              groupedSlots={groupedSlots}
              isLoadingSlots={isLoadingSlots}
              availableSlotsLength={availableSlotsLength}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
