"use client"

import type React from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormInput } from "@/shared/ui/forms"
import { Mail, User, Phone, Heart, WifiOff, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { FormPhoneInput } from "@/shared/ui/forms"
import { useApplyServerErrors } from "@/features/profile/_create/hooks/useApplyServerErrors"
import { useClearServerErrorsOnChange } from "@/features/profile/_create/hooks/useClearServerErrorsOnChange"


// ✅ Zod Schema
const patientSchema = z.object({
  full_name: z.string().min(1, "الاسم الكامل مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  emergency_phone: z.string().min(1, "رقم الطوارئ مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  relationship: z.string().min(1, "صلة القرابة مطلوبة"),
  birth_date: z.string().min(1, "التاريخ الميلاد مطلوب"),
  
})

type PatientFormData = z.infer<typeof patientSchema>& {
  countryCode?: string
}

interface PatientFormStep1Props {
  onNext: () => void
  formData: PatientFormData
  updateFormData: (data: Partial<PatientFormData>) => void
  globalErrors?: Record<string, string>
  setGlobalErrors?: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >

}

export function PatientFormStep1({
  onNext,
  formData,
  updateFormData,
  globalErrors,
  setGlobalErrors,
}: PatientFormStep1Props) {
  const { data: session, status } = useSession()
  const [networkError, setNetworkError] = useState(false)
  const [countryCode, setCountryCode] = useState("+968")

  const methods = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
    defaultValues: {
      full_name: formData.full_name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      birth_date: formData.birth_date || "",
      emergency_phone: formData.emergency_phone || "",
      relationship: formData.relationship || "",
    },
  })

  useEffect(() => {
    if (status === "unauthenticated" && !navigator.onLine) {
      setNetworkError(true)
      toast.error("لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك بالشبكة.")
    } else if (status === "unauthenticated") {
      toast.error("لا يمكن الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل.")
    } else {
      setNetworkError(false)
    }
  }, [status])

  useEffect(() => {
    if (session?.user && !formData.full_name) {
      methods.reset({
        full_name: session.user.full_name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      })
    }
  }, [session?.user, methods, formData])

  
  const stepFields = [
    "full_name",
    "email",
    "phone",
    "birth_date",
    "emergency_phone",
    "relationship",
  ] as const

  useApplyServerErrors<PatientFormData>({
    errors: globalErrors,
    setError: methods.setError,
    fields: stepFields,
  })

  useClearServerErrorsOnChange<PatientFormData>({
    methods,
    setErrors: setGlobalErrors,
    fields: stepFields,
  })

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
      </div>
    )
  }

  if (networkError || (!session && status === "unauthenticated")) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <WifiOff className="h-12 w-12 text-destructive" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">مشكلة في الاتصال</h3>
                <p className="text-sm text-muted-foreground">
                  تأكد من:
                  <br />• اتصالك بالإنترنت
                  <br />• تشغيل الخادم (Backend Server)
                  <br />• صحة عنوان الـ API
                </p>
              </div>
              <Button onClick={() => window.location.reload()} className="w-full bg-[#32A88D] hover:bg-[#2a9178]">
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">غير مسجل دخول</h3>
                <p className="text-sm text-muted-foreground">يرجى تسجيل الدخول للمتابعة</p>
              </div>
              <Button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-[#32A88D] hover:bg-[#2a9178]"
              >
                تسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const {
    handleSubmit,
    formState: { errors },
  } = methods

  const onSubmit = async (data: PatientFormData) => {
    updateFormData({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      birth_date: data.birth_date,
      emergency_phone: data.emergency_phone, 
      relationship: data.relationship,
      countryCode: countryCode, 
    })

    onNext()
  }

  return (
    <>
      <Card className="max-w-5xl mx-auto shadow-lg border-0">
        <CardHeader className="space-y-2" dir="rtl">
          <CardTitle className="text-2xl font-bold text-foreground">إدخال بيانات المريض </CardTitle>
          <CardDescription className="text-md">قم بإدخال بياناتك للانضمام الى منصة ميدنوفا</CardDescription>
        </CardHeader>
        <CardContent className="px-14">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="الاسم الكامل"
                  placeholder="أدخل اسم المريض"
                  icon={User}
                  iconPosition="right"
                  rtl
                  error={errors.full_name?.message}
                  {...methods.register("full_name")}
                  readOnly
                />

                <FormInput
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="example@email.com"
                  icon={Mail}
                  iconPosition="right"
                  rtl
                  error={errors.email?.message}
                  {...methods.register("email")}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="رقم الهاتف"
                  placeholder="0000 0000"
                  icon={Phone}
                  iconPosition="right"
                  rtl
                  error={errors.phone?.message}
                  {...methods.register("phone")}
                  readOnly
                />
                <FormInput
                  label="تاريخ الميلاد"
                  placeholder="9/9/1999"
                  type="date"
                  rtl
                  error={errors.birth_date?.message}
                  {...methods.register("birth_date")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Controller
                  name="emergency_phone"
                  control={methods.control}
                  render={({ field }) => (
                    <FormPhoneInput
                      {...field}
                      label="جهة اتصال للطوارئ"
                      placeholder="0000 0000"
                      icon={Phone}
                      iconPosition="right"
                      rtl
                      countryCodeValue={countryCode}
                      onCountryCodeChange={setCountryCode}
                      error={errors.emergency_phone?.message}
                      className="no-spinner"
                    />
                  )}
                />

                <FormInput
                  label="صلة القرابة"
                  placeholder="صديق"
                  icon={Heart}
                  iconPosition="right"
                  rtl
                  error={errors.relationship?.message}
                  {...methods.register("relationship")}
                />
              </div>

              <FormSubmitButton className="py-5 px-6" size="sm" variant="default">
                التالي
              </FormSubmitButton>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  )
}
