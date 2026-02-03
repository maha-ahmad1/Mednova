"use client"

import { useState, useEffect } from "react"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/shared/ui/forms"
import { toast } from "sonner"
import type { CenterProfile } from "@/types/center"
import { useUpdateSchedule } from "@/features/profile/_views/hooks/useUpdateSchedule"
import { scheduleSchema } from "@/lib/validation"
import type { CenterFormValues } from "@/app/api/center"
// import type { TherapistFormValues } from "@/app/api/therapist"
import { Loader2, Edit, Calendar, Sun, Moon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import TimeZoneSelector from "@/features/consultationtype/video/ui/components/DateTimeSelector/TimeZoneSelector"

type CenterScheduleCardProps = {
  details: CenterProfile
  userId: string
  refetch: () => void
}

const days = [
  { key: "Sunday", label: "الأحد" },
  { key: "Monday", label: "الإثنين" },
  { key: "Tuesday", label: "الثلاثاء" },
  { key: "Wednesday", label: "الأربعاء" },
  { key: "Thursday", label: "الخميس" },
  { key: "Friday", label: "الجمعة" },
  { key: "Saturday", label: "السبت" },
]

export function CenterScheduleCard({ details, userId, refetch }: CenterScheduleCardProps) {
  const schedule = details?.schedules?.[0]

  const [editing, setEditing] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  const [values, setValues] = useState<{
    day_of_week: string[]
    start_time_morning: string
    end_time_morning: string
    timezone: string
    is_have_evening_time: number
    start_time_evening: string
    end_time_evening: string
  }>({
    day_of_week: Array.isArray(schedule?.day_of_week) ? (schedule.day_of_week as string[]) : [],
    start_time_morning: schedule?.start_time_morning || "",
    end_time_morning: schedule?.end_time_morning || "",
    timezone: details?.timezone || "", 
    is_have_evening_time: schedule?.is_have_evening_time ? 1 : 0,
    start_time_evening: schedule?.start_time_evening || "",
    end_time_evening: schedule?.end_time_evening || "",
  })

  const { update, isUpdating } = useUpdateSchedule()

  useEffect(() => {
    if (schedule) {
      setValues({
        day_of_week: Array.isArray(schedule.day_of_week) ? schedule.day_of_week : [],
        start_time_morning: schedule.start_time_morning || "",
        end_time_morning: schedule.end_time_morning || "",
        timezone: details?.timezone || "", // هنا أيضاً
        is_have_evening_time: schedule.is_have_evening_time ? 1 : 0,
        start_time_evening: schedule.start_time_evening || "",
        end_time_evening: schedule.end_time_evening || "",
      })
    }
  }, [schedule, details?.timezone]) // التبعية على details.timezone

  const startEdit = () => {
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setServerErrors({})
    setValues({
      day_of_week: Array.isArray(schedule?.day_of_week) ? schedule.day_of_week : [],
      start_time_morning: schedule?.start_time_morning || "",
      end_time_morning: schedule?.end_time_morning || "",
      timezone: details?.timezone || "", 
      is_have_evening_time: schedule?.is_have_evening_time ? 1 : 0,
      start_time_evening: schedule?.start_time_evening || "",
      end_time_evening: schedule?.end_time_evening || "",
    })
  }

  const getFieldError = (field: keyof typeof values) => {
    const serverError = serverErrors[field]
    const shape = scheduleSchema.shape as Record<string, z.ZodTypeAny>
    const clientError = shape[String(field)]?.safeParse((values as Record<string, unknown>)[String(field)])?.error?.issues?.[0]?.message
    return serverError ?? clientError
  }

  const toggleDay = (dayKey: string) => {
    setValues((v) => ({
      ...v,
      day_of_week: v.day_of_week.includes(dayKey)
        ? v.day_of_week.filter((d) => d !== dayKey)
        : [...v.day_of_week, dayKey],
    }))
  }

  const handleSave = async () => {
    const result = scheduleSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })
      setServerErrors(fieldErrors)
      toast.error("يرجى تصحيح الأخطاء قبل الحفظ")
      return
    }

    const payload: CenterFormValues = {
      ...values,
      is_have_evening_time: values.is_have_evening_time === 1,
      customer_id: String(userId),
      schedule_id: schedule?.id,

    }

    try {
      await update(payload as unknown as CenterFormValues)
      toast.success("تم تحديث الجدول بنجاح")
      setEditing(false)
      setServerErrors({})
      refetch()
    } catch (error: unknown) {
      const e = error as { response?: { data?: { data?: Record<string, string> } } } | undefined
      const apiErrors = e?.response?.data?.data ?? {}
      if (Object.keys(apiErrors).length > 0) {
        setServerErrors(apiErrors)
        toast.error("تحقق من الحقول قبل الحفظ")
      } else {
        toast.error("حدث خطأ أثناء التحديث")
      }
    }
  }

  const FieldDisplay: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: React.ReactNode;
    className?: string;
  }> = ({ icon, label, value, className }) => (
    <div className={`flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 ${className}`}>
      <div className="text-[#32A88D] mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-sm text-gray-500 block mb-2">{label}</span>
        <span className="text-gray-800 font-medium block">{value ?? "-"}</span>
      </div>
    </div>
  )

  const formatTime = (time: string) => {
    if (!time) return "-"
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getDayLabel = (dayKey: string) => {
    return days.find(d => d.key === dayKey)?.label || dayKey
  }

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">دوام العمل</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل الدوام
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isUpdating}
              size="sm"
              className="bg-[#32A88D] hover:bg-[#32A88D]/90 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center gap-2"
            >
              {isUpdating && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              حفظ التغييرات
            </Button>
            <Button 
              onClick={cancelEdit} 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-2"
            >
              إلغاء
            </Button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="grid grid-cols-1 gap-4">
          <FieldDisplay
            icon={<Calendar className="w-5 h-5" />}
            label="أيام العمل"
            value={
              values.day_of_week.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {values.day_of_week.map(day => (
                    <Badge 
                      key={day} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {getDayLabel(day)}
                    </Badge>
                  ))}
                </div>
              ) : "-"
            }
          />

          <FieldDisplay
            icon={<Calendar className="w-5 h-5" />}
            label="المنطقة الزمنية"
            value={
              values.timezone ? (
                <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                  {values.timezone}
                </Badge>
              ) : (
                "-"
              )
            }
          />
          
          <FieldDisplay
            icon={<Sun className="w-5 h-5" />}
            label="دوام الصباح"
            value={
              values.start_time_morning && values.end_time_morning ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                    {formatTime(values.start_time_morning)} - {formatTime(values.end_time_morning)}
                  </Badge>
                </div>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<Moon className="w-5 h-5" />}
            label="دوام المساء"
            value={
              values.is_have_evening_time && values.start_time_evening && values.end_time_evening ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {formatTime(values.start_time_evening)} - {formatTime(values.end_time_evening)}
                  </Badge>
                </div>
              ) : "لا يوجد دوام مسائي"
            }
          />
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل جدول الدوام
          </h4>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                المنطقة الزمنية
              </label>
              <TimeZoneSelector
                selectedTimeZone={values.timezone}
                onSelect={(val) => setValues((v) => ({ ...v, timezone: val }))}
                apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                showHeader={false}
                showIcon={false}
              />
              {getFieldError("timezone") && (
                <p className="text-red-500 text-sm mt-2">
                  {getFieldError("timezone")}
                </p>
              )}
            </div>
            {/* أيام العمل */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#32A88D]" />
                أيام العمل
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggleDay(d.key)}
                    className={`px-4 py-2 border rounded-xl transition-all duration-200 flex items-center gap-2 ${
                      values.day_of_week.includes(d.key)
                        ? "bg-[#32A88D] text-white border-[#32A88D] shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#32A88D] hover:text-[#32A88D]"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {getFieldError("day_of_week") && (
                <p className="text-red-500 text-sm mt-2">
                  {getFieldError("day_of_week")}
                </p>
              )}
            </div>

            {/* دوام الصباح */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                دوام الصباح
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="وقت البدء"
                  type="time"
                  value={values.start_time_morning}
                  onChange={(e) => setValues((v) => ({ ...v, start_time_morning: e.target.value }))}
                  rtl
                  error={getFieldError("start_time_morning")}
                  className="bg-gray-50"
                />

                <FormInput
                  label="وقت الانتهاء"
                  type="time"
                  value={values.end_time_morning}
                  onChange={(e) => setValues((v) => ({ ...v, end_time_morning: e.target.value }))}
                  rtl
                  error={getFieldError("end_time_morning")}
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* دوام المساء */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Moon className="w-4 h-4 text-indigo-500" />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={values.is_have_evening_time === 1}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        is_have_evening_time: e.target.checked ? 1 : 0,
                      }))
                    }
                    className="accent-[#32A88D] w-4 h-4"
                  />
                  <span className="font-medium text-gray-700">يوجد دوام مسائي</span>
                </div>
              </div>

              {values.is_have_evening_time === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="وقت البدء"
                    type="time"
                    value={values.start_time_evening}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        start_time_evening: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("start_time_evening")}
                    className="bg-gray-50"
                  />

                  <FormInput
                    label="وقت الانتهاء"
                    type="time"
                    value={values.end_time_evening}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        end_time_evening: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("end_time_evening")}
                    className="bg-gray-50"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}