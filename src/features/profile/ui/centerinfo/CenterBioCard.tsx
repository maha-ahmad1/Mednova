"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TextArea } from "@/shared/ui/TextArea"
import { toast } from "sonner"
import type { CenterProfile } from "@/types/center"
import { useUpdateCenter } from "@/features/profile/hooks/useUpdateCenter";

type CenterBioCardProps = {
  details: CenterProfile["center_details"]
  userId: string
  refetch: () => void
}

export function CenterBioCard({ details, userId, refetch }: CenterBioCardProps) {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(details?.bio ?? "")
  const { update, isUpdating } = useUpdateCenter()

  useEffect(() => {
    if (details?.bio) setBio(details.bio)
  }, [details])

  const handleSave = async () => {
    const payload = {
      bio,
      customer_id: String(userId),
    }

    try {
      await update(payload)
      await refetch()
      toast.success("تم حفظ النبذة بنجاح")
      setEditing(false)
    } catch (err) {
      console.error(err)
      toast.error("حدث خطأ أثناء الحفظ")
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>نبذة عن المركز</CardTitle>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            تعديل
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              حفظ
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(false)
                setBio(details?.bio ?? "")
              }}
            >
              إلغاء
            </Button>
          </div>
        )}
      </CardHeader>

      {!editing ? (
        <div className="p-4">
          <p className="text-gray-800 whitespace-pre-wrap">{details?.bio || "-"}</p>
        </div>
      ) : (
        <div className="p-4">
          <TextArea label="نبذة عن المركز" rtl value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      )}
    </Card>
  )
}
