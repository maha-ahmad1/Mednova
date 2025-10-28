"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/shared/ui/forms";
import { useUpdateTherapist } from "@/features/profile/hooks/useUpdateTherapist";
import { toast } from "sonner";
import type { TherapistFormValues } from "@/app/api/therapist";
import type { TherapistProfile } from "@/types/therpist";
import { medicalSpecialties } from "@/constants/medicalSpecialties";
import { medicalSchema } from "@/lib/validation";

type TherapistMedicalCardProps = {
  details: TherapistProfile["therapist_details"];
  userId: string;
  refetch: () => void;
  serverErrors?: Record<string, string>;
};

export function TherapistMedicalCard({
  details,
  userId,
  refetch,
  serverErrors = {},
}: TherapistMedicalCardProps) {
  const [editing, setEditing] = useState(false);

  const [values, setValues] = useState({
    medical_specialties_id: "",
    university_name: "",
    graduation_year: "",
    experience_years: "",
    countries_certified: "",
  });

  useEffect(() => {
    if (details) {
      setValues({
        medical_specialties_id:
          details?.medical_specialties?.id?.toString() || "",
        university_name: details?.university_name || "",
        graduation_year: details?.graduation_year?.toString() || "",
        experience_years: details?.experience_years?.toString() || "",
        countries_certified: Array.isArray(details?.countries_certified)
          ? details.countries_certified.join(", ")
          : details?.countries_certified || "",
      });
    }
  }, [details]);

  const { update, isUpdating } = useUpdateTherapist();

  const handleSave = async () => {
    const payload: TherapistFormValues = {
      ...values,
      customer_id: String(userId),
    };

    try {
      await update(payload);
      await refetch(); // ← انتظر جلب البيانات الجديدة أولًا
      toast.success("تم تحديث المؤهلات بنجاح");
      setEditing(false); // ← بعد أن يتم تحديث البيانات فعليًا
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const selectedSpecialty = medicalSpecialties.find(
    (s) => s.id.toString() === values.medical_specialties_id
  );
console.log("Server Errors in MedicalCard:", serverErrors);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>المؤهلات الطبية</CardTitle>
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
              onClick={() => setEditing(false)}
            >
              إلغاء
            </Button>
          </div>
        )}
      </CardHeader>

      {!editing ? (
        <div className="p-4 grid gap-2">
          <p>التخصص: {details?.medical_specialties?.name || "-"}</p>
          <p>الجامعة: {values.university_name || "-"}</p>
          <p>سنة التخرج: {values.graduation_year || "-"}</p>
          <p>الخبرة: {values.experience_years || "-"}</p>
          <p>الدول المعتمدة: {values.countries_certified || "-"}</p>
        </div>
      ) : (
        <div className="p-4 grid gap-4">
          <FormSelect
            label="التخصص"
            placeholder="اختر التخصص"
            options={medicalSpecialties.map((s) => ({
              value: s.id.toString(), // id للباك
              label: s.name, // الاسم للمستخدم
            }))}
            value={values.medical_specialties_id}
            onValueChange={(val) =>
              setValues((v) => ({ ...v, medical_specialties_id: val }))
            }
            rtl
            error={
              serverErrors.medical_specialties_id ??
              medicalSchema.shape.medical_specialties_id.safeParse(
                values.medical_specialties_id ?? ""
              ).error?.issues[0]?.message
            }
          />

          <FormInput
            label="اسم الجامعة"
            value={values.university_name}
            onChange={(e) =>
              setValues((v) => ({ ...v, university_name: e.target.value }))
            }
            rtl
            error={
              serverErrors.university_name ??
              medicalSchema.shape.university_name.safeParse(
                values.university_name ?? ""
              ).error?.issues[0]?.message
            }
          />

          <FormInput
            label="سنة التخرج"
            type="number"
            value={values.graduation_year}
            onChange={(e) =>
              setValues((v) => ({ ...v, graduation_year: e.target.value }))
            }
            rtl
            className="no-spinner"
            error={
              serverErrors.graduation_year ??
              medicalSchema.shape.graduation_year.safeParse(
                values.graduation_year ?? ""
              ).error?.issues[0]?.message
            }
          />

          <FormInput
            label="عدد سنوات الخبرة"
            type="number"
            value={values.experience_years}
            onChange={(e) =>
              setValues((v) => ({ ...v, experience_years: e.target.value }))
            }
            rtl
            className="no-spinner"
             error={serverErrors.experience_years}

          />

          <FormInput
            label="الدول المعتمدة"
            value={values.countries_certified}
            onChange={(e) =>
              setValues((v) => ({ ...v, countries_certified: e.target.value }))
            }
            rtl
            error={
              serverErrors.countries_certified ??
              medicalSchema.shape.countries_certified.safeParse(
                values.countries_certified ?? ""
              ).error?.issues[0]?.message
            }
          />
        </div>
      )}
    </Card>
  );
}
