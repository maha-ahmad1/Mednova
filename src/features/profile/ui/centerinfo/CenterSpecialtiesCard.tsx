"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/shared/ui/forms";
import { toast } from "sonner";
import { medicalSpecialties } from "@/constants/medicalSpecialties";
import { Badge } from "@/components/ui/badge";
import { useUpdateCenter } from "@/features/profile/hooks/useUpdateCenter";
import type { CenterProfile } from "@/types/center";

type CenterSpecialtiesCardProps = {
  details: CenterProfile["center_details"] & {
    medicalSpecialties?: Array<{ id: number; name: string }>;
  };
  medicalSpecialtiesData: { id: number; name: string; description: string }[];
  userId: string;
  refetch: () => void;
  serverErrors?: Record<string, string>;
};

export function CenterSpecialtiesCard({
  details,
  medicalSpecialtiesData,
  userId,
  refetch,
  serverErrors = {},
}: CenterSpecialtiesCardProps) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({
    specialty_id: [] as string[],
    year_establishment: "",
  });

  useEffect(() => {
    if (details || medicalSpecialtiesData) {
      const specialtyIds = Array.isArray(medicalSpecialtiesData)
        ? medicalSpecialtiesData.map((s) => String(s.id))
        : [];

      setValues({
        specialty_id: specialtyIds,
        year_establishment: details?.year_establishment?.toString() || "",
      });
    }
  }, [details, medicalSpecialtiesData]);

  const { update, isUpdating } = useUpdateCenter();

  const handleSave = async () => {
    const payload = {
      ...values,
      customer_id: String(userId),
    };

    try {
      await update(payload);
      await refetch();
      toast.success("تم تحديث التخصصات بنجاح");
      setEditing(false);
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const toggleSpecialty = (specialtyId: string) => {
    setValues((v) => ({
      ...v,
      specialty_id: v.specialty_id.includes(specialtyId)
        ? v.specialty_id.filter((id) => id !== specialtyId)
        : [...v.specialty_id, specialtyId],
    }));
  };

  const selectedSpecialties = medicalSpecialties.filter((s) =>
    values.specialty_id.includes(s.id.toString())
  );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>التخصصات</CardTitle>
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
          <div>
            <p className="text-sm text-gray-500 mb-2">التخصصات:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSpecialties.length > 0 ? (
                selectedSpecialties.map((s) => (
                  <Badge key={s.id} variant="secondary">
                    {s.name}
                  </Badge>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
          </div>
          <p>سنة التأسيس: {values.year_establishment || "-"}</p>
        </div>
      ) : (
        <div className="p-4 grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">التخصصات</label>
            <div className="flex flex-wrap gap-2">
              {medicalSpecialties.map((specialty) => (
                <label
                  key={specialty.id}
                  className={`px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                    values.specialty_id.includes(specialty.id.toString())
                      ? "bg-[#32A88D] text-white border-[#32A88D]"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={values.specialty_id.includes(
                      specialty.id.toString()
                    )}
                    onChange={() => toggleSpecialty(specialty.id.toString())}
                  />
                  {specialty.name}
                </label>
              ))}
            </div>
            {serverErrors.specialty_id && (
              <p className="text-red-500 text-sm mt-1">
                {serverErrors.specialty_id}
              </p>
            )}
          </div>

          <FormInput
            label="سنة التأسيس"
            type="number"
            value={values.year_establishment}
            onChange={(e) =>
              setValues((v) => ({ ...v, year_establishment: e.target.value }))
            }
            rtl
            className="no-spinner"
            error={serverErrors.year_establishment}
          />
        </div>
      )}
    </Card>
  );
}
