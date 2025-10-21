"use client"

import type React from "react"

import { useForm, Controller, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormInput, FormSelect } from "@/shared/ui/forms"
import { Home } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton"
import { useSession } from "next-auth/react"
import { usePatient } from "../../hooks/usePatient"
import type { PatientFormValues } from "@/types/patient"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AxiosError } from "axios"
import { handleFormErrors } from "@/lib/handleFormErrors"
import { showSuccessToast } from "@/lib/toastUtils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// ✅ Zod Schema for Step 2
const patientStep2Schema = z.object({
  gender: z.enum(["male", "female"]).refine((val) => !!val, { message: "يرجى تحديد الجنس" }),
  address: z.string().min(1, "العنوان مطلوب"),
})

export interface PatientFormData {
  birth_date?: string
  gender?: "male" | "female"
  image?: File | null
  emergency_phone?: string
  relationship?: string
  address?: string
  countryCode?: string
}

type PatientStep2FormData = z.infer<typeof patientStep2Schema>

interface PatientFormStep2Props {
  onNext: () => void
  onBack: () => void
  formData: PatientFormData
  updateFormData: (data: PatientFormData) => void
}

export function PatientFormStep2({ onNext, onBack, formData, updateFormData }: PatientFormStep2Props) {
  const { storePatient } = usePatient()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(formData.image || null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [networkError, setNetworkError] = useState(false)
  const router = useRouter()
  const [countryCode] = useState(formData.countryCode || "+968")

  const methods = useForm<PatientStep2FormData>({
    resolver: zodResolver(patientStep2Schema),
    mode: "onChange",
    defaultValues: {
      gender: formData.gender || undefined,
      address: formData.address || "",
    },
  })

  useEffect(() => {
    if (formData.image) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(formData.image)
    }
  }, [formData.image])

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
              <div className="flex gap-2 w-full">
                <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
                  رجوع
                </Button>
                <Button onClick={() => window.location.reload()} className="flex-1 bg-[#32A88D] hover:bg-[#2a9178]">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة المحاولة
                </Button>
              </div>
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
    setError,
  } = methods

  const onSubmit = async (data: PatientStep2FormData) => {
    console.log("Starting form submission...")
    console.log(" Session:", session)
    console.log(" Form data:", data)
    console.log(" Combined formData:", formData)

    if (!session?.user?.id) {
      console.log(" No session found, aborting submission")
      toast.error("يرجى تسجيل الدخول أولاً")
      return
    }

    if (!navigator.onLine) {
      toast.error("لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك.")
      return
    }

    try {
      setIsLoading(true)

      const emergencyPhoneWithCode = formData.emergency_phone ? `${countryCode}${formData.emergency_phone}` : ""

      const payload: PatientFormValues = {
        customer_id: session.user.id,
        gender: data.gender === "male" ? "Male" : "Female",
        birth_date: formData.birth_date,
        image: imageFile,
        emergency_phone: emergencyPhoneWithCode,
        relationship: formData.relationship,
        address: data.address,
      }

      console.log(" Payload to send:", payload)

      const response = await storePatient(payload)

      console.log(" Response received:", response)
      showSuccessToast("تم حفظ البيانات بنجاح!")
      updateFormData({
        ...formData,
        gender: data.gender,
        address: data.address,
        image: imageFile,
      })
      router.replace("/profile/patientinfo")

      onNext()
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string; data?: Record<string, string[]> }>
      console.log(" Error caught in onSubmit:", error)
      console.log(" Error response:", err.response)
      console.log(" Error status:", err.response?.status)
      console.log(" Error data:", err.response?.data)

      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        toast.error("فشل الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل.")
        setNetworkError(true)
        return
      }

      if (err.response?.status === 401) {
        console.log(" 401 Unauthorized error detected")
        toast.error("انتهت جلستك. يرجى تسجيل الدخول مرة أخرى")
        return
      }

      if (err.response?.status === 422) {
        console.log(" 422 Validation error detected")
        handleFormErrors<PatientStep2FormData>(
          error as AxiosError<{
            message?: string
            data?: Record<string, string[]>
          }>,
          setError,
        )
        return
      }

      console.log(" Other error type")
      const errorMessage = err.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      console.log(" Form submission completed")
    }
  }

  const handleBack = () => {
    const currentData = methods.getValues()
    updateFormData({
      gender: currentData.gender,
      address: currentData.address,
      image: imageFile,
    })
    onBack()
  }

  return (
    <>
      {/* <div className="mb-10 mr-60 ">
        <h1 className="text-2xl font-bold">معلومات المريض الشخصية</h1>

        <p className="text-sm text-gray-600 leading-relaxed mt-2">
          يرجى تعبئة البيانات التالية بدقة لتسهيل إجراءات المتابعة الطبية داخل منصة
          <span className="text-[#32A88D] font-medium"> ميدنوفا</span>.
        </p>
      </div> */}

      <Card className="max-w-5xl mx-auto shadow-lg border-0">
        <CardHeader className="space-y-2" dir="rtl">
          <CardTitle className="text-2xl font-bold text-foreground">إدخال بيانات المريض </CardTitle>
          <CardDescription className="text-md">قم بإدخال بياناتك للانضمام الى منصة ميدنوفا</CardDescription>
        </CardHeader>
        <CardContent className="px-14 ">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Controller
                  name="gender"
                  control={methods.control}
                  render={({ field }) => (
                    <FormSelect
                      label="الجنس"
                      rtl
                      options={[
                        { value: "male", label: "ذكر" },
                        { value: "female", label: "أنثى" },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.gender?.message}
                    />
                  )}
                />

                <FormInput
                  label="عنوان السكن"
                  placeholder="أدخل العنوان"
                  icon={Home}
                  iconPosition="right"
                  rtl
                  error={errors.address?.message}
                  {...methods.register("address")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="رفع الصورة الشخصية"
                  type="file"
                  accept="image/*"
                  rtl
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImageFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />

                {imagePreview && (
                  <div className="">
                    <Image
                      width={100}
                      height={100}
                      src={imagePreview || "/placeholder.svg"}
                      alt="معاينة الصورة"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <FormSubmitButton
                  align="left"
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] hover:bg-[#32A88D] hover:text-white"
                  disabled={isLoading}
                >
                  رجوع
                </FormSubmitButton>
                <FormSubmitButton size="sm" variant="default" className="px-6 py-5" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ البيانات"
                  )}
                </FormSubmitButton>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  )
}
