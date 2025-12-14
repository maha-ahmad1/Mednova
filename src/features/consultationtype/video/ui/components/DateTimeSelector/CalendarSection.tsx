"use client"
import { Calendar } from "@/components/ui/calendar"
import { ar } from "date-fns/locale"
import { useState, useEffect } from "react"

interface Props {
  selectedDate?: Date
  setSelectedDate: (d?: Date) => void
  timeZone?: string | undefined
}

export default function CalendarSection({ selectedDate, setSelectedDate, timeZone }: Props) {
  const [displayDate, setDisplayDate] = useState<Date | undefined>()

  // تحويل التاريخ للعرض حسب المنطقة الزمنية
  useEffect(() => {
    if (!selectedDate) {
      setDisplayDate(undefined)
      return
    }

    if (!timeZone) {
      setDisplayDate(selectedDate)
      return
    }

    try {
      const dateInTargetZone = new Date(selectedDate.toLocaleString('en-US', { timeZone }))
      setDisplayDate(dateInTargetZone)
    } catch (error) {
      console.error('خطأ في تحويل المنطقة الزمنية:', error)
      setDisplayDate(selectedDate)
    }
  }, [selectedDate, timeZone])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined)
      setDisplayDate(undefined)
      return
    }

    // تحديث العرض فوراً
    setDisplayDate(date)

    // إنشاء تاريخ UTC محايد للتخزين
    const neutralDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, 0, 0  // 12:00 ظهراً UTC
    ))
    
    setSelectedDate(neutralDate)
  }

  return (
    <div className="p-4 sm:p-6 order-1 xl:order-1 relative">
      <div className="mb-4 sm:mb-6 w-full max-w-[350px] mx-auto">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleDateSelect}
          locale={ar}
          className="rounded-md !cursor-pointer w-full"
          disabled={(date) => {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            return date < yesterday
          }}
        />
      </div>
    </div>
  )
}