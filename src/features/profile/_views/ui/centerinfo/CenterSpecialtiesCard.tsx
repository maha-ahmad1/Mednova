"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/shared/ui/forms"
import { toast } from "sonner"
import { medicalSpecialties } from "@/constants/medicalSpecialties"
import { Badge } from "@/components/ui/badge"
import { useUpdateCenter } from "@/features/profile/_views/hooks/useUpdateCenter"
import type { CenterProfile } from "@/types/center"
import { centerSpecialtiesSchema } from "@/lib/validation"
import { Loader2, Edit, GraduationCap, Calendar, Building, CheckCircle2 } from "lucide-react"

type CenterSpecialtiesCardProps = {
  details: CenterProfile["center_details"] & {
    medicalSpecialties?: Array<{ id: number; name: string }>
  }
  medicalSpecialtiesData: { id: number; name: string; description: string }[]
  userId: string
  refetch: () => void
  serverErrors?: Record<string, string>
}

export function CenterSpecialtiesCard({
  details,
  medicalSpecialtiesData,
  userId,
  refetch,
}: CenterSpecialtiesCardProps) {
  const [editing, setEditing] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [values, setValues] = useState({
    specialty_id: [] as string[],
    year_establishment: "",
  })

  const [localDetails, setLocalDetails] = useState<
    | (CenterProfile["center_details"] & {
        medicalSpecialties?: Array<{ id: number; name: string }>
      })
    | null
  >(null)

  const [localMedicalSpecialtiesData, setLocalMedicalSpecialtiesData] = useState<
    { id: number; name: string; description: string }[]
  >([])

  const { update, isUpdating } = useUpdateCenter({
    onValidationError: (errs) => setServerErrors(errs || {}),
  })

  useEffect(() => {
    if (details) {
      setLocalDetails(details)
    }
  }, [details])

  useEffect(() => {
    if (medicalSpecialtiesData) {
      setLocalMedicalSpecialtiesData(medicalSpecialtiesData)
    }
  }, [medicalSpecialtiesData])

  useEffect(() => {
    if (localDetails || localMedicalSpecialtiesData) {
      const specialtyIds = Array.isArray(localMedicalSpecialtiesData)
        ? localMedicalSpecialtiesData.map((s) => String(s.id))
        : []

      setValues({
        specialty_id: specialtyIds,
        year_establishment: localDetails?.year_establishment?.toString() || "",
      })
    }
  }, [localDetails, localMedicalSpecialtiesData])

  const startEdit = () => {
    const source = localDetails ?? details
    const specialtiesSource =
      localMedicalSpecialtiesData.length > 0 ? localMedicalSpecialtiesData : medicalSpecialtiesData

    const specialtyIds = Array.isArray(specialtiesSource) ? specialtiesSource.map((s) => String(s.id)) : []

    setValues({
      specialty_id: specialtyIds,
      year_establishment: source?.year_establishment?.toString() || "",
    })
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    const specialtyIds = Array.isArray(localMedicalSpecialtiesData)
      ? localMedicalSpecialtiesData.map((s) => String(s.id))
      : []

    setValues({
      specialty_id: specialtyIds,
      year_establishment: localDetails?.year_establishment?.toString() || "",
    })
    setServerErrors({})
  }

  const handleSave = async () => {
    const result = centerSpecialtiesSchema.safeParse(values)

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
      ...values,
      customer_id: String(userId),
    }

    try {
      await update(payload)
      await refetch()
      toast.success("تم تحديث التخصصات بنجاح")
      setEditing(false)
      setServerErrors({})
    } catch {
      toast.error("حدث خطأ أثناء التحديث")
    }
  }

  const getFieldError = (field: keyof typeof values) => {
    const serverError = serverErrors[field]
    const clientError = centerSpecialtiesSchema.shape[field]?.safeParse(values[field] ?? "").error?.issues[0]?.message
    return serverError ?? clientError
  }

  const toggleSpecialty = (specialtyId: string) => {
    setValues((v) => ({
      ...v,
      specialty_id: v.specialty_id.includes(specialtyId)
        ? v.specialty_id.filter((id) => id !== specialtyId)
        : [...v.specialty_id, specialtyId],
    }))
  }

  const selectedSpecialties = medicalSpecialties.filter((s) => values.specialty_id.includes(s.id.toString()))

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

  const displayDetails = localDetails ?? details

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">التخصصات وسنة التأسيس</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل التخصصات
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
            icon={<GraduationCap className="w-5 h-5" />}
            label="التخصصات الطبية"
            value={
              selectedSpecialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSpecialties.map((s) => (
                    <Badge 
                      key={s.id} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {s.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">لم يتم اختيار تخصصات</span>
              )
            }
          />
          
          <FieldDisplay
            icon={<Building className="w-5 h-5" />}
            label="سنة التأسيس"
            value={
              values.year_establishment ? (
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {values.year_establishment}
                </Badge>
              ) : "-"
            }
          />
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل التخصصات وسنة التأسيس
          </h4>
          
          <div className="space-y-6">
            {/* التخصصات الطبية */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#32A88D]" />
                التخصصات الطبية
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2">
                {medicalSpecialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    type="button"
                    onClick={() => toggleSpecialty(specialty.id.toString())}
                    className={`px-4 py-2 border rounded-xl transition-all duration-200 flex items-center gap-2 ${
                      values.specialty_id.includes(specialty.id.toString())
                        ? "bg-[#32A88D] text-white border-[#32A88D] shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#32A88D] hover:text-[#32A88D]"
                    }`}
                  >
                    {values.specialty_id.includes(specialty.id.toString()) && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {specialty.name}
                  </button>
                ))}
              </div>
              {getFieldError("specialty_id") && (
                <p className="text-red-500 text-sm mt-2">{getFieldError("specialty_id")}</p>
              )}
            </div>

            {/* سنة التأسيس */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#32A88D]" />
                سنة التأسيس
              </label>
              <FormInput
                label=""
                type="number"
                value={values.year_establishment}
                onChange={(e) => setValues((v) => ({ ...v, year_establishment: e.target.value }))}
                rtl
                className="no-spinner bg-gray-50"
                error={getFieldError("year_establishment")}
                placeholder="أدخل سنة التأسيس"
                min="1900"
                max="2100"
              />
            </div>

         

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">عدد التخصصات المختارة:</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {values.specialty_id.length} تخصص
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}