"use client";

import type React from "react";
import { useState, useEffect } from "react";
import * as z from "zod";
import { FormInput, FormSelect } from "@/shared/ui/forms";
import { FormPhoneInput } from "@/shared/ui/forms/components/FormPhoneInput";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Edit,
  Phone,
  Calendar,
  User,
  Mail,
  Building,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { CenterProfile } from "@/types/center";
import { useUpdateCenter } from "@/features/profile/_views/hooks/useUpdateCenter";
import { centerSchema } from "@/lib/validation";
import type { QueryObserverResult } from "@tanstack/react-query";

interface CenterPersonalCardProps {
  profile: CenterProfile;
  userId: string;
  refetch: () => Promise<QueryObserverResult<CenterProfile | null, Error>>;
}

export const CenterPersonalCard: React.FC<CenterPersonalCardProps> = ({
  profile,
  userId,
  refetch,
}) => {
  const [editing, setEditing] = useState(false);

  type FormValues = Partial<
    Record<
      | "full_name"
      | "email"
      | "phone"
      | "birth_date"
      | "gender"
      | "status"
      | "name_center"
      | "year_establishment"
      | "countryCode",
      unknown
    >
  >;

  const [formValues, setFormValues] = useState<FormValues>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [localProfile, setLocalProfile] =
    useState<Partial<CenterProfile> | null>(null);
  const [countryCode, setCountryCode] = useState("+968");

  const { update, isUpdating } = useUpdateCenter({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  const displayProfile = localProfile ?? profile;

  useEffect(() => {
    if (!editing) {
      setFormValues({});
    }
  }, [profile, editing]);

  const splitPhone = (p?: string | null) => {
    if (!p) return { country: "+968", local: "" };

    if (p.startsWith("+968")) return { country: "+968", local: p.slice(4) };

    const m = p.match(/^\+(\d{1,4})(.*)$/);
    return m
      ? { country: `+${m[1]}`, local: m[2].trim() }
      : { country: "+968", local: p };
  };

  const startEdit = () => {
    const source = localProfile ?? profile;
    const { country, local } = splitPhone(source?.phone);
    setCountryCode(country);

    setFormValues({
      full_name: source?.full_name ?? "",
      email: source?.email ?? "",
      phone: local ?? "",
      birth_date: source?.birth_date ?? "",
      gender: source?.gender ?? "",
      // status: source?.status ?? "",
      name_center: source?.center_details?.name_center ?? "",
      year_establishment:
        source?.center_details?.year_establishment?.toString() ?? "",
    });

    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormValues({});
    setServerErrors({});
  };

  const handleSave = async () => {
    const result = centerSchema.safeParse(formValues);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setServerErrors(fieldErrors);
      toast.error("يرجى تصحيح الأخطاء قبل الحفظ");
      return;
    }

    try {
      const phoneWithCode =
        countryCode && typeof formValues.phone === "string" && formValues.phone
          ? `${countryCode}${formValues.phone}`
          : typeof formValues.phone === "string"
            ? formValues.phone
            : undefined;

      const payload = {
        customer_id: String(userId),
        full_name: formValues.full_name as string | undefined,
        email: formValues.email as string | undefined,
        phone: phoneWithCode,
        birth_date: formValues.birth_date as string | undefined,
        gender: formValues.gender as string | undefined,
        name_center: formValues.name_center as string | undefined,
        year_establishment: formValues.year_establishment
          ? parseInt(formValues.year_establishment as string)
          : undefined,
      } as unknown as import("@/app/api/center").CenterFormValues;

      await update(payload);
      const refetchResult = await refetch();

      let fresh: CenterProfile | undefined;
      const r = refetchResult as unknown;
      if (!r) fresh = undefined;
      else if (typeof r === "object" && r !== null && "data" in r)
        fresh = (r as { data?: CenterProfile }).data;
      else fresh = r as CenterProfile | undefined;

      if (fresh) setLocalProfile(fresh);
      setEditing(false);
      setServerErrors({});
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const getFieldError = (field: string) => {
    const serverError = serverErrors[field];
    const shape = centerSchema.shape as Record<string, z.ZodTypeAny>;
    const rawValue = (formValues as Record<string, unknown>)[field];
    const valueForParse =
      field === "image" ? (rawValue ?? null) : (rawValue ?? "");
    const clientError =
      shape[field]?.safeParse(valueForParse).error?.issues?.[0]?.message;
    return serverError ?? clientError;
  };

  const Field: React.FC<{
    label: string;
    value?: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
  }> = ({ label, value, className = "", icon }) => (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-[#32A88D]">{icon}</span>}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className={`text-gray-800 font-medium ${className}`}>
        {value ?? "-"}
      </span>
    </div>
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

 
  return (
    <div className="bg-gradient-to-b from-[#32A88D]/10 to-white rounded-2xl shadow-sm border border-gray-100 p-6 pl-8 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                بيانات المركز وصاحبه
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
                  حفظ التغييرات
                </Button>
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-2"
                >
                  إلغاء
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
                تعديل جميع البيانات
              </Button>
            )}
          </div>

          {!editing ? (
            <>
              {/* بيانات صاحب المركز */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#32A88D]" />
                  بيانات صاحب المركز
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Field
                    label="الاسم الكامل"
                    value={displayProfile.full_name ?? "-"}
                    icon={<User className="w-4 h-4" />}
                  />

                  <Field
                    label="البريد الإلكتروني"
                    value={displayProfile.email ?? "-"}
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <Field
                    label="رقم الهاتف"
                    value={
                      displayProfile.phone ? (
                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {displayProfile.phone}
                        </Badge>
                      ) : (
                        "-"
                      )
                    }
                    icon={<Phone className="w-4 h-4" />}
                  />

                  <Field
                    label="تاريخ الميلاد"
                    value={
                      displayProfile.birth_date ? (
                        <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {formatDate(displayProfile.birth_date)}
                        </Badge>
                      ) : (
                        "-"
                      )
                    }
                    icon={<Calendar className="w-4 h-4" />}
                  />

                  <Field
                    label="الجنس"
                    value={
                      <Badge
                        className={`px-3 py-1 rounded-full ${
                          displayProfile.gender === "Male"
                            ? "bg-blue-100 text-blue-800"
                            : displayProfile.gender === "Female"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {displayProfile.gender === "Male"
                          ? "ذكر"
                          : displayProfile.gender === "Female"
                            ? "أنثى"
                            : "-"}
                      </Badge>
                    }
                    icon={<User className="w-4 h-4" />}
                  />

                  {/* <Field
                    label="حالة الحساب"
                    value={
                      <Badge
                        className={`px-3 py-1 rounded-full ${getStatusBadgeClass(displayProfile.status)}`}
                      >
                        {formatStatus(displayProfile.status)}
                      </Badge>
                    }
                  /> */}
                </div>
              </div>

              {/* خط فاصل */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    بيانات المركز
                  </span>
                </div>
              </div>

              {/* بيانات المركز */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#32A88D]" />
                  بيانات المركز
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Field
                    label="اسم المركز"
                    value={displayProfile.center_details?.name_center ?? "-"}
                    icon={<Building className="w-4 h-4" />}
                  />

                  <Field
                    label="سنة التأسيس"
                    value={
                      displayProfile.center_details?.year_establishment ? (
                        <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {displayProfile.center_details.year_establishment}
                        </Badge>
                      ) : (
                        "-"
                      )
                    }
                    icon={<Clock className="w-4 h-4" />}
                  />

                  {/* <Field
                    label="رقم الترخيص"
                    value={
                      displayProfile.center_details?.license_number ? (
                        <Badge className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                          {displayProfile.center_details.license_number}
                        </Badge>
                      ) : (
                        "-"
                      )
                    }
                  /> */}

                  {/* <Field
                    label="جهة الترخيص"
                    value={
                      displayProfile.center_details?.license_authority ?? "-"
                    }
                  /> */}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                تعديل جميع البيانات
              </h3>

              {/* بيانات صاحب المركز */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#32A88D]" />
                  بيانات صاحب المركز
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="الاسم الكامل"
                    value={formValues.full_name as string | undefined}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        full_name: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("full_name")}
                    className="bg-white"
                    placeholder="أدخل الاسم الكامل"
                  />

                  <FormInput
                    label="البريد الإلكتروني"
                    value={formValues.email as string | undefined}
                    onChange={(e) =>
                      setFormValues((s) => ({ ...s, email: e.target.value }))
                    }
                    rtl
                    error={getFieldError("email")}
                    className="bg-white"
                    placeholder="example@email.com"
                    readOnly
                  />

                  <FormPhoneInput
                    label="رقم الهاتف"
                    countryCodeValue={countryCode}
                    onCountryCodeChange={setCountryCode}
                    value={formValues.phone as string | undefined}
                    onChange={(e) =>
                      setFormValues((s) => ({ ...s, phone: e.target.value }))
                    }
                    rtl
                    error={getFieldError("phone")}
                    className="bg-white"
                    placeholder="0000 0000"
                  />

                  <FormInput
                    label="تاريخ الميلاد"
                    type="date"
                    value={formValues.birth_date as string | undefined}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        birth_date: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("birth_date")}
                    className="bg-white"
                  />

                  <FormSelect
                    label="الجنس"
                    options={[
                      { value: "Male", label: "ذكر" },
                      { value: "Female", label: "أنثى" },
                    ]}
                    value={formValues.gender as string | undefined}
                    onValueChange={(val) =>
                      setFormValues((s) => ({ ...s, gender: val }))
                    }
                    rtl
                    error={getFieldError("gender")}
                    className="bg-white"
                    placeholder="اختر الجنس"
                  />
{/* 
                  <FormSelect
                    label="حالة الحساب"
                    options={[
                      { value: "pending", label: "قيد المراجعة" },
                      { value: "approved", label: "مفعل" },
                      { value: "rejected", label: "مرفوض" },
                    ]}
                    value={formValues.status as string | undefined}
                    onValueChange={(val) =>
                      setFormValues((s) => ({ ...s, status: val }))
                    }
                    rtl
                    error={getFieldError("status")}
                    className="bg-white"
                    placeholder="اختر حالة الحساب"
                  /> */}
                </div>
              </div>

              {/* خط فاصل */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 text-gray-500">
                    بيانات المركز
                  </span>
                </div>
              </div>

              {/* بيانات المركز */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#32A88D]" />
                  بيانات المركز
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="اسم المركز"
                    value={formValues.name_center as string | undefined}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        name_center: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("name_center")}
                    className="bg-white"
                    placeholder="أدخل اسم المركز"
                  />

                  <FormInput
                    label="سنة التأسيس"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formValues.year_establishment as string | undefined}
                    onChange={(e) =>
                      setFormValues((s) => ({
                        ...s,
                        year_establishment: e.target.value,
                      }))
                    }
                    rtl
                    error={getFieldError("year_establishment")}
                    className="bg-white no-spinner"
                    placeholder="مثال: 2020"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
