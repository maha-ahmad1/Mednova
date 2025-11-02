"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FormInput, FormFileUpload } from "@/shared/ui/forms"
import { toast } from "sonner"
import { useUpdateCenter } from "@/features/profile/_views/hooks/useUpdateCenter"
import type { CenterProfile } from "@/types/center"
import { registrationSchema } from "@/lib/validation"
import { Loader2, Edit, FileText, Shield, Building, Award, Download, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type CenterRegistrationCardProps = {
  details: CenterProfile["center_details"]
  userId: string
  refetch: () => void
}

export function CenterRegistrationCard({ details, userId, refetch }: CenterRegistrationCardProps) {
  const [editing, setEditing] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [localDetails, setLocalDetails] = useState(details)
  const [formValues, setFormValues] = useState({
    has_commercial_registration: details?.has_commercial_registration || false,
    commercial_registration_number: details?.commercial_registration_number || "",
    commercial_registration_authority: details?.commercial_registration_authority || "",
    commercial_registration_file: null as File | null,
    license_number: details?.license_number || "",
    license_authority: details?.license_authority || "",
    license_file: null as File | null,
  })

  const { update, isUpdating } = useUpdateCenter()

  useEffect(() => {
    if (details) {
      setLocalDetails(details)
      setFormValues({
        has_commercial_registration: details.has_commercial_registration || false,
        commercial_registration_number: details.commercial_registration_number || "",
        commercial_registration_authority: details.commercial_registration_authority || "",
        commercial_registration_file: null,
        license_number: details.license_number || "",
        license_authority: details.license_authority || "",
        license_file: null,
      })
    }
  }, [details])

  const startEdit = () => {
    setEditing(true)
    setFormValues({
      has_commercial_registration: localDetails?.has_commercial_registration || false,
      commercial_registration_number: localDetails?.commercial_registration_number || "",
      commercial_registration_authority: localDetails?.commercial_registration_authority || "",
      commercial_registration_file: null,
      license_number: localDetails?.license_number || "",
      license_authority: localDetails?.license_authority || "",
      license_file: null,
    })
  }

  const cancelEdit = () => {
    setEditing(false)
    setServerErrors({})
    setFormValues({
      has_commercial_registration: localDetails?.has_commercial_registration || false,
      commercial_registration_number: localDetails?.commercial_registration_number || "",
      commercial_registration_authority: localDetails?.commercial_registration_authority || "",
      commercial_registration_file: null,
      license_number: localDetails?.license_number || "",
      license_authority: localDetails?.license_authority || "",
      license_file: null,
    })
  }

  const getFieldError = (field: keyof typeof formValues) => {
    const serverError = serverErrors[field]
    if (serverError) return serverError

    if (field === "license_number" && !formValues.license_number) {
      return "رقم الترخيص مطلوب"
    }
    if (field === "license_authority" && !formValues.license_authority) {
      return "جهة الترخيص مطلوبة"
    }
    if (
      formValues.has_commercial_registration &&
      field === "commercial_registration_number" &&
      !formValues.commercial_registration_number
    ) {
      return "رقم السجل التجاري مطلوب"
    }
    if (
      formValues.has_commercial_registration &&
      field === "commercial_registration_authority" &&
      !formValues.commercial_registration_authority
    ) {
      return "جهة السجل التجاري مطلوبة"
    }

    return undefined
  }

  const handleSave = async () => {
    const result = registrationSchema.safeParse(formValues)
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

    const payload = {
      ...formValues,
      customer_id: String(userId),
    }
    try {
      await update(payload)
      toast.success("تم تحديث التراخيص والمستندات بنجاح")
      setEditing(false)
      setServerErrors({})
      refetch()
    } catch (error: any) {
      const apiErrors = error?.response?.data?.data || {}
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

  const FileLink: React.FC<{ 
    url?: string; 
    label: string;
    icon: React.ReactNode;
  }> = ({ url, label, icon }) => (
    url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[#32A88D] hover:text-[#2a8a7a] transition-colors duration-200 font-medium"
      >
        {icon}
        {label}
        <Download className="w-4 h-4" />
      </a>
    ) : (
      <span className="text-gray-500">-</span>
    )
  )

  const displayDetails = localDetails ?? details

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">التراخيص والسجلات</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل التراخيص
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
          {/* حالة السجل التجاري */}
          <FieldDisplay
            icon={<Building className="w-5 h-5" />}
            label="السجل التجاري"
            value={
              <div className="flex items-center gap-2">
                {displayDetails?.has_commercial_registration ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      مسجل تجارياً
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-gray-400" />
                    <Badge variant="outline" className="text-gray-600">
                      غير مسجل تجارياً
                    </Badge>
                  </>
                )}
              </div>
            }
          />

          {/* بيانات السجل التجاري */}
          {displayDetails?.has_commercial_registration && (
            <>
              <FieldDisplay
                icon={<FileText className="w-5 h-5" />}
                label="رقم السجل التجاري"
                value={
                  displayDetails.commercial_registration_number ? (
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {displayDetails.commercial_registration_number}
                    </Badge>
                  ) : "-"
                }
              />
              
              <FieldDisplay
                icon={<Building className="w-5 h-5" />}
                label="جهة السجل التجاري"
                value={displayDetails.commercial_registration_authority || "-"}
              />
              
              <FieldDisplay
                icon={<FileText className="w-5 h-5" />}
                label="ملف السجل التجاري"
                value={
                  <FileLink 
                    url={displayDetails.commercial_registration_file}
                    label="عرض السجل التجاري"
                    icon={<FileText className="w-4 h-4" />}
                  />
                }
              />
            </>
          )}

          {/* بيانات الترخيص */}
          <FieldDisplay
            icon={<Shield className="w-5 h-5" />}
            label="رقم الترخيص"
            value={
              displayDetails?.license_number ? (
                <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {displayDetails.license_number}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<Award className="w-5 h-5" />}
            label="جهة الترخيص"
            value={displayDetails?.license_authority || "-"}
          />
          
          <FieldDisplay
            icon={<Shield className="w-5 h-5" />}
            label="ملف الترخيص"
            value={
              <FileLink 
                url={displayDetails?.license_file}
                label="عرض الترخيص"
                icon={<Shield className="w-4 h-4" />}
              />
            }
          />
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل التراخيص والسجلات
          </h4>
          
          <div className="space-y-6">
            {/* السجل التجاري */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-4 h-4 text-[#32A88D]" />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formValues.has_commercial_registration}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        has_commercial_registration: e.target.checked,
                      }))
                    }
                    className="accent-[#32A88D] w-4 h-4"
                  />
                  <span className="font-medium text-gray-700">يوجد سجل تجاري</span>
                </div>
              </div>

              {formValues.has_commercial_registration && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormInput
                    label="رقم السجل التجاري"
                    value={formValues.commercial_registration_number}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        commercial_registration_number: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("commercial_registration_number")}
                    className="bg-gray-50"
                    placeholder="أدخل رقم السجل التجاري"
                  />
                  <FormInput
                    label="جهة السجل التجاري"
                    value={formValues.commercial_registration_authority}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        commercial_registration_authority: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("commercial_registration_authority")}
                    className="bg-gray-50"
                    placeholder="أدخل جهة السجل التجاري"
                  />
                  <div className="md:col-span-2">
                    <FormFileUpload
                      label="ملف السجل التجاري"
                      onChange={(e) =>
                        setFormValues((s) => ({
                          ...s,
                          commercial_registration_file: e.target.files?.[0] ?? null,
                        }))
                      }
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* الترخيص */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#32A88D]" />
                معلومات الترخيص
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="رقم الترخيص"
                  value={formValues.license_number}
                  onChange={(e) => setFormValues((s) => ({ ...s, license_number: e.target.value }))}
                  rtl
                  error={getFieldError("license_number")}
                  className="bg-gray-50"
                  placeholder="أدخل رقم الترخيص"
                />
                <FormInput
                  label="جهة الترخيص"
                  value={formValues.license_authority}
                  onChange={(e) =>
                    setFormValues((s) => ({
                      ...s,
                      license_authority: e.target.value,
                    }))
                  }
                  rtl
                  error={getFieldError("license_authority")}
                  className="bg-gray-50"
                  placeholder="أدخل جهة الترخيص"
                />
                <div className="md:col-span-2">
                  <FormFileUpload
                    label="ملف الترخيص"
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        license_file: e.target.files?.[0] ?? null,
                      }))
                    }
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* عرض الملفات الحالية إن وجدت */}
            {(displayDetails?.commercial_registration_file || displayDetails?.license_file) && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-3">الملفات الحالية:</h5>
                <div className="flex flex-wrap gap-4">
                  {displayDetails.commercial_registration_file && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#32A88D]" />
                      <a
                        href={displayDetails.commercial_registration_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#32A88D] hover:underline flex items-center gap-1"
                      >
                        السجل التجاري الحالي
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {displayDetails.license_file && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#32A88D]" />
                      <a
                        href={displayDetails.license_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#32A88D] hover:underline flex items-center gap-1"
                      >
                        الترخيص الحالي
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  رفع ملف جديد سيستبدل الملف الحالي
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}