"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PatientProfile } from "./PatientInfo";
import { FormPhoneInput } from "@/shared/ui/forms/components/FormPhoneInput";
import { FormFileUpload } from "@/shared/ui/forms";

interface Props {
  patient: PatientProfile;
  onSave: (card: string) => void;
  isUpdating: boolean;
  errors: Record<string, string>;
  userId: string;
  editingCard: string | null;
  startEdit: (card: string) => void;
  cancelEdit: () => void;
  formValues: Record<string, any>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export default function PatientPersonal1Card({
  patient,
  onSave,
  isUpdating,
  errors,
  editingCard,
  startEdit,
  cancelEdit,
  formValues,
  setFormValues,
}: Props) {
  const isEditing = editingCard === "personal1";

  const handleChange = (field: keyof PatientProfile, value: string | File) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const imageSrc =
    isEditing && formValues.profile_image instanceof File
      ? URL.createObjectURL(formValues.profile_image)
      : patient.profile_image;

  return (
    <div className="border rounded-2xl p-6 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">البيانات الأساسية</h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => startEdit("personal1")}>
            تعديل
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => onSave("personal1")} disabled={isUpdating}>
              {isUpdating ? "جارٍ الحفظ..." : "حفظ"}
            </Button>
            <Button variant="ghost" onClick={cancelEdit}>
              إلغاء
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isEditing ? (
          <>
            <div>
              <label className="text-sm text-gray-600">الاسم الكامل</label>
              <Input
                value={formValues.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
              />
              {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">البريد الإلكتروني</label>
              <Input
                type="email"
                value={formValues.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">رقم الهاتف</label>
              <FormPhoneInput
                label=""
                countryCodeValue={formValues.countryCode || "+968"}
                onCountryCodeChange={(code) => handleChange("countryCode" as any, code)}
                value={formValues.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                rtl
                iconPosition="right"
                placeholder="0000 0000"
                error={errors.phone}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">تاريخ الميلاد</label>
              <Input
                type="date"
                value={formValues.birth_date || ""}
                onChange={(e) => handleChange("birth_date", e.target.value)}
              />
              {errors.birth_date && <p className="text-red-500 text-sm">{errors.birth_date}</p>}
            </div>
          </>
        ) : (
          <>
            <Field label="الاسم الكامل" value={patient.full_name} />
            <Field label="البريد الإلكتروني" value={patient.email} />
            <Field label="رقم الهاتف" value={patient.phone} />
            <Field label="تاريخ الميلاد" value={patient.birth_date} />
          </>
        )}
      </div>
    </div>
  );
}

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="mt-1 text-gray-800">{value ?? "-"}</span>
  </div>
);
