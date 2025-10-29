"use client";

import React, { useState, useEffect } from "react";
import { FormInput, FormPhoneInput, FormSelect, FormFileUpload } from "@/shared/ui/forms";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { TherapistProfile } from "@/types/therpist";
import { useUpdateTherapist } from "@/features/profile/hooks/useUpdateTherapist";

interface TherapistPersonalCardProps {
  profile: TherapistProfile;
  userId: string;
  refetch: () => void;
}

export const TherapistPersonalCard: React.FC<TherapistPersonalCardProps> = ({ profile, userId, refetch }) => {
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [localProfile, setLocalProfile] = useState<Partial<TherapistProfile> | null>(null);
  const [countryCode, setCountryCode] = useState("+968");

  const { update, isUpdating } = useUpdateTherapist({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  useEffect(() => {
    if (!editing) {
      setFormValues({});
    }
  }, [profile]);

  const splitPhone = (p?: string | null) => {
    if (!p) return { country: "+968", local: "" };

    if (p.startsWith("+968")) return { country: "+968", local: p.slice(4) };

    const m = p.match(/^\+(\d{1,4})(.*)$/);
    return m ? { country: `+${m[1]}`, local: m[2].trim() } : { country: "+968", local: p };
  };

  const startEdit = () => {
    const source = localProfile ?? profile;
    const { country, local } = splitPhone(source?.phone);
    setCountryCode(country);
    setFormValues({
      full_name: source?.full_name ?? "",
      email: source?.email ?? "",
      phone: local ?? "",
      birth_date: source?.birth_date ? String(source.birth_date) : "",
      gender: source?.gender === "Male" ? "male" : source?.gender === "Female" ? "female" : "",
      image: null,
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormValues({});
    setServerErrors({});
  };

  const handleSave = async () => {
    try {
      const phoneWithCode = countryCode && formValues.phone ? `${countryCode}${formValues.phone}` : formValues.phone;
      const payload: TherapistFormValues = { ...formValues, phone: phoneWithCode, customer_id: String(userId) };
      await update(payload);
      const refetchResult = await refetch();
      const fresh: TherapistProfile | undefined = refetchResult?.data || refetchResult;
      if (fresh) {
        setLocalProfile(fresh);
      }
      setEditing(false);
      setServerErrors({});
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="mt-1 text-gray-800">{value ?? "-"}</span>
    </div>
  );

  const displayProfile = localProfile ?? profile;
  const imageSrc = editing && formValues.image instanceof File ? URL.createObjectURL(formValues.image) : displayProfile.image;

  return (
    <div className=" bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* <div className="flex flex-col items-center">
          <div className={`w-32 h-32 rounded-full overflow-hidden border-2 ${editing ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"}`}>
            {imageSrc ? (
              <img src={imageSrc} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          {editing && (
            <FormFileUpload
              label="تغيير الصورة"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFormValues((s) => ({ ...s, image: file }));
              }}
            />
          )}
        </div> */}

        <div className="flex-1">
          <div className="flex justify-end mb-4">
            {editing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isUpdating} size="sm" className="bg-green-500 hover:bg-green-600">
                  {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  حفظ
                </Button>
                <Button onClick={cancelEdit} variant="outline" size="sm">
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button onClick={startEdit} variant="outline" size="sm">
                تعديل
              </Button>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="الاسم الكامل" value={displayProfile.full_name ?? "-"} />
              <Field label="البريد الإلكتروني" value={displayProfile.email ?? "-"} />
              <Field label="الهاتف" value={displayProfile.phone ?? "-"} />
              <Field label="تاريخ الميلاد" value={displayProfile.birth_date ?? "-"} />
              <Field
                label="الجنس"
                value={<Badge>{displayProfile.gender === "Male" ? "ذكر" : "أنثى"}</Badge>}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <FormInput label="الاسم الكامل" value={formValues.full_name} onChange={(e) => setFormValues((s) => ({ ...s, full_name: e.target.value }))} rtl />
              <FormInput label="البريد الإلكتروني" value={formValues.email} onChange={(e) => setFormValues((s) => ({ ...s, email: e.target.value }))} rtl />
              <FormPhoneInput label="الهاتف" countryCodeValue={countryCode} onCountryCodeChange={setCountryCode} value={formValues.phone} onChange={(e) => setFormValues((s) => ({ ...s, phone: e.target.value }))} rtl />
              <FormInput label="تاريخ الميلاد" type="date" value={formValues.birth_date} onChange={(e) => setFormValues((s) => ({ ...s, birth_date: e.target.value }))} rtl />
              <FormSelect
                label="الجنس"
                options={[{ value: "male", label: "ذكر" }, { value: "female", label: "أنثى" }]}
                value={formValues.gender}
                onValueChange={(val) => setFormValues((s) => ({ ...s, gender: val }))}
                rtl
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
