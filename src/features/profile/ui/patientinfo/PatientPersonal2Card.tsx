"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PatientProfile } from "./PatientInfo";

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

export default function PatientPersonal2Card({
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
  const isEditing = editingCard === "personal2";

  const handleChange = (field: keyof PatientProfile, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="border rounded-2xl p-6 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">معلومات إضافية</h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => startEdit("personal2")}>
            تعديل
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => onSave("personal2")} disabled={isUpdating}>
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
              <label className="text-sm text-gray-600">العنوان</label>
              <Input
                value={formValues.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600">جهة الاتصال للطوارئ</label>
              <Input
                value={formValues.emergency_contact || ""}
                onChange={(e) => handleChange("emergency_contact", e.target.value)}
              />
              {errors.emergency_contact && (
                <p className="text-red-500 text-sm">{errors.emergency_contact}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">الجنس</label>
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={formValues.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">اختر</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
          </>
        ) : (
          <>
            <Field label="العنوان" value={patient.address} />
            <Field label="جهة الاتصال للطوارئ" value={patient.emergency_contact} />
            <Field label="الجنس" value={patient.gender === "Male" ? "ذكر" : "أنثى"} />
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
