"use client"

import type React from "react"
import { useState, useEffect } from "react"
import * as z from "zod"
import { FormInput, FormSelect, ProfileImageUpload } from "@/shared/ui/forms"
import { FormPhoneInput } from "@/shared/ui/forms/components/FormPhoneInput"
import { Button } from "@/components/ui/button"
import { Loader2, Edit, Phone, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { CenterProfile } from "@/types/center"
import { useUpdateCenter } from "@/features/profile/_views/hooks/useUpdateCenter"
import { centerSchema } from "@/lib/validation"
import type { QueryObserverResult } from "@tanstack/react-query";
import Image from "next/image"

interface CenterPersonalCardProps {
  profile: CenterProfile
  userId: string
  // refetch may return the profile directly or an object with `data`.
  refetch: () => Promise<QueryObserverResult<CenterProfile | null, Error>>
}

export const CenterPersonalCard: React.FC<CenterPersonalCardProps> = ({ profile, userId, refetch }) => {
  const [editing, setEditing] = useState(false)
  type FormValues = Partial<Record<"phone" | "birth_date" | "gender" | "countryCode" | "image" | "name_center", unknown>>
  const [formValues, setFormValues] = useState<FormValues>({})
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [localProfile, setLocalProfile] = useState<Partial<CenterProfile> | null>(null)

  const { update, isUpdating } = useUpdateCenter({
    onValidationError: (errs) => setServerErrors(errs || {}),
  })

  useEffect(() => {
    if (!editing) {
      setFormValues({})
    }
  }, [profile, editing])

  const startEdit = () => {
    const source = localProfile ?? profile

    // Extract country code and phone number from full phone value
    const match = source?.phone?.match(/^(\+\d{1,4})(.*)$/)
    const countryCode = match ? match[1] : "+968"
    const phoneNumber = match ? match[2]?.trim() : (source?.phone ?? "")

    setFormValues({
      name_center: source?.name_center ?? "",
      birth_date: source?.birth_date ?? "",
      gender: source?.gender ?? "",
      phone: phoneNumber,
      countryCode: countryCode,
      image: null,
    })
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setFormValues({})
    setServerErrors({})
  }

  const handleSave = async () => {
    const result = centerSchema.safeParse(formValues)

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
    try {
      // Combine country code and phone number before sending
      const phone =
        typeof formValues.countryCode === "string" && typeof formValues.phone === "string"
        ? `${String(formValues.countryCode)}${formValues.phone}`
        : typeof formValues.phone === "string"
        ? formValues.phone
        : undefined

      const payload = {
        customer_id: String(userId),
        name_center: formValues.name_center as string | undefined,
        phone,
        birth_date: formValues.birth_date as string | undefined,
        gender: formValues.gender as string | undefined,
        image: formValues.image as File | string | undefined,
      } as unknown as import("@/app/api/center").CenterFormValues

      await update(payload)
      const refetchResult = await refetch()

      let fresh: CenterProfile | undefined
      const r = refetchResult as unknown
      if (!r) {
        fresh = undefined
      } else if (typeof r === "object" && r !== null && "data" in r) {
        fresh = (r as { data?: CenterProfile }).data
      } else {
        fresh = r as CenterProfile | undefined
      }

      if (fresh) setLocalProfile(fresh)
      setEditing(false)
      setServerErrors({})
      toast.success("تم حفظ التغييرات بنجاح")
    } catch (err) {
      // preserve existing behavior: show generic error toast
      console.error(err)
      toast.error("حدث خطأ أثناء التحديث")
    }
  }

  const getFieldError = (field: string) => {
    const serverError = serverErrors[field]
    const shape = centerSchema.shape as Record<string, z.ZodTypeAny>
    const rawValue = (formValues as Record<string, unknown>)[field]
    const valueForParse = field === "image" ? rawValue ?? null : rawValue ?? ""
    const clientError = shape[field]?.safeParse(valueForParse).error?.issues?.[0]?.message
    return serverError ?? clientError
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

  const displayProfile = localProfile ?? profile

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString('ar-EG')
  }

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">البيانات الأساسية</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل البيانات
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldDisplay
            icon={<User className="w-5 h-5" />}
            label="اسم المركز"
            value={displayProfile.name_center || "-"}
          />

          <FieldDisplay
            icon={<Phone className="w-5 h-5" />}
            label="رقم الهاتف"
            value={
              displayProfile.phone ? (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {displayProfile.phone}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<Calendar className="w-5 h-5" />}
            label="تاريخ التأسيس"
            value={
              displayProfile.birth_date ? (
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {formatDate(displayProfile.birth_date)}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<User className="w-5 h-5" />}
            label="النوع"
            value={
              <Badge className={`px-3 py-1 rounded-full text-sm ${
                displayProfile.gender === "Male" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-pink-100 text-pink-800"
              }`}>
                {displayProfile.gender === "Male" ? "ذكر" : "أنثى"}
              </Badge>
            }
          />

          <FieldDisplay
            icon={<User className="w-5 h-5" />}
            label="صورة المركز"
            value={
              displayProfile.image ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                  <Image
                    src={displayProfile.image}
                    alt="Center profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                "-"
              )
            }
          />
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل البيانات الأساسية
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="اسم المركز"
              value={formValues.name_center as string | undefined}
              onChange={(e) => setFormValues((s) => ({ ...s, name_center: e.target.value }))}
              rtl
              error={getFieldError("name_center")}
              className="bg-white"
            />

            <FormPhoneInput
              label="رقم الهاتف"
              countryCodeValue={String((formValues.countryCode as string) ?? "+968")}
              onCountryCodeChange={(code) => setFormValues((s) => ({ ...s, countryCode: code }))}
              value={(formValues.phone as string) ?? ""}
              onChange={(e) => setFormValues((s) => ({ ...s, phone: e.target.value }))}
              rtl
              iconPosition="right"
              placeholder="0000 0000"
              error={getFieldError("phone")}
              className="bg-white"
            />
            
            <FormInput
              label="تاريخ التأسيس"
              type="date"
              value={formValues.birth_date as string | undefined}
              onChange={(e) => setFormValues((s) => ({ ...s, birth_date: e.target.value }))}
              rtl
              error={getFieldError("birth_date")}
              className="bg-white"
            />
            
            <FormSelect
              label="النوع"
              options={[
                { value: "Male", label: "ذكر" },
                { value: "Female", label: "أنثى" },
              ]}
              value={formValues.gender as string | undefined}
              onValueChange={(val) => setFormValues((s) => ({ ...s, gender: val }))}
              rtl
              error={getFieldError("gender")}
              className="bg-white"
              placeholder="اختر النوع"
            />

            <div className="md:col-span-2">
              <ProfileImageUpload
                label="صورة المركز"
                file={(formValues.image as File | null) ?? null}
                initialImage={typeof displayProfile.image === "string" ? displayProfile.image : null}
                onChange={(file) => setFormValues((s) => ({ ...s, image: file }))}
                error={getFieldError("image")}
                rtl
              />
            </div>
          </div>

          {/* معاينة سريعة للبيانات */}
          {/* {(formValues.phone || formValues.birth_date || formValues.gender) && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
              <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#32A88D]" />
                معاينة البيانات:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {formValues.phone && (
                  <div>
                    <span className="text-gray-500">الهاتف: </span>
                    <span className="text-gray-800 font-medium">
                      {formValues.countryCode}{formValues.phone}
                    </span>
                  </div>
                )}
                {formValues.birth_date && (
                  <div>
                    <span className="text-gray-500">تاريخ التأسيس: </span>
                    <span className="text-gray-800 font-medium">
                      {formatDate(formValues.birth_date)}
                    </span>
                  </div>
                )}
                {formValues.gender && (
                  <div>
                    <span className="text-gray-500">النوع: </span>
                    <span className="text-gray-800 font-medium">
                      {formValues.gender === "Male" ? "ذكر" : "أنثى"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  )
}
