"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormFileUpload } from "@/shared/ui/forms";
import { toast } from "sonner";
import type { TherapistProfile } from "@/types/therpist";
import { useUpdateTherapist } from "@/features/profile/hooks/useUpdateTherapist";

type TherapistLicensesCardProps = {
  details: TherapistProfile["therapist_details"];
  userId: string;
  refetch: () => void;
  serverErrors?: Record<string, string>;
};

export function TherapistLicensesCard({
  details,
  userId,
  refetch,
  serverErrors,
}: TherapistLicensesCardProps) {
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    license_number: details?.license_number || "",
    license_authority: details?.license_authority || "",
    certificate_file: null as File | null,
    license_file: null as File | null,
  });

  const { update, isUpdating } = useUpdateTherapist();

  const handleSave = async () => {
    const payload = {
      ...formValues,
      customer_id: String(userId),
    };
    try {
      await update(payload);
      toast.success("تم تحديث التراخيص والمستندات بنجاح");
      setEditing(false);
      refetch();
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormValues({
      license_number: details?.license_number || "",
      license_authority: details?.license_authority || "",
      certificate_file: null,
      license_file: null,
    });
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>التراخيص والمستندات</CardTitle>
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

      <div className="p-4 grid gap-4 sm:grid-cols-2">
        {editing ? (
          <>
            <FormInput
              label="رقم الترخيص"
              value={formValues.license_number}
              onChange={(e) =>
                setFormValues((s) => ({ ...s, license_number: e.target.value }))
              }
              rtl
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
            />
            <FormFileUpload
              label="ملف الشهادة"
              onChange={(e) =>
                setFormValues((s) => ({
                  ...s,
                  certificate_file: e.target.files?.[0] ?? null,
                }))
              }
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
            <Field label="رقم الترخيص" value={details?.license_number || "-"} />
            <Field
              label="جهة الترخيص"
              value={details?.license_authority || "-"}
            />
            <Field
              label="ملف الشهادة"
              value={
                details?.certificate_file ? (
                  <a
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                    href={details.certificate_file}
                  >
                    عرض
                  </a>
                ) : (
                  "-"
                )
              }
            />
            <Field
              label="ملف الترخيص"
              value={
                details?.license_file ? (
                  <a
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noreferrer"
                    href={details.license_file}
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
      </div>
    </Card>
  );
}

// مكون مساعدة لعرض الحقول عند عدم التعديل
const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500 mb-1">{label}</span>
    <span>{value}</span>
  </div>
);
