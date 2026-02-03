"use client"
import { FormInput } from "@/shared/ui/forms"
import type React from "react"

import { useState } from "react"
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FileText, BadgeCheck, Copyright, ShieldCheck } from "lucide-react"
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard"
import { FormFileUpload } from "@/shared/ui/forms"
import { useApplyServerErrors } from "@/features/profile/_create/hooks/useApplyServerErrors"

const step3Schema = z
  .object({
    has_commercial_registration: z.boolean(),
    commercial_registration_number: z.string().optional(),
    commercial_registration_authority: z.string().optional(),
    commercial_registration_file: z.any().optional(),
    license_number: z.string().min(1, "رقم الترخيص مطلوب"),
    license_authority: z.string().min(1, "الجهة المصدرة مطلوبة"),
    license_file: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.has_commercial_registration) {
      if (!data.commercial_registration_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["commercial_registration_number"],
          message: "رقم السجل التجاري مطلوب",
        })
      }
      if (!data.commercial_registration_authority) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["commercial_registration_authority"],
          message: "جهة السجل التجاري مطلوبة",
        })
      }
    }
  })

type Step3Data = z.infer<typeof step3Schema>

interface CenterStep3Props {
  onNext: () => void
  onBack: () => void
  formData: Partial<Step3Data> & {
    commercial_registration_file?: File | null
    license_file?: File | null
  }
  updateFormData: (
    data: Partial<
      Step3Data & {
        commercial_registration_file?: File | null
        license_file?: File | null
      }
    >,
  ) => void
  globalErrors?: Record<string, string>
  setGlobalErrors?: (errors: Record<string, string>) => void
}

export function CenterFormStep3({
  onNext,
  onBack,
  formData,
  updateFormData,
  globalErrors,
}: CenterStep3Props) {
  const methods = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: "onChange",
    defaultValues: {
      has_commercial_registration: formData.has_commercial_registration || false,
      commercial_registration_number: formData.commercial_registration_number || "",
      commercial_registration_authority: formData.commercial_registration_authority || "",
      license_number: formData.license_number || "",
      license_authority: formData.license_authority || "",
    },
  })

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = methods

  const commercialRegistrationFileError =
    typeof errors.commercial_registration_file?.message === "string"
      ? errors.commercial_registration_file.message
      : undefined
  const licenseFileError =
    typeof errors.license_file?.message === "string"
      ? errors.license_file.message
      : undefined

  const stepFields = [
    "has_commercial_registration",
    "commercial_registration_number",
    "commercial_registration_authority",
    "commercial_registration_file",
    "license_number",
    "license_authority",
    "license_file",
  ] as const

  useApplyServerErrors<Step3Data>({
    errors: globalErrors,
    setError: methods.setError,
    fields: stepFields,
  })

  const hasCommercialReg = watch("has_commercial_registration")

  const [commercialRegFile, setCommercialRegFile] = useState<File | null>(formData.commercial_registration_file || null)
  const [licenseFile, setLicenseFile] = useState<File | null>(formData.license_file || null)

  const onSubmit = (data: Step3Data) => {
    updateFormData({
      ...data,
      commercial_registration_file: commercialRegFile,
      license_file: licenseFile,
    })
    onNext()
  }

  return (
    <FormStepCard
      title="انضم كمركز طبي إلى ميدنوفا"
      description="سجّل مركزك الطبي في منصة ميدنوفا لبدء تقديم الخدمات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          {/* Commercial Registration Toggle */}
          <div className="flex items-center gap-2 mb-3">
            <Controller
              name="has_commercial_registration"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="accent-primary"
                />
              )}
            />
            <span className="font-medium">يوجد سجل تجاري</span>
          </div>

          {hasCommercialReg && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="رقم السجل التجاري"
                placeholder="أدخل رقم السجل التجاري"
                icon={FileText}
                iconPosition="right"
                rtl
                error={errors.commercial_registration_number?.message}
                {...register("commercial_registration_number")}
              />

              <FormInput
                label="جهة السجل التجاري"
                placeholder="اسم الجهة"
                icon={BadgeCheck}
                iconPosition="right"
                rtl
                error={errors.commercial_registration_authority?.message}
                {...register("commercial_registration_authority")}
              />

              <div>
              <FormFileUpload
                type="file"
                label="ملف السجل التجاري"
                icon={Copyright}
                iconPosition="right"
                rtl
                error={commercialRegistrationFileError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (file) setCommercialRegFile(file)
                }}
              />
              </div>
            </div>
          )}

          {/* License Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="رقم الترخيص"
              placeholder="أدخل رقم الترخيص"
              icon={BadgeCheck}
              iconPosition="right"
              rtl
              error={errors.license_number?.message}
              {...register("license_number")}
            />

            <FormInput
              label="الجهة المصدرة للترخيص"
              placeholder="اسم الجهة"
              icon={FileText}
              iconPosition="right"
              rtl
              error={errors.license_authority?.message}
              {...register("license_authority")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FormFileUpload
                type="file"
                label="ملف الترخيص"
                icon={ShieldCheck}
                iconPosition="right"
                rtl
                error={licenseFileError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (file) setLicenseFile(file)
                }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <FormSubmitButton
              align="left"
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
