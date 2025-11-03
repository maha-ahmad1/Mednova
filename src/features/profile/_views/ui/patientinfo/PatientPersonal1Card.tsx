"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormPhoneInput } from "@/shared/ui/forms/components/FormPhoneInput";
import { Loader2, Edit, User, Mail, Phone, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import type { PatientProfile } from "@/types/patient";
import { FormInput } from "@/shared/ui/forms";
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

export default function PatientPersonal1Card({
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
  const isEditing = editingCard === "personal1";

  const handleChange = (field: string, value: string | File) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const FieldDisplay: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    className?: string;
  }> = ({ icon, label, value, className }) => (
    <div
      className={`flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 ${className}`}
    >
      <div className="text-[#32A88D] mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-sm text-gray-500 block mb-2">{label}</span>
        <span className="text-gray-800 font-medium block">{value ?? "-"}</span>
      </div>
    </div>
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };
  const { data: session } = useSession();

  console.log("session:", session);
  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">البيانات الأساسية</h2>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => startEdit("personal1")}
            variant="outline"
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل البيانات
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => onSave("personal1")}
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

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldDisplay
            icon={<User className="w-5 h-5" />}
            label="الاسم الكامل"
            value={patient.full_name || "-"}
          />

          <FieldDisplay
            icon={<Mail className="w-5 h-5" />}
            label="البريد الإلكتروني"
            value={patient.email || "-"}
          />

          <FieldDisplay
            icon={<Phone className="w-5 h-5" />}
            label="رقم الهاتف"
            value={
              patient.phone ? (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {patient.phone}
                </Badge>
              ) : (
                "-"
              )
            }
          />

          <FieldDisplay
            icon={<Calendar className="w-5 h-5" />}
            label="تاريخ الميلاد"
            value={
              patient.birth_date ? (
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {formatDate(patient.birth_date)}
                </Badge>
              ) : (
                "-"
              )
            }
          />
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل البيانات الأساسية
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-[#32A88D]" />
                الاسم الكامل
              </label>
              <Input
                value={(formValues.full_name as string) || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className="bg-white border-gray-300 focus:border-[#32A88D]"
                placeholder="أدخل الاسم الكامل"
              />
              {getFieldError("full_name", "personal1") && (
                <p className="text-red-500 text-sm mt-1">
                  {getFieldError("full_name", "personal1")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {/* <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#32A88D]" />
                البريد الإلكتروني
              </label> */}
              <FormInput
                label=" البريد الإلكتروني"
                type="email"
                value={(formValues.email as string) || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-white border-gray-300 focus:border-[#32A88D]"
                placeholder="example@email.com"
                readOnly
                icon={Mail}
                iconPosition="right"
              />
              {getFieldError("email", "personal1") && (
                <p className="text-red-500 text-sm mt-1">
                  {getFieldError("email", "personal1")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#32A88D]" />
                رقم الهاتف
              </label>
              <FormPhoneInput
                label=""
                countryCodeValue={(formValues.countryCode as string) || "+968"}
                onCountryCodeChange={(code) =>
                  setFormValues((prev) => ({ ...prev, countryCode: code }))
                }
                value={(formValues.phone as string) || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                rtl
                iconPosition="right"
                placeholder="0000 0000"
                error={getFieldError("phone", "personal1")}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#32A88D]" />
                تاريخ الميلاد
              </label>
              <Input
                type="date"
                value={(formValues.birth_date as string) || ""}
                onChange={(e) => handleChange("birth_date", e.target.value)}
                className="bg-white border-gray-300 focus:border-[#32A88D]"
              />
              {getFieldError("birth_date", "personal1") && (
                <p className="text-red-500 text-sm mt-1">
                  {getFieldError("birth_date", "personal1")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
