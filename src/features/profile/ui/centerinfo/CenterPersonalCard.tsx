"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FormInput, FormSelect, FormFileUpload } from "@/shared/ui/forms"
import { Button } from "@/components/ui/button"
import { Loader2, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { CenterProfile } from "@/types/center"
import { useUpdateCenter } from "@/features/profile/hooks/useUpdateCenter";

interface CenterPersonalCardProps {
  profile: CenterProfile
  userId: string
  refetch: () => void
}

export const CenterPersonalCard: React.FC<CenterPersonalCardProps> = ({ profile, userId, refetch }) => {
  const [editing, setEditing] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [localProfile, setLocalProfile] = useState<Partial<CenterProfile> | null>(null)

  const { update, isUpdating } = useUpdateCenter({
    onValidationError: (errs) => setServerErrors(errs || {}),
  })

  useEffect(() => {
    if (!editing) {
      setFormValues({})
    }
  }, [profile])

  const startEdit = () => {
    const source = localProfile ?? profile
    setFormValues({
      birth_date: source?.birth_date ? String(source.birth_date) : "",
      gender: source?.gender === "Male" ? "Male" : source?.gender === "Female" ? "Female" : "",
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
    try {
      const payload = { ...formValues, customer_id: String(userId) }
      await update(payload)
      const refetchResult = await refetch()
      const fresh: CenterProfile | undefined = refetchResult?.data || refetchResult
      if (fresh) {
        setLocalProfile(fresh)
      }
      setEditing(false)
      setServerErrors({})
      toast.success("تم حفظ التغييرات بنجاح")
    } catch (err) {
      console.error(err)
      toast.error("حدث خطأ أثناء التحديث")
    }
  }

  const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="mt-1 text-gray-800">{value ?? "-"}</span>
    </div>
  )

  const displayProfile = localProfile ?? profile
  // const imageSrc =
  //   editing && formValues.image instanceof File ? URL.createObjectURL(formValues.image) : displayProfile.image

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* <div className="flex flex-col items-center">
          <div
            className={`w-32 h-32 rounded-full overflow-hidden border-2 ${editing ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"}`}
          >
            {imageSrc ? (
              <img src={imageSrc || "/placeholder.svg"} className="object-cover w-full h-full" alt="Center" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <Building2 className="w-8 h-8" />
              </div>
            )}
          </div>
          {editing && (
            <FormFileUpload
              label="تغيير الصورة"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setFormValues((s) => ({ ...s, image: file }))
              }}
            />
          )}
        </div> */}

        <div className="flex-1">
          <div className="flex justify-end mb-4">
            {editing ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isUpdating}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  حفظ
                </Button>
                <Button onClick={cancelEdit} variant="outline" size="sm">
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button onClick={startEdit} variant="outline" size="sm">
                تعديل
              </Button>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="تاريخ التأسيس" value={displayProfile.birth_date ?? "-"} />
              <Field label="النوع" value={<Badge>{displayProfile.gender === "Male" ? "ذكر" : "أنثى"}</Badge>} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <FormInput
                label="تاريخ التأسيس"
                type="date"
                value={formValues.birth_date}
                onChange={(e) => setFormValues((s) => ({ ...s, birth_date: e.target.value }))}
                rtl
                error={serverErrors.birth_date}
              />
              <FormSelect
                label="النوع"
                options={[
                  { value: "Male", label: "ذكر" },
                  { value: "Female", label: "أنثى" },
                ]}
                value={formValues.gender}
                onValueChange={(val) => setFormValues((s) => ({ ...s, gender: val }))}
                rtl
                error={serverErrors.gender}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
