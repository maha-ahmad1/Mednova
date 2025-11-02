"use client"
import { FormInput, FormSelect } from "@/shared/ui/forms"
import type React from "react"

import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton"
import { Controller, useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Home, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const step1Schema = z.object({
  gender: z.enum(["male", "female"]),
  birth_date: z.string().min(1, "تاريخ التأسيس مطلوب"),
  formatted_address: z.string().min(1, "العنوان مطلوب"),
  image: z.instanceof(File, { message: "يرجى رفع صورة المركز" }),
})

type Step1Data = z.infer<typeof step1Schema>

interface CenterStep1Props {
  onNext: () => void
  formData: Partial<Step1Data>
  updateFormData: (data: Partial<Step1Data>) => void
  globalErrors?: Record<string, string>
}

export function CenterFormStep1({ onNext, formData, updateFormData, globalErrors }: CenterStep1Props) {
  const { status } = useSession()

  const methods = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      gender: formData.gender || undefined,
      birth_date: formData.birth_date || "",
      formatted_address: formData.formatted_address || "",
      image: formData.image instanceof File ? formData.image : undefined,
    } as Partial<Step1Data>,
  })

  const [centerImage, setCenterImage] = useState<File | null>(
    formData.image && typeof formData.image !== "string" ? formData.image : null,
  )
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.image && typeof formData.image === "string" ? formData.image : null,
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCenterImage(file)
      methods.setValue("image", file, { shouldValidate: true })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setCenterImage(null)
    methods.resetField("image")
    setImagePreview(null)
  }

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
  } = methods

  useEffect(() => {
    if (globalErrors) {
      Object.entries(globalErrors).forEach(([field, message]) => {
        setError(field as keyof Step1Data, { type: "server", message })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalErrors])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
      </div>
    )
  }

  const onSubmit = (data: Step1Data) => {
    updateFormData(data)
    onNext()
  }

  return (
    <FormStepCard
      title="انضم كمركز طبي إلى ميدنوفا"
      description="سجّل مركزك الطبي في منصة ميدنوفا لبدء تقديم الخدمات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="نوع المركز"
                  rtl
                  options={[
                    { value: "male", label: "رجال" },
                    { value: "female", label: "نساء" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.gender?.message}
                />
              )}
            />

            <FormInput
              label="تاريخ التأسيس"
              placeholder="YYYY-MM-DD"
              type="date"
              rtl
              error={errors.birth_date?.message}
              {...register("birth_date")}
            />

            <FormInput
              label="العنوان"
              placeholder="عنوان المركز"
              icon={Home}
              iconPosition="right"
              rtl
              error={errors.formatted_address?.message}
              {...register("formatted_address")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput label="صورة المركز" type="file" accept="image/*" onChange={handleImageChange} />

            {imagePreview && (
              <div className="relative w-32 h-32">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Center preview"
                  fill
                  className="rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={removeImage}
                >
                  إزالة
                </Button>
              </div>
            )}
          </div>

          <FormSubmitButton className="px-6 py-5 mt-4">التالي</FormSubmitButton>
        </form>
      </FormProvider>
    </FormStepCard>
  )
}
