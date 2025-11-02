"use client"

import { useForm, FormProvider, Controller } from "react-hook-form"
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton"
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { countries } from "@/constants/countries"
import { FormSelect } from "@/shared/ui/forms"

const step4Schema = z
  .object({
    country: z.string().min(1, "حقل البلد مطلوب."),
    city: z.string().min(1, "حقل المدينة مطلوب."),
    day_of_week: z.array(z.string()).min(1, "حقل أيام الدوام مطلوب."),
    start_time_morning: z.string().min(1, "حقل بداية الدوام الصباحي مطلوب."),
    end_time_morning: z.string().min(1, "حقل نهاية الدوام الصباحي مطلوب."),
    is_have_evening_time: z.union([z.literal(0), z.literal(1)]),
    start_time_evening: z.string().optional(),
    end_time_evening: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasEvening = data.is_have_evening_time === 1

    if (hasEvening) {
      if (!data.start_time_evening) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["start_time_evening"],
          message: "حقل بداية الدوام المسائي مطلوب.",
        })
      }
      if (!data.end_time_evening) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["end_time_evening"],
          message: "حقل نهاية الدوام المسائي مطلوب.",
        })
      }
    }
  })

type Step4Data = z.infer<typeof step4Schema>

const days = [
  { key: "Sunday", label: "الأحد" },
  { key: "Monday", label: "الإثنين" },
  { key: "Tuesday", label: "الثلاثاء" },
  { key: "Wednesday", label: "الأربعاء" },
  { key: "Thursday", label: "الخميس" },
  { key: "Friday", label: "الجمعة" },
  { key: "Saturday", label: "السبت" },
]

interface Step4Props {
  onBack: () => void
  onNext: () => void
  formData: Partial<Step4Data>
  updateFormData: (data: Partial<Step4Data>) => void
  globalErrors?: Record<string, string>
  setGlobalErrors?: (errors: Record<string, string>) => void
}

export function CenterFormStep4({ onBack, onNext, formData, updateFormData }: Step4Props) {
  const methods = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    mode: "onChange",
    defaultValues: {
      day_of_week: formData.day_of_week || [],
      start_time_morning: formData.start_time_morning || "",
      end_time_morning: formData.end_time_morning || "",
      is_have_evening_time: formData.is_have_evening_time === 1 ? 1 : 0,
      start_time_evening: formData.start_time_evening || "",
      end_time_evening: formData.end_time_evening || "",
      country: formData.country || "",
      city: formData.city || "",
    },
  })

  const { handleSubmit, control, watch, setValue } = methods
  const selectedDays = watch("day_of_week")
  const isEvening = watch("is_have_evening_time") === 1
  const country = watch("country")

  const toggleDay = (dayKey: string) => {
    if (selectedDays.includes(dayKey)) {
      setValue(
        "day_of_week",
        selectedDays.filter((d) => d !== dayKey),
      )
    } else {
      setValue("day_of_week", [...selectedDays, dayKey])
    }
  }

  const onSubmit = (data: Step4Data) => {
    updateFormData(data)
    onNext()
  }

  return (
    <FormStepCard
      title="انضم كمركز طبي إلى ميدنوفا"
      description="سجّل مركزك الطبي في منصة ميدنوفا لبدء تقديم الخدمات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          {/* Country & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <FormSelect
                  label="الدولة"
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val)
                    setValue("city", "")
                  }}
                  options={countries.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  error={fieldState.error?.message}
                  rtl
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({ field, fieldState }) => {
                const selectedCountry = countries.find((c) => c.name === country)
                return (
                  <FormSelect
                    label="المدينة"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={
                      selectedCountry?.cities.map((city) => ({
                        value: city,
                        label: city,
                      })) || []
                    }
                    error={fieldState.error?.message}
                    rtl
                  />
                )
              }}
            />
          </div>

          {/* Days */}
          <div className="flex flex-wrap gap-3 mb-4">
            {days.map((d) => (
              <label
                key={d.key}
                className={`px-4 py-2 border rounded-lg cursor-pointer ${
                  selectedDays.includes(d.key) ? "bg-[#32A88D] text-white" : "bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedDays.includes(d.key)}
                  onChange={() => toggleDay(d.key)}
                />
                {d.label}
              </label>
            ))}
          </div>

          {/* Morning Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Controller
              name="start_time_morning"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <label className="block mb-1 font-medium">بداية الدوام الصباحي</label>
                  <input type="time" {...field} className="border rounded-md p-2 w-full" />
                  {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="end_time_morning"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <label className="block mb-1 font-medium">نهاية الدوام الصباحي</label>
                  <input type="time" {...field} className="border rounded-md p-2 w-full" />
                  {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Evening toggle */}
          <div className="flex items-center gap-2 mb-3">
            <Controller
              name="is_have_evening_time"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value === 1}
                  onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
                  className="accent-primary"
                />
              )}
            />
            <span className="font-medium">يوجد دوام مسائي</span>
          </div>

          {/* Evening Time */}
          {isEvening && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="start_time_evening"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="block mb-1 font-medium">بداية الدوام المسائي</label>
                    <input type="time" {...field} className="border rounded-md p-2 w-full" />
                    {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="end_time_evening"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="block mb-1 font-medium">نهاية الدوام المسائي</label>
                    <input type="time" {...field} className="border rounded-md p-2 w-full" />
                    {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <FormSubmitButton
              type="button"
              onClick={onBack}
              className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] hover:text-white"
            >
              رجوع
            </FormSubmitButton>
            <FormSubmitButton className="px-6 py-5">التالي</FormSubmitButton>
          </div>
        </form>
      </FormProvider>
    </FormStepCard>
  )
}
