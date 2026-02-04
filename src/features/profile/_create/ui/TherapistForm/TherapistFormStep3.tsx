"use client";
import { FormInput } from "@/shared/ui/forms";
import { useState } from "react"
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, BadgeCheck, Copyright, ShieldCheck } from "lucide-react";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { FormFileUpload } from "@/shared/ui/forms";
import { useApplyServerErrors } from "@/features/profile/_create/hooks/useApplyServerErrors";

const step3Schema = z.object({
  license_number: z.string().min(1, "رقم الترخيص مطلوب"),
  license_authority: z.string().min(1, "الجهة المصدرة مطلوبة"),
  certificate_file: z.instanceof(File, { message: "ملف الشهادة مطلوب" }),
  license_file: z.instanceof(File, { message: "ملف الترخيص مطلوب" }),
});

type Step3Data = z.infer<typeof step3Schema>;

interface TherapistStep3Props {
  onNext: () => void
  onBack: () => void
  formData: Partial<Step3Data>
  updateFormData: (data: Partial<Step3Data>) => void
  globalErrors?: Record<string, string>
  setGlobalErrors?: (errors: Record<string, string>) => void
}

export function TherapistFormStep3({
  onNext,
  onBack,
  formData,
  updateFormData,
  globalErrors,
}: TherapistStep3Props) {
  const methods = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: "onChange",
    defaultValues: {
      license_number: formData.license_number || "",
      license_authority: formData.license_authority || "",
      certificate_file: formData.certificate_file instanceof File ? formData.certificate_file : undefined,
      license_file: formData.license_file instanceof File ? formData.license_file : undefined,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const certificateFileError =
    typeof errors.certificate_file?.message === "string"
      ? errors.certificate_file.message
      : undefined
  const licenseFileError =
    typeof errors.license_file?.message === "string"
      ? errors.license_file.message
      : undefined

  const stepFields = [
    "license_number",
    "license_authority",
    "certificate_file",
    "license_file",
  ] as const;

  useApplyServerErrors<Step3Data>({
    errors: globalErrors,
    setError: methods.setError,
    fields: stepFields,
  });

  const [certificateFile, setCertificateFile] = useState<File | undefined>(
    formData.certificate_file
  )
  const [licenseFile, setLicenseFile] = useState<File | undefined>(
    formData.license_file
  )

  const onSubmit = (data: Step3Data) => {
    updateFormData({
      ...data,
      certificate_file: certificateFile ?? undefined,
      license_file: licenseFile ?? undefined,
    })
    onNext()
  }

  const handleBack = () => {
    updateFormData({
      ...methods.getValues(),
      certificate_file: certificateFile ?? undefined,
      license_file: licenseFile ?? undefined,
    })
    onBack()
  }

  return (
    <FormStepCard
      title="انضم كمختص إلى ميدنوفا"
      description="سجّل كمختص في منصة ميدنوفا لبدء تقديم الاستشارات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
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
              label="الجهة المصدرة"
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
                label=" ملف الشهادة"
                icon={ShieldCheck}
                iconPosition="right"
                rtl
                error={certificateFileError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setCertificateFile(file)
                    methods.setValue("certificate_file", file, { shouldValidate: true })
                  }
                }}
              />
            </div>

            <div>
              <FormFileUpload
                type="file"
                label="   ملف الترخيص"
                icon={Copyright}
                iconPosition="right"
                rtl
                error={licenseFileError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setLicenseFile(file)
                    methods.setValue("license_file", file, { shouldValidate: true })
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <FormSubmitButton
              align="left"
              type="button"
              onClick={handleBack}
              className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] !hovetr:bg-[#32A88D] hover:text-white"
            >
              رجوع
            </FormSubmitButton>
            <FormSubmitButton className="px-6 py-5">التالي</FormSubmitButton>
          </div>
        </form>
      </FormProvider>
    </FormStepCard>
  );
}
