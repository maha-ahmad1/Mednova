"use client";

import React, { useEffect, useState } from "react";
import { useFetcher } from "@/hooks/useFetcher";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FormInput, FormFileUpload } from "@/shared/ui/forms";
import { FormPhoneInput } from "@/shared/ui/forms";
import { useUpdateTherapist } from "@/features/profile/hooks/useUpdateTherapist";
import type { TherapistFormValues } from "@/app/api/therapist";
import {
  Mail,
  User,
  Phone,
  Loader2,
} from "lucide-react";
import { FormSelect } from "@/shared/ui/forms";
import { personalSchema } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { medicalSpecialties } from "@/constants/medicalSpecialties";
import { TherapistMedicalCard } from "./TherapistMedicalCard";
import type { TherapistProfile, Schedule } from "@/types/therpist";
import { TherapistLicensesCard } from "./TherpistLicensesCard";
import { TherapistLocationCard } from "./TherapistLocationCard";
import { TherapistBioCard } from "./TherapistBioCard";
//import { TherapistPersonalCard } from "./TherapistPersonalCard";

export default function TherapistProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data, isLoading, isError, error, refetch } =
    useFetcher<TherapistProfile>(
      ["therapistProfile", userId],
      `/api/customer/${userId}`
    );
  console.log(userId + "userId");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  // localProfile stores optimistic/most-recent values so the UI reflects updates immediately
  const [localProfile, setLocalProfile] =
    useState<Partial<TherapistProfile> | null>(null);

  const formatDateForDisplay = (val?: string | null) => {
    if (!val) return "-";
    try {
      const dt = new Date(String(val));
      if (!isNaN(dt.getTime())) return dt.toLocaleDateString("EG");
    } catch {}
    return String(val).slice(0, 10) || String(val);
  };

  const [countryCode, setCountryCode] = useState<string>("+968");

  const { update, isUpdating } = useUpdateTherapist({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  useEffect(() => {
    setFormValues({});
    setEditingCard(null);
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <div
          dir="rtl"
          className="min-h-[60vh] flex items-center justify-center"
        >
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
            <span>جارٍ التحميل...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error(
      `حدث خطأ أثناء جلب بيانات المعالج: ${String((error as Error)?.message)}`
    );
  }

  // d: guaranteed object, either the fetched data or an empty object, typed as TherapistProfile
  const d = (data ?? {}) as TherapistProfile;
  const details = (d.therapist_details ?? {}) as NonNullable<
    TherapistProfile["therapist_details"]
  >;
  const location = (d.location_details ?? {}) as NonNullable<
    TherapistProfile["location_details"]
  >;

  const countriesCertifiedDisplay = Array.isArray(details?.countries_certified)
    ? details.countries_certified.join(", ")
    : details?.countries_certified
    ? String(details.countries_certified)
    : "-";

  const schedulesArray: Schedule[] = Array.isArray(d.schedules)
    ? d.schedules
    : d.schedules
    ? // if it's a single object, wrap it
      [d.schedules as Schedule]
    : [];

  const scheduleDays =
    schedulesArray
      .flatMap((s) => s.day_of_week || [])
      .filter(Boolean)
      .join(", ") || "-";

  const scheduleMornings =
    schedulesArray
      .map((s) =>
        s.start_time_morning && s.end_time_morning
          ? `${s.start_time_morning} - ${s.end_time_morning}`
          : ""
      )
      .filter(Boolean)
      .join(", ") || "-";

  const scheduleEvenings =
    schedulesArray
      .map((s) =>
        s.is_have_evening_time && s.start_time_evening && s.end_time_evening
          ? `${s.start_time_evening} - ${s.end_time_evening}`
          : ""
      )
      .filter(Boolean)
      .join(", ") || "-";

  const days = [
    { key: "Sunday", label: "الأحد" },
    { key: "Monday", label: "الإثنين" },
    { key: "Tuesday", label: "الثلاثاء" },
    { key: "Wednesday", label: "الأربعاء" },
    { key: "Thursday", label: "الخميس" },
    { key: "Friday", label: "الجمعة" },
    { key: "Saturday", label: "السبت" },
  ];

  // const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  //   title,
  //   children,
  // }) => (
  //   <section className="bg-white rounded-lg shadow p-6">
  //     <div className="flex items-start justify-between mb-4">
  //       <h3 className="text-lg font-semibold">{title}</h3>
  //     </div>
  //     <div className="space-y-4">{children}</div>
  //   </section>
  // );

  const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="mt-1 text-gray-800">{value ?? "-"}</span>
    </div>
  );

  const startEdit = (card: string) => {
    setEditingCard(card);
    // populate relevant fields depending on card
    if (card === "personal") {
      // parse phone into country code + local part to match registration UI
      const splitPhone = (p?: string | null) => {
        if (!p) return { country: "+968", local: "" };
        const s = String(p).trim();
        // +XXXX... pattern
        let m = s.match(/^(\+\d{1,4})(.*)$/);
        if (m) return { country: m[1], local: m[2] };
        // 00XXXX... -> convert to +XXXX
        m = s.match(/^(00\d{1,4})(.*)$/);
        if (m) return { country: `+${m[1].slice(2)}`, local: m[2] };
        // if starts with country like 968XXXXXXXX, try to guess 3-digit country
        if (s.length > 8) {
          const possibleCountry = s.slice(0, 3);
          const rest = s.slice(3);
          return { country: `+${possibleCountry}`, local: rest };
        }
        return { country: "+968", local: s };
      };
      const { country, local } = splitPhone(d.phone as string | undefined);
      setCountryCode(country);
      // normalize birth_date to YYYY-MM-DD for date input
      const normBirth = d.birth_date
        ? (() => {
            try {
              const dt = new Date(String(d.birth_date));
              if (!isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
            } catch {}
            return String(d.birth_date);
          })()
        : undefined;

      setFormValues({
        full_name: d.full_name as string | undefined,
        email: d.email as string | undefined,
        phone: local ?? (d.phone as string | undefined),
        birth_date: normBirth,
        gender:
          d.gender === "Male"
            ? "male"
            : d.gender === "Female"
            ? "female"
            : undefined,
      });
    }

    if (card === "medical") {
      // try to infer specialty id from name if available
      const specialtyName = details?.medical_specialties?.name ?? "";
      const matched = medicalSpecialties.find((s) => s.name === specialtyName);
      setFormValues({
        medical_specialties_id: matched ? matched.id : specialtyName || "",
        university_name: details?.university_name ?? undefined,
        graduation_year: details?.graduation_year
          ? String(details.graduation_year)
          : undefined,
        experience_years: details?.experience_years
          ? String(details.experience_years)
          : undefined,
        countries_certified: Array.isArray(details?.countries_certified)
          ? details?.countries_certified.join(", ")
          : details?.countries_certified
          ? String(details.countries_certified)
          : undefined,
      });
    }

    if (card === "licenses") {
      setFormValues({
        license_number: details?.license_number ?? undefined,
        license_authority: details?.license_authority ?? undefined,
      });
    }

    if (card === "location") {
      setFormValues({
        country: location?.country ?? undefined,
        city: location?.city ?? undefined,
        formatted_address: location?.formatted_address ?? undefined,
        // schedule take first schedule as editable shortcut
        day_of_week: schedulesArray[0]?.day_of_week ?? undefined,
        start_time_morning: schedulesArray[0]?.start_time_morning ?? undefined,
        end_time_morning: schedulesArray[0]?.end_time_morning ?? undefined,
        is_have_evening_time: schedulesArray[0]?.is_have_evening_time ? 1 : 0,
        start_time_evening: schedulesArray[0]?.start_time_evening ?? undefined,
        end_time_evening: schedulesArray[0]?.end_time_evening ?? undefined,
      });
    }

    if (card === "bio") {
      setFormValues({ bio: details?.bio ?? undefined });
    }
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setFormValues({});
    setServerErrors({});
  };

 const handleSave = async () => {
  try {
    const payload: TherapistFormValues = {
      ...formValues,
      customer_id: String(userId),
    };

    await update(payload);

    const newData = await refetch();

    if (newData?.data) {
      const updated = newData.data as TherapistProfile;
      setLocalProfile({
        full_name: updated.full_name,
        email: updated.email,
        phone: updated.phone,
        birth_date: updated.birth_date,
        gender: updated.gender,
      });
    } else {
      setLocalProfile((prev) => ({
        ...(prev || {}),
        ...payload,
      }));
    }

    setEditingCard(null);
    setServerErrors({});
    toast.success("تم حفظ التغييرات بنجاح");
  } catch (error) {
    toast.error("حدث خطأ أثناء التحديث");
  }
};


  return (
    <div className="container max-w-5xl mx-auto ">
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex flex-col items-center lg:items-start gap-2">
              <div
                className={`w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 ${
                  editingCard === "personal"
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-gray-200"
                }`}
              >
                {editingCard === "personal" &&
                formValues.image instanceof File ? (
                  <img
                    src={URL.createObjectURL(formValues.image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : d.image ? (
                  <img
                    src={d.image}
                    alt={d.full_name ?? "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              {editingCard === "personal" ? (
                <FormFileUpload
                  label="تغيير الصورة"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormValues((s) => ({ ...s, image: file }));
                    }
                  }}
                  className="text-xs text-center"
                />
              ) : null}
              {d.image && !editingCard && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    typeof d.image === "string" ? window.open(d.image, "_blank") : undefined
                  }
                >
                  عرض الصورة
                </Button>
              )}
            </div>

            {/* الحقول - محسنة */}
            <div className="flex-1">
              {/* Header مع أزرار */}
              <div
                className={`flex justify-end mb-4 p-2 rounded-md ${
                  editingCard === "personal"
                    ? "bg-green-50 border border-green-200"
                    : ""
                }`}
              >
                {editingCard === "personal" ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={
                        isUpdating ||
                        !personalSchema.safeParse(formValues).success
                      }
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      حفظ
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" size="sm">
                      إلغاء
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => startEdit("personal")}
                    variant="outline"
                    size="sm"
                  >
                    تعديل
                  </Button>
                )}
              </div>

              {/* View Mode */}
              {!editingCard ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                  <Field
                    label="الاسم الكامل"
                    value={
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        {localProfile?.full_name ?? d.full_name ?? "-"}
                      </span>
                    }
                  />
                  <Field
                    label="البريد الإلكتروني"
                    value={
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        {localProfile?.email ?? d.email ?? "-"}
                      </span>
                    }
                  />
                  <Field
                    label="الهاتف"
                    value={
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {localProfile?.phone ?? d.phone ?? "-"}
                      </span>
                    }
                  />
                  <Field
                    label="تاريخ الميلاد"
                    value={
                      <span className="flex items-center">
                        {formatDateForDisplay(
                          localProfile?.birth_date ?? d.birth_date
                        )}
                      </span>
                    }
                  />
                  <Field
                    label="الجنس"
                    value={
                      localProfile?.gender ?? d.gender ? (
                        <Badge
                          variant={
                            (localProfile?.gender ?? d.gender) === "Male"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {(localProfile?.gender ?? d.gender) === "Male"
                            ? "ذكر"
                            : "أنثى"}
                        </Badge>
                      ) : (
                        "-"
                      )
                    }
                  />
                  <Field label="نوع الحساب" value={d.type_account ?? "-"} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2 bg-gray-50 p-4 rounded-md">
                  <FormInput
                    label="الاسم الكامل"
                    icon={User}
                    value={String(formValues.full_name ?? "")}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        full_name: e.target.value,
                      }))
                    }
                    rtl
                    error={
                      serverErrors.full_name ??
                      personalSchema.shape.full_name.safeParse(
                        formValues.full_name ?? ""
                      ).error?.issues[0]?.message
                    }
                  />
                  <FormInput
                    label="البريد الإلكتروني"
                    type="email"
                    icon={Mail}
                    value={String(formValues.email ?? "")}
                    onChange={(e) =>
                      setFormValues((s) => ({ ...s, email: e.target.value }))
                    }
                    rtl
                    error={
                      serverErrors.email ??
                      personalSchema.shape.email.safeParse(
                        formValues.email ?? ""
                      ).error?.issues[0]?.message
                    }
                  />
                  <FormPhoneInput
                    label="الهاتف"
                    placeholder="0000 0000"
                    icon={Phone}
                    iconPosition="right"
                    rtl
                    countryCodeValue={countryCode}
                    onCountryCodeChange={(c) => setCountryCode(c)}
                    value={String(formValues.phone ?? "")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormValues((s) => ({ ...s, phone: e.target.value }))
                    }
                    error={
                      serverErrors.phone ??
                      personalSchema.shape.phone.safeParse(
                        formValues.phone ?? ""
                      ).error?.issues[0]?.message
                    }
                  />
                  <FormInput
                    label="تاريخ الميلاد"
                    type="date"
                    value={String(formValues.birth_date ?? "")}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        birth_date: e.target.value,
                      }))
                    }
                    rtl
                    error={
                      serverErrors.birth_date ??
                      personalSchema.shape.birth_date.safeParse(
                        formValues.birth_date ?? ""
                      ).error?.issues[0]?.message
                    }
                  />
                  <FormSelect
                    label="الجنس"
                    options={[
                      { value: "male", label: "ذكر" },
                      { value: "female", label: "أنثى" },
                    ]}
                    value={String(formValues.gender ?? "")}
                    onValueChange={(val) =>
                      setFormValues((s) => ({ ...s, gender: val }))
                    }
                    rtl
                    error={
                      serverErrors.gender ??
                      personalSchema.shape.gender.safeParse(
                        formValues.gender ?? ""
                      ).error?.issues[0]?.message
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TherapistMedicalCard
            details={d.therapist_details}
            userId={userId!}
            refetch={refetch}
            serverErrors={serverErrors}
          />

          {/* Licenses and Documents */}

          <TherapistLicensesCard
            details={d.therapist_details}
            userId={userId!}
            refetch={refetch}
            serverErrors={serverErrors}
          />
        </div>
        {/* Location & Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TherapistLocationCard
            details={d}
            userId={userId!}
            refetch={refetch}
            serverErrors={serverErrors}
          />

          <TherapistBioCard
            details={d.therapist_details}
            userId={userId!}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
}
