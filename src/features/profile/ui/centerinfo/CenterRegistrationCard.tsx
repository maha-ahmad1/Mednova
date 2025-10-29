"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormInput, FormFileUpload } from "@/shared/ui/forms"
import { toast } from "sonner"
import { useUpdateCenter } from "@/features/profile/hooks/useUpdateCenter";
import type { CenterProfile } from "@/types/center"

type CenterRegistrationCardProps = {
  details: CenterProfile["center_details"]
  userId: string
  refetch: () => void
  serverErrors?: Record<string, string>
}

export function CenterRegistrationCard({ details, userId, refetch, serverErrors }: CenterRegistrationCardProps) {
  const [editing, setEditing] = useState(false)
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

  const handleSave = async () => {
    const payload = {
      ...formValues,
      customer_id: String(userId),
    }
    try {
      await update(payload)
      toast.success("تم تحديث التراخيص والمستندات بنجاح")
      setEditing(false)
      refetch()
    } catch {
      toast.error("حدث خطأ أثناء التحديث")
    }
  }

  const cancelEdit = () => {
    setEditing(false)
    setFormValues({
      has_commercial_registration: details?.has_commercial_registration || false,
      commercial_registration_number: details?.commercial_registration_number || "",
      commercial_registration_authority: details?.commercial_registration_authority || "",
      commercial_registration_file: null,
      license_number: details?.license_number || "",
      license_authority: details?.license_authority || "",
      license_file: null,
    })
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>التراخيص والسجلات</CardTitle>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            تعديل
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              حفظ
            </Button>
            <Button size="sm" variant="outline" onClick={cancelEdit}>
              إلغاء
            </Button>
          </div>
        )}
      </CardHeader>

      <div className="p-4 grid gap-4">
        {editing ? (
          <>
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
                className="accent-primary"
              />
              <span className="font-medium">يوجد سجل تجاري</span>
            </div>

            {formValues.has_commercial_registration && (
              <>
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
                  error={serverErrors?.commercial_registration_number}
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
                  error={serverErrors?.commercial_registration_authority}
                />
                <FormFileUpload
                  label="ملف السجل التجاري"
                  onChange={(e) =>
                    setFormValues((s) => ({
                      ...s,
                      commercial_registration_file: e.target.files?.[0] ?? null,
                    }))
                  }
                />
              </>
            )}

            <FormInput
              label="رقم الترخيص"
              value={formValues.license_number}
              onChange={(e) => setFormValues((s) => ({ ...s, license_number: e.target.value }))}
              rtl
              error={serverErrors?.license_number}
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
              error={serverErrors?.license_authority}
            />
            <FormFileUpload
              label="ملف الترخيص"
              onChange={(e) =>
                setFormValues((s) => ({
                  ...s,
                  license_file: e.target.files?.[0] ?? null,
                }))
              }
            />
          </>
        ) : (
          <>
            <Field label="السجل التجاري" value={details?.has_commercial_registration ? "نعم" : "لا"} />
            {details?.has_commercial_registration && (
              <>
                <Field label="رقم السجل التجاري" value={details?.commercial_registration_number || "-"} />
                <Field label="جهة السجل التجاري" value={details?.commercial_registration_authority || "-"} />
                <Field
                  label="ملف السجل التجاري"
                  value={
                    details?.commercial_registration_file ? (
                      <a
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noreferrer"
                        href={details.commercial_registration_file}
                      >
                        عرض
                      </a>
                    ) : (
                      "-"
                    )
                  }
                />
              </>
            )}
            <Field label="رقم الترخيص" value={details?.license_number || "-"} />
            <Field label="جهة الترخيص" value={details?.license_authority || "-"} />
            <Field
              label="ملف الترخيص"
              value={
                details?.license_file ? (
                  <a className="text-blue-600 underline" target="_blank" rel="noreferrer" href={details.license_file}>
                    عرض
                  </a>
                ) : (
                  "-"
                )
              }
            />
          </>
        )}
      </div>
    </Card>
  )
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500 mb-1">{label}</span>
    <span>{value}</span>
  </div>
)
