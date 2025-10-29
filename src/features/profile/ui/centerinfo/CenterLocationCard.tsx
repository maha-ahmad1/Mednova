"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormInput, FormSelect } from "@/shared/ui/forms"
import { toast } from "sonner"
import { countries } from "@/constants/countries"
import type { CenterProfile } from "@/types/center"
import { useUpdateLoction } from "@/features/profile/hooks/useUpdateLoction";

type CenterLocationCardProps = {
  details: CenterProfile
  userId: string
  refetch: () => void
  serverErrors?: Record<string, string>
}

export function CenterLocationCard({ details, userId, refetch, serverErrors }: CenterLocationCardProps) {
  const location = details?.location_details

  const [editing, setEditing] = useState(false)

  const [values, setValues] = useState<{
    country: string
    city: string
    formatted_address: string
  }>({
    country: location?.country || "",
    city: location?.city || "",
    formatted_address: location?.formatted_address || "",
  })

  const { update, isUpdating } = useUpdateLoction()

  const handleSave = async () => {
    const payload = {
      ...values,
      customer_id: String(userId),
    }

    try {
      await update(payload)
      toast.success("تم تحديث الموقع بنجاح")
      setEditing(false)
      refetch()
    } catch {
      toast.error("حدث خطأ أثناء التحديث")
    }
  }

  const selectedCountry = countries.find((c) => c.name === values.country)

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>الموقع</CardTitle>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            تعديل
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              حفظ
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              إلغاء
            </Button>
          </div>
        )}
      </CardHeader>

      <div className="p-4 grid gap-4">
        {!editing ? (
          <>
            <p>الدولة: {values.country || "-"}</p>
            <p>المدينة: {values.city || "-"}</p>
            <p>العنوان: {values.formatted_address || "-"}</p>
          </>
        ) : (
          <>
            <FormSelect
              label="الدولة"
              placeholder="اختر الدولة"
              value={values.country}
              onValueChange={(val) => setValues((v) => ({ ...v, country: val, city: "" }))}
              options={countries.map((c) => ({ value: c.name, label: c.name }))}
              rtl
              error={serverErrors?.country}
            />
            <FormSelect
              label="المدينة"
              placeholder="اختر المدينة"
              value={values.city}
              onValueChange={(val) => setValues((v) => ({ ...v, city: val }))}
              options={(selectedCountry?.cities || []).map((c) => ({
                value: c,
                label: c,
              }))}
              rtl
              error={serverErrors?.city}
            />

            <FormInput
              label="العنوان"
              value={values.formatted_address}
              onChange={(e) => setValues((v) => ({ ...v, formatted_address: e.target.value }))}
              rtl
              error={serverErrors?.formatted_address}
            />
          </>
        )}
      </div>
    </Card>
  )
}
