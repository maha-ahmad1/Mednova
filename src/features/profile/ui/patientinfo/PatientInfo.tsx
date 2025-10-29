"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFetcher } from "@/hooks/useFetcher";
import { useUpdatePatient } from "@/features/profile/hooks/useUpdatePatient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import PatientPersonal1Card from "./PatientPersonal1Card";
import PatientPersonal2Card from "./PatientPersonal2Card";

export type PatientProfile = {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  gender: string;
  emergency_contact?: string;
  profile_image?: string | File;
  userId?: string;
  customer_id?: string;
};

export default function PatientInfo() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading, isError, error, refetch } =
    useFetcher<PatientProfile>(
      ["patientProfile", userId],
      `/api/customer/${userId}`
    );

  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [localProfile, setLocalProfile] =
    useState<Partial<PatientProfile> | null>(null);

  const { update, isUpdating } = useUpdatePatient({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  useEffect(() => {
    if (!editingCard) {
      setFormValues({});
      setEditingCard(null);
    }
  }, [data, editingCard]);

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
        <span className="ml-3 text-gray-600">جارٍ تحميل بيانات المريض...</span>
      </div>
    );
  }

  if (isError) {
    toast.error(
      `حدث خطأ أثناء جلب البيانات: ${String((error as Error)?.message)}`
    );
  }

  const d = (data ?? {}) as PatientProfile;

  const startEdit = (card: string) => {
    setEditingCard(card);
    const source = localProfile ?? d;

    const match = source.phone?.match(/^(\+\d{1,4})(.*)$/);
    const countryCode = match ? match[1] : "+968";
    const phoneNumber = match ? match[2]?.trim() : source.phone ?? "";

    setFormValues({
      full_name: source.full_name ?? "",
      email: source.email ?? "",
      phone: phoneNumber,
      countryCode,
      address: source.address ?? "",
      birth_date: source.birth_date ?? "",
      gender: source.gender ?? "",
      emergency_contact: source.emergency_contact ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setFormValues({});
    setServerErrors({});
  };

  const handleSave = async (card: string) => {
    try {
      let payload: Partial<PatientProfile> = {};

      if (card === "personal1") {
        payload = {
          full_name: formValues.full_name,
          email: formValues.email,
          phone: formValues.countryCode
            ? `${formValues.countryCode}${formValues.phone}`
            : formValues.phone,
          birth_date: formValues.birth_date,
        };
      } else if (card === "personal2") {
        payload = {
          address: formValues.address,
          emergency_contact: formValues.emergency_contact,
          gender:
            formValues.gender === "male"
              ? "Male"
              : formValues.gender === "female"
              ? "Female"
              : undefined,
        };
      }

      payload.customer_id = String(userId);

      await update(payload);
      await refetch();

      setEditingCard(null);
      setServerErrors({});
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (err) {
      console.error("handleSave error:", err);
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div className="container max-w-5xl mx-auto">
      <div dir="rtl" className="space-y-6">
        <PatientPersonal1Card
          patient={d}
          onSave={handleSave}
          isUpdating={isUpdating}
          errors={serverErrors}
          userId={userId!}
          editingCard={editingCard}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          formValues={formValues}
          setFormValues={setFormValues}
        />

        <PatientPersonal2Card
          patient={d}
          onSave={handleSave}
          isUpdating={isUpdating}
          errors={serverErrors}
          userId={userId!}
          editingCard={editingCard}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
    </div>
  );
}
