"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/shared/ui/forms";
import { toast } from "sonner";
import type { TherapistProfile } from "@/types/therpist";
import { useUpdateSchedule } from "@/features/profile/hooks/useUpdateSchedule";
import type { TherapistFormValues } from "@/app/api/therapist";



type TherapistLocationCardProps = {
  // this component expects the full profile (it reads location_details and schedules)
  details: TherapistProfile;
  userId: string;
  refetch: () => void;
  serverErrors?: Record<string, string>;
};

const days = [
  { key: "Sunday", label: "الأحد" },
  { key: "Monday", label: "الإثنين" },
  { key: "Tuesday", label: "الثلاثاء" },
  { key: "Wednesday", label: "الأربعاء" },
  { key: "Thursday", label: "الخميس" },
  { key: "Friday", label: "الجمعة" },
  { key: "Saturday", label: "السبت" },
];

export function TherapistscheduleCard({
  details,
  userId,
  refetch,
  serverErrors,
}: TherapistLocationCardProps) {
  // const location = details?.location_details;
  const schedule = details?.schedules?.[0];

  const [editing, setEditing] = useState(false);

  const [values, setValues] = useState<{
    day_of_week: string[];
    start_time_morning: string;
    end_time_morning: string;
    is_have_evening_time: number;
    start_time_evening: string;
    end_time_evening: string;
  }>({
    day_of_week: Array.isArray(schedule?.day_of_week)
      ? (schedule.day_of_week as string[])
      : [],
    start_time_morning: schedule?.start_time_morning || "",
    end_time_morning: schedule?.end_time_morning || "",
    is_have_evening_time: schedule?.is_have_evening_time ? 1 : 0,
    start_time_evening: schedule?.start_time_evening || "",
    end_time_evening: schedule?.end_time_evening || "",
  });

  const { update, isUpdating } = useUpdateSchedule();

  const handleSave = async () => {
    const payload: TherapistFormValues = {
      ...values,
      // convert numeric toggle to boolean for the API type
      is_have_evening_time: values.is_have_evening_time === 1,
      customer_id: String(userId),
      schedule_id: schedule?.id,
    };

    try {
      await update(payload);
      toast.success("تم تحديث الموقع ودوام العمل بنجاح");
      setEditing(false);
      refetch();
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const toggleDay = (dayKey: string) => {
    if (values.day_of_week.includes(dayKey)) {
      setValues((v) => ({
        ...v,
        day_of_week: v.day_of_week.filter((d) => d !== dayKey),
      }));
    } else {
      setValues((v) => ({ ...v, day_of_week: [...v.day_of_week, dayKey] }));
    }
  };

  //const selectedCountry = countries.find((c) => c.name === values.country);

  return (
    <Card className="bg-white rounded-xl shadow-lg p-6">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>الموقع ودوام العمل</CardTitle>
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

      <div className="p-4 grid gap-4">
        {!editing ? (
          <>
            <p>أيام العمل: {values.day_of_week.join(", ") || "-"}</p>
            <p>
              أوقات الصباح:{" "}
              {values.start_time_morning && values.end_time_morning
                ? `${values.start_time_morning} - ${values.end_time_morning}`
                : "-"}
            </p>
            <p>
              أوقات المساء:{" "}
              {values.is_have_evening_time
                ? `${values.start_time_evening} - ${values.end_time_evening}`
                : "-"}
            </p>
          </>
        ) : (
          <>
            {/* Days */}
            <div className="flex flex-wrap gap-3 mb-2">
              {days.map((d) => (
                <label
                  key={d.key}
                  className={`px-4 py-2 border rounded-lg cursor-pointer ${
                    values.day_of_week.includes(d.key)
                      ? "bg-[#32A88D] text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={values.day_of_week.includes(d.key)}
                    onChange={() => toggleDay(d.key)}
                  />
                  {d.label}
                </label>
              ))}
            </div>

            {/* Morning Time */}
            <FormInput
              label="بداية الدوام الصباحي"
              type="time"
              value={values.start_time_morning}
              onChange={(e) =>
                setValues((v) => ({ ...v, start_time_morning: e.target.value }))
              }
              rtl
            />
            <FormInput
              label="نهاية الدوام الصباحي"
              type="time"
              value={values.end_time_morning}
              onChange={(e) =>
                setValues((v) => ({ ...v, end_time_morning: e.target.value }))
              }
              rtl
            />

            {/* Evening toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.is_have_evening_time === 1}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    is_have_evening_time: e.target.checked ? 1 : 0,
                  }))
                }
                className="accent-primary"
              />
              <span className="font-medium">يوجد دوام مسائي</span>
            </div>

            {/* Evening Time */}
            {values.is_have_evening_time === 1 && (
              <>
                <FormInput
                  label="بداية الدوام المسائي"
                  type="time"
                  value={values.start_time_evening}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      start_time_evening: e.target.value,
                    }))
                  }
                  rtl
                />
                <FormInput
                  label="نهاية الدوام المسائي"
                  type="time"
                  value={values.end_time_evening}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      end_time_evening: e.target.value,
                    }))
                  }
                  rtl
                />
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
