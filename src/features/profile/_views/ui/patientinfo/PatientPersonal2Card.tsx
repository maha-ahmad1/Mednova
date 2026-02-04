"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormPhoneInput, FormFileUpload, FormSelect, FormInput } from "@/shared/ui/forms";
import { countries } from "@/constants/countries";
import type { PatientProfile } from "@/types/patient";
import { Loader2, Edit, User, MapPin, Navigation, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { usePhoneNumber } from "@/hooks/usePhoneNumber";

interface Props {
  patient: PatientProfile;
  onSave: (card: string) => void;
  isUpdating: boolean;
  errors: Record<string, string>;
  userId: string;
  editingCard: string | null;
  startEdit: (card: string) => void;
  cancelEdit: () => void;
  formValues: Record<string, unknown>;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  getFieldError: (field: string, card: string) => string | undefined;
}

export default function PatientPersonal2Card({
  patient,
  onSave,
  isUpdating,
  editingCard,
  startEdit,
  cancelEdit,
  formValues,
  setFormValues,
  getFieldError,
}: Props) {
  const isEditing = editingCard === "personal2";
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { splitPhoneNumber, normalizePhoneInput } = usePhoneNumber();

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditing) {
      const { countryCode: emergencyCountryCode, localNumber: emergencyNumber } = splitPhoneNumber(
        patient.patient_details?.emergency_phone,
      );

      setFormValues((prev) => ({
        ...prev,
        country: (prev as Record<string, unknown>).country ?? patient.location_details?.country ?? "",
        city: (prev as Record<string, unknown>).city ?? patient.location_details?.city ?? "",
        formatted_address:
          (prev as Record<string, unknown>).formatted_address ??
          patient.location_details?.formatted_address ??
          "",
        gender: (prev as Record<string, unknown>).gender ?? (patient.gender?.toLowerCase() as string) ?? "",
        emergency_contact: (prev as Record<string, unknown>).emergency_contact ?? emergencyNumber,
        emergencyCountryCode: (prev as Record<string, unknown>).emergencyCountryCode ?? emergencyCountryCode,
        relationship: (prev as Record<string, unknown>).relationship ?? patient.patient_details?.relationship ?? "",
        image: (prev as Record<string, unknown>).image ?? null,
      }));

      setImagePreview(typeof patient.image === "string" ? patient.image : null);
    }
    if (!isEditing) {
      setImagePreview(null);
    }
  }, [isEditing, patient, setFormValues]);

  const selectedCountry = countries.find((c) => c.name === formValues.country);

  const FieldDisplay: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    className?: string;
  }> = ({ icon, label, value, className }) => (
    <div className={`flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 ${className}`}>
      <div className="text-[#32A88D] mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-sm text-gray-500 block mb-2">{label}</span>
        <span className="text-gray-800 font-medium block">{value ?? "-"}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">معلومات إضافية</h2>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => startEdit("personal2")}
            variant="outline"
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل المعلومات
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => onSave("personal2")}
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
        )}
      </div>

      {/* Display Mode */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldDisplay
            icon={<AlertCircle className="w-5 h-5" />}
            label="جهة الاتصال للطوارئ"
            value={
              patient.patient_details?.emergency_phone ? (
                <Badge className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  {patient.patient_details.emergency_phone}
                </Badge>
              ) : "-"
            }
          />

          <FieldDisplay
            icon={<User className="w-5 h-5" />}
            label="صلة القرابة"
            value={
              patient.patient_details?.relationship ? (
                <Badge className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                  {patient.patient_details.relationship}
                </Badge>
              ) : "-"
            }
          />

          <FieldDisplay
            icon={<User className="w-5 h-5" />}
            label="الجنس"
            value={
              patient.gender ? (
                <Badge
                  className={`px-3 py-1 rounded-full text-sm ${
                    patient.gender === "Male"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-pink-100 text-pink-800"
                  }`}
                >
                  {patient.gender === "Male" ? "ذكر" : "أنثى"}
                </Badge>
              ) : "-"
            }
          />

          <FieldDisplay
            icon={<MapPin className="w-5 h-5" />}
            label="الدولة"
            value={
              patient.location_details?.country ? (
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {patient.location_details.country}
                </Badge>
              ) : "-"
            }
          />

          <FieldDisplay
            icon={<Navigation className="w-5 h-5" />}
            label="المدينة"
            value={
              patient.location_details?.city ? (
                <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {patient.location_details.city}
                </Badge>
              ) : "-"
            }
          />

          <div className="">
            <FieldDisplay
              icon={<MapPin className="w-5 h-5" />}
              label="العنوان التفصيلي"
              value={patient.location_details?.formatted_address || "-"}
            />
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل المعلومات الإضافية
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Contact */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                جهة الاتصال للطوارئ
              </label>
              <FormPhoneInput
                label=""
                countryCodeValue={(formValues.emergencyCountryCode as string) || "+968"}
                onCountryCodeChange={(code) => handleChange("emergencyCountryCode", code)}
                value={(formValues.emergency_contact as string) || ""}
                onChange={(e) => handleChange("emergency_contact", normalizePhoneInput(e.target.value))}
                rtl
                placeholder="0000 0000"
                error={getFieldError("emergency_contact", "personal2")}
                className="bg-white"
              />
            </div>

            {/* Relationship */}
            <FormInput
              label="صلة القرابة"
              type="text"
              value={(formValues.relationship as string) || ""}
              onChange={(e) => handleChange("relationship", e.target.value)}
              className="bg-white border-gray-300 focus:border-[#32A88D]"
              placeholder="مثال: أب/أم/أخ"
              error={getFieldError("relationship", "personal2")}
            />

            {/* Gender */}
            <FormSelect
              label="الجنس"
              options={[
                { value: "male", label: "ذكر" },
                { value: "female", label: "أنثى" },
              ]}
              value={(formValues.gender as string) ?? ""}
              onValueChange={(val) => setFormValues((s) => ({ ...s, gender: val }))}
              rtl
              error={getFieldError("gender", "personal2")}
              className="bg-white"
              placeholder="اختر الجنس"
             
            />

            {/* Country */}
            <FormSelect
              label="الدولة"
              placeholder="اختر الدولة"
              value={(formValues.country as string) || ""}
              onValueChange={(val) => setFormValues((v) => ({ ...v, country: val, city: "" }))}
              options={countries.map((c) => ({
                value: c.name,
                label: c.name,
              }))}
              rtl
              error={getFieldError("country", "personal2")}
              className="bg-white"
            
            />

            {/* City */}
            <FormSelect
              label="المدينة"
              placeholder={(formValues.country as string) ? "اختر المدينة" : "اختر الدولة أولاً"}
              value={(formValues.city as string) || ""}
              onValueChange={(val) => handleChange("city", val)}
              options={(selectedCountry?.cities || []).map((c) => ({
                value: c,
                label: c,
              }))}
              rtl
              error={getFieldError("city", "personal2")}
              className="bg-white"
              disabled={!formValues.country}
            />

            {/* Detailed Address */}
            <FormInput
              label="العنوان التفصيلي"
              type="text"
              value={(formValues.formatted_address as string) || ""}
              onChange={(e) => handleChange("formatted_address", e.target.value)}
              className="bg-white border-gray-300 focus:border-[#32A88D]"
              placeholder="أدخل العنوان الكامل"
              error={getFieldError("formatted_address", "personal2")}
            />
          </div>

          {/* Location Preview */}
          {(typeof formValues.country === "string" || typeof formValues.city === "string") && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mt-6">
              <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#32A88D]" />
                معاينة الموقع:
              </h5>
              <div className="flex flex-wrap gap-2">
                {typeof formValues.country === "string" && (
                  <Badge className="bg-green-100 text-green-800">
                    {formValues.country as string}
                  </Badge>
                )}
                {typeof formValues.city === "string" && (
                  <Badge className="bg-purple-100 text-purple-800">
                    {formValues.city as string}
                  </Badge>
                )}
              </div>
              {typeof formValues.formatted_address === "string" && (
                <p className="text-gray-600 text-sm mt-2">
                  {formValues.formatted_address as string}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
