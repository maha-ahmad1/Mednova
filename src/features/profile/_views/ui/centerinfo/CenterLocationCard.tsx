"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FormInput, FormSelect } from "@/shared/ui/forms"
import { toast } from "sonner"
import { countries } from "@/constants/countries"
import type { CenterProfile } from "@/types/center"
import { useUpdateLoction } from "@/features/profile/_views/hooks/useUpdateLoction"
import { locationSchema } from "@/lib/validation"
import { Loader2, Edit, MapPin, Navigation, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type CenterLocationCardProps = {
  details: CenterProfile
  userId: string
  refetch: () => void
}

export function CenterLocationCard({ details, userId, refetch }: CenterLocationCardProps) {
  const location = details?.location_details

  const [editing, setEditing] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  const [values, setValues] = useState({
    country: "",
    city: "",
    formatted_address: "",
  })

  const { update, isUpdating } = useUpdateLoction({
    onValidationError: (errors) => setServerErrors(errors),
  })

  useEffect(() => {
    if (location) {
      setValues({
        country: location.country || "",
        city: location.city || "",
        formatted_address: location.formatted_address || "",
      })
    }
  }, [location])

  const getFieldError = (field: keyof typeof values) => {
    const serverError = serverErrors[field]
    const schema = locationSchema.pick({ [field]: true })
    const clientError = schema.safeParse({ [field]: values[field] }).error?.issues[0]?.message
    return serverError ?? clientError ?? formErrors[field]
  }

  const startEdit = () => {
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    if (location) {
      setValues({
        country: location.country || "",
        city: location.city || "",
        formatted_address: location.formatted_address || "",
      })
    }
    setFormErrors({})
    setServerErrors({})
  }

  const handleSave = async () => {
    const validation = locationSchema.safeParse(values)
    if (!validation.success) {
      const newErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        newErrors[key] = issue.message
      })
      setFormErrors(newErrors)
      toast.error("يرجى تصحيح الأخطاء قبل الحفظ")
      return
    }

    const payload = {
      ...values,
      customer_id: String(userId),
    }

    try {
      setServerErrors({})
      await update(payload)
      toast.success("تم تحديث الموقع بنجاح")
      setEditing(false)
      setFormErrors({})
      refetch()
    } catch {
      toast.error("حدث خطأ أثناء التحديث")
    }
  }

  const selectedCountry = countries.find((c) => c.name === values.country)

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

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">موقع المركز</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل الموقع
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
            icon={<Globe className="w-5 h-5" />}
            label="الدولة"
            value={
              values.country ? (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {values.country}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<MapPin className="w-5 h-5" />}
            label="المدينة"
            value={
              values.city ? (
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {values.city}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<Navigation className="w-5 h-5" />}
            label="العنوان التفصيلي"
            value={values.formatted_address || "-"}
          />

          {/* خريطة مصغرة أو رابط الخريطة */}
          {values.country && values.city && (
            <div className="bg-white p-4 rounded-lg border border-gray-100 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#32A88D]" />
                <span>موقع المركز: {values.city}, {values.country}</span>
              </div>
              {values.formatted_address && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {values.formatted_address}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل موقع المركز
          </h4>
          
          <div className="grid grid-cols-1 gap-6">
            <FormSelect
              label="الدولة"
              placeholder="اختر الدولة"
              value={values.country}
              onValueChange={(val) => setValues((v) => ({ ...v, country: val, city: "" }))}
              options={countries.map((c) => ({ value: c.name, label: c.name }))}
              rtl
              error={getFieldError("country")}
              className="bg-white"
            />

            <FormSelect
              label="المدينة"
              placeholder={values.country ? "اختر المدينة" : "اختر الدولة أولاً"}
              value={values.city}
              onValueChange={(val) => setValues((v) => ({ ...v, city: val }))}
              options={(selectedCountry?.cities || []).map((c) => ({
                value: c,
                label: c,
              }))}
              rtl
              error={getFieldError("city")}
              className="bg-white"
              disabled={!values.country}
            />

            <FormInput
              label="العنوان التفصيلي"
              value={values.formatted_address}
              onChange={(e) => setValues((v) => ({ ...v, formatted_address: e.target.value }))}
              rtl
              error={getFieldError("formatted_address")}
              className="bg-white"
              placeholder="أدخل العنوان الكامل للمركز"
            />

            {/* معاينة الموقع */}
            {(values.country || values.city) && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#32A88D]" />
                  معاينة موقع المركز:
                </h5>
                <div className="text-sm text-gray-600">
                  {values.country && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                      {values.country}
                    </span>
                  )}
                  {values.city && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                      {values.city}
                    </span>
                  )}
                </div>
                {values.formatted_address && (
                  <p className="text-gray-700 text-sm mt-2 p-2 bg-gray-50 rounded">
                    {values.formatted_address}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}