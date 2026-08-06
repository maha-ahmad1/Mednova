"use client";

import React, { useState, useEffect } from "react";
import * as z from "zod";
import {
  FormInput,
  FormPhoneInput,
  FormSelect,
  FormFileUpload,
} from "@/shared/ui/forms";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { TherapistProfile } from "@/types/therpist";
import { useUpdateTherapist } from "@/features/profile/_views/hooks/useUpdateTherapist";
import { TherapistFormValues } from "@/app/api/therapist";
import { personalSchema } from "@/lib/validation";
import type { QueryObserverResult } from "@tanstack/react-query";
import Image from "next/image";
import { buildFullPhoneNumber, parsePhoneNumber, DEFAULT_COUNTRY_CODES } from "@/utils/phone";
import { useTranslations, useLocale } from "next-intl";

interface TherapistPersonalCardProps {
  profile: TherapistProfile;
  userId: string;
  // refetch may return either the fresh profile or an object with a `data` field
  // refetch: () => Promise<TherapistProfile | { data?: TherapistProfile } | void>;
  serverErrors?: Record<string, string>;
  refetch: () => Promise<QueryObserverResult<TherapistProfile | null, Error>>;
}

export const TherapistPersonalCard: React.FC<TherapistPersonalCardProps> = ({
  profile,
  userId,
  refetch,
}) => {
  const t = useTranslations("profile.therapistInfo");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [editing, setEditing] = useState(false);
  type PersonalSchemaType = z.infer<typeof personalSchema>;
  type FormValues = Partial<
    Record<keyof PersonalSchemaType | "image", unknown>
  >;
  const [formValues, setFormValues] = useState<FormValues>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [localProfile, setLocalProfile] =
    useState<Partial<TherapistProfile> | null>(null);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODES[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { update, isUpdating } = useUpdateTherapist();

  useEffect(() => {
    if (!editing) {
      setFormValues({});
    }
  }, [profile, editing]);

  const startEdit = () => {
    const source = localProfile ?? profile;
    const { countryCode: parsedCountryCode, localNumber } = parsePhoneNumber(
      source?.phone,
    );
    setCountryCode(parsedCountryCode);
    setFormValues({
      full_name: source?.full_name ?? "",
      email: source?.email ?? "",
      phone: localNumber,
      birth_date: source?.birth_date ? String(source.birth_date) : "",
      gender:
        source?.gender === "Male"
          ? "male"
          : source?.gender === "Female"
            ? "female"
            : "",
      image: null,
    });
    setImagePreview(typeof source?.image === "string" ? source.image : null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormValues({});
    setServerErrors({});
    setImagePreview(null);
  };

  const handleSave = async () => {
    const result = personalSchema.safeParse(formValues);

    if (!result.success) {
      console.log("Validation errors:", result.error.issues);
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setServerErrors(fieldErrors);
      toast.error(t("personalCard.validationError"));
      return;
    }

    try {
      const phoneWithCode = buildFullPhoneNumber(
        countryCode,
        typeof formValues.phone === "string" ? formValues.phone : undefined,
      );
      const payload: TherapistFormValues = {
        full_name: (formValues.full_name as string) ?? undefined,
        email: (formValues.email as string) ?? undefined,
        birth_date: (formValues.birth_date as string) ?? undefined,
        gender:
          formValues.gender === "male"
            ? "Male"
            : formValues.gender === "female"
              ? "Female"
              : undefined,
        phone: phoneWithCode,
        image: formValues.image as File | undefined,
        customer_id: String(userId),
      } as unknown as TherapistFormValues;
      await update(payload);
      const refetchResult = await refetch();
      let fresh: TherapistProfile | undefined;
      const r = refetchResult as unknown;
      if (!r) {
        fresh = undefined;
      } else if (typeof r === "object" && r !== null && "data" in r) {
        // r is an object that contains `data`
        fresh = (r as { data?: TherapistProfile }).data;
      } else {
        fresh = r as TherapistProfile | undefined;
      }
      if (fresh) setLocalProfile(fresh);
      setEditing(false);
      setServerErrors({});

      toast.success(t("personalCard.saveSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("personalCard.saveError"));
    }
  };

  const Field: React.FC<{
    label: string;
    value?: React.ReactNode;
    className?: string;
  }> = ({ label, value, className = "" }) => (
    <div className={`flex flex-col ${className}`}>
      <span className="text-sm text-gray-500 mb-2">{label}</span>
      <span className={`text-gray-800 font-medium ${className}`}>
        {value ?? "-"}
      </span>
    </div>
  );

  const displayProfile = localProfile ?? profile;

  const getFieldError = (field: keyof typeof formValues) => {
    const serverError = serverErrors[String(field)];
    const shape = personalSchema.shape as Record<string, z.ZodTypeAny>;
    const parser = shape[String(field)];
    const rawValue = formValues[field];
    const valueForParse =
      field === "image" ? (rawValue ?? null) : (rawValue ?? "");
    const clientError =
      parser?.safeParse(valueForParse).error?.issues?.[0]?.message;
    return serverError ?? clientError;
  };

  return (
    <div className="bg-gradient-to-b from-[#32A88D]/10 to-white rounded-2xl shadow-sm border border-gray-100 p-6 pl-8 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {t("personalCard.title")}
              </p>
            </div>

            {editing ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isUpdating}
                  size="sm"
                  className="bg-[#32A88D] hover:bg-[#32A88D]/90 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center gap-2"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("saveButton")}
                </Button>
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-2"
                >
                  {t("cancelButton")}
                </Button>
              </div>
            ) : (
              <Button
                onClick={startEdit}
                variant="outline"
                size="sm"
                className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {t("personalCard.editButton")}
              </Button>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field
                label={t("personalCard.fullNameLabel")}
                value={displayProfile.full_name ?? "-"}
              />
              <Field
                label={t("personalCard.emailLabel")}
                value={displayProfile.email ?? "-"}
              />
              <Field
                label={t("personalCard.phoneLabel")}
                value={
                  displayProfile.phone ? (
                    <span dir="ltr" className="inline-block text-left">
                      {displayProfile.phone}
                    </span>
                  ) : (
                    "-"
                  )
                }
              />
              <Field
                label={t("personalCard.birthDateLabel")}
                value={displayProfile.birth_date ?? "-"}
              />
              <Field
                label={t("personalCard.genderLabel")}
                value={
                  <Badge
                    className={`px-3 py-1 rounded-full ${
                      displayProfile.gender === "Male"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {displayProfile.gender === "Male"
                      ? t("personalCard.genderMale")
                      : t("personalCard.genderFemale")}
                  </Badge>
                }
              />
              {/* <Field
                label="حالة الحساب"
                value={
                  <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    نشط
                  </Badge>
                }
              /> */}
              {/* <Field
                label="الصورة الشخصية"
                value={
                  typeof displayProfile.image === "string" ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                      <Image
                        src={displayProfile.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    "-"
                  )
                }
              /> */}
            </div>
          ) : (
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                {t("personalCard.editTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label={t("personalCard.fullNameLabel")}
                  value={formValues.full_name as string | undefined}
                  onChange={(e) =>
                    setFormValues((s) => ({ ...s, full_name: e.target.value }))
                  }
                  rtl={isRtl}
                  error={getFieldError("full_name")}
                  className="bg-white"
                />
                <FormInput
                  label={t("personalCard.emailLabel")}
                  value={formValues.email as string | undefined}
                  onChange={(e) =>
                    setFormValues((s) => ({ ...s, email: e.target.value }))
                  }
                  rtl={isRtl}
                  error={getFieldError("email")}
                  className="bg-white"
                  readOnly
                />
                <FormPhoneInput
                  label={t("personalCard.phoneLabel")}
                  countryCodeValue={countryCode}
                  onCountryCodeChange={setCountryCode}
                  value={formValues.phone as string | undefined}
                  onChange={(e) =>
                    setFormValues((s) => ({ ...s, phone: e.target.value }))
                  }
                  // rtl
                  error={getFieldError("phone")}
                  className="bg-white no-spinner "
                />
                <FormInput
                  label={t("personalCard.birthDateLabel")}
                  type="date"
                  value={formValues.birth_date as string | undefined}
                  onChange={(e) =>
                    setFormValues((s) => ({ ...s, birth_date: e.target.value }))
                  }
                  rtl={isRtl}
                  error={getFieldError("birth_date")}
                  className="bg-white"
                />
                <FormSelect
                  label={t("personalCard.genderLabel")}
                  options={[
                    { value: "male", label: t("personalCard.genderMale") },
                    { value: "female", label: t("personalCard.genderFemale") },
                  ]}
                  value={formValues.gender as string | undefined}
                  onValueChange={(val) =>
                    setFormValues((s) => ({ ...s, gender: val }))
                  }
                  rtl={isRtl}
                  error={getFieldError("gender")}
                  className="bg-white"
                />

                <div className="md:col-span-2 space-y-3">
                  {/* <FormFileUpload
                    label="الصورة الشخصية"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setFormValues((s) => ({ ...s, image: file }));
                      setImagePreview(file ? URL.createObjectURL(file) : null);
                    }}
                    error={getFieldError("image")}
                    className="bg-white"
                  /> */}
                  {/* {imagePreview && (
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
