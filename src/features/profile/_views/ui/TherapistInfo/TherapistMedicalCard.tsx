"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/shared/ui/forms";
import { useUpdateTherapist } from "@/features/profile/_views/hooks/useUpdateTherapist";
import { toast } from "sonner";
import type { TherapistFormValues } from "@/app/api/therapist";
import type { TherapistProfile } from "@/types/therpist";
import { medicalSpecialties } from "@/constants/medicalSpecialties";
import { medicalSchema } from "@/lib/validation";
import { Loader2, Edit, GraduationCap, Briefcase, University, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TherapistMedicalCardProps = {
  details: TherapistProfile["therapist_details"];
  userId: string;
  refetch: () => void;
  serverErrors?: Record<string, string>;
};

export function TherapistMedicalCard({
  details,
  userId,
  refetch,
}: TherapistMedicalCardProps) {
  const [editing, setEditing] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    medical_specialties_id: "",
    university_name: "",
    graduation_year: "",
    experience_years: "",
    countries_certified: "",
  });

  const [localDetails, setLocalDetails] =
    useState<TherapistProfile["therapist_details"] | null>(null);

  const { update, isUpdating } = useUpdateTherapist({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  useEffect(() => {
    if (details) {
      setLocalDetails(details);
    }
  }, [details]);

  const startEdit = () => {
    const source = localDetails ?? details;
    setValues({
      medical_specialties_id:
        source?.medical_specialties?.id?.toString() || "",
      university_name: source?.university_name || "",
      graduation_year: source?.graduation_year?.toString() || "",
      experience_years: source?.experience_years?.toString() || "",
      countries_certified: Array.isArray(source?.countries_certified)
        ? source.countries_certified.join(", ")
        : source?.countries_certified || "",
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setValues({
      medical_specialties_id:
        localDetails?.medical_specialties?.id?.toString() || "",
      university_name: localDetails?.university_name || "",
      graduation_year: localDetails?.graduation_year?.toString() || "",
      experience_years: localDetails?.experience_years?.toString() || "",
      countries_certified: Array.isArray(localDetails?.countries_certified)
        ? localDetails.countries_certified.join(", ")
        : localDetails?.countries_certified || "",
    });
    setServerErrors({});
  };

  const handleSave = async () => {
    const result = medicalSchema.safeParse(values);

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

    const payload: TherapistFormValues = {
      ...values,
      experience_years: Number(values.experience_years),
      customer_id: String(userId),
    };

    try {
      await update(payload);
      await refetch();
      toast.success("تم تحديث المؤهلات بنجاح");
      setEditing(false);
      setServerErrors({});
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const getFieldError = (field: keyof typeof values) => {
    const serverError = serverErrors[field];
    const clientError = medicalSchema.shape[field]?.safeParse(
      values[field] ?? ""
    ).error?.issues[0]?.message;
    return serverError ?? clientError;
  };

  const FieldDisplay: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: React.ReactNode;
    className?: string;
  }> = ({ icon, label, value, className }) => (
    <div className={`flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 ${className}`}>
      <div className="text-[#32A88D] mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-sm text-gray-500 block mb-1">{label}</span>
        <span className="text-gray-800 font-medium block">{value ?? "-"}</span>
      </div>
    </div>
  );

  const displayDetails = localDetails ?? details;

  return (
    <div className="bg-gradient-to-b from-[#32A88D]/10 to-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">المؤهلات الطبية</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل المؤهلات
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isUpdating}
              size="sm"
              className="bg-[#32A88D] hover:bg-[#32A88D]/90 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center gap-2"
            >
              {isUpdating && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
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

      {!editing ? (
        <div className="grid grid-cols-1 gap-4">
          <FieldDisplay
            icon={<GraduationCap className="w-5 h-5" />}
            label="التخصص الطبي"
            value={
              displayDetails?.medical_specialties?.name ? (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {displayDetails.medical_specialties.name}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<University className="w-5 h-5" />}
            label="الجامعة"
            value={displayDetails?.university_name}
          />
          
          <FieldDisplay
            icon={<GraduationCap className="w-5 h-5" />}
            label="سنة التخرج"
            value={
              displayDetails?.graduation_year ? (
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {displayDetails.graduation_year}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<Briefcase className="w-5 h-5" />}
            label="سنوات الخبرة"
            value={
              displayDetails?.experience_years ? (
                <div className="flex items-center gap-2">
                  <span>{displayDetails.experience_years} سنة</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#32A88D] h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((Number(displayDetails.experience_years) / 30) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<Globe className="w-5 h-5" />}
            label="الدول المعتمدة"
            value={
              displayDetails?.countries_certified ? (
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(displayDetails.countries_certified) 
                    ? displayDetails.countries_certified.map((country, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))
                    : <Badge variant="outline">{displayDetails.countries_certified}</Badge>
                  }
                </div>
              ) : "-"
            }
          />
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل المؤهلات الطبية
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="التخصص الطبي"
              placeholder="اختر التخصص"
              options={medicalSpecialties.map((s) => ({
                value: s.id.toString(),
                label: s.name,
              }))}
              value={values.medical_specialties_id}
              onValueChange={(val) =>
                setValues((v) => ({ ...v, medical_specialties_id: val }))
              }
              rtl
              error={getFieldError("medical_specialties_id")}
              className="bg-white"
            />

            <FormInput
              label="اسم الجامعة"
              value={values.university_name}
              onChange={(e) =>
                setValues((v) => ({ ...v, university_name: e.target.value }))
              }
              rtl
              error={getFieldError("university_name")}
              className="bg-white"
            />

            <FormInput
              label="سنة التخرج"
              type="number"
              value={values.graduation_year}
              onChange={(e) =>
                setValues((v) => ({ ...v, graduation_year: e.target.value }))
              }
              rtl
              className="no-spinner bg-white"
              error={getFieldError("graduation_year")}
            />

            <FormInput
              label="عدد سنوات الخبرة"
              type="number"
              value={values.experience_years}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  experience_years: e.target.value.replace(/^0+/, ""),
                }))
              }
              rtl
              className="no-spinner bg-white"
              error={getFieldError("experience_years")}
            />

            <div className="md:col-span-2">
              <FormInput
                label="الدولة المعتمدة"
                value={values.countries_certified}
                onChange={(e) =>
                  setValues((v) => ({ ...v, countries_certified: e.target.value }))
                }
                rtl
                error={getFieldError("countries_certified")}
                className="bg-white"
                placeholder="مثال: السعودية، الإمارات، عمان"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}