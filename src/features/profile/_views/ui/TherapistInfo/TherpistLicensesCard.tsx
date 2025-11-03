"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput, FormFileUpload } from "@/shared/ui/forms";
import { toast } from "sonner";
import type { TherapistProfile } from "@/types/therpist";
import { useUpdateTherapist } from "@/features/profile/_views/hooks/useUpdateTherapist";
import { therapistLicensesSchema } from "@/lib/validation";
import { Loader2, Edit, FileText, Shield, Award, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TherapistLicensesCardProps = {
  details: TherapistProfile["therapist_details"];
  userId: string;
  refetch: () => void;
  serverErrors?: Record<string, string>;
};

export function TherapistLicensesCard({
  details,
  userId,
  refetch,
  serverErrors = {},
}: TherapistLicensesCardProps) {
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    license_number: details?.license_number || "",
    license_authority: details?.license_authority || "",
    certificate_file: null as File | null,
    license_file: null as File | null,
  });

  const { update, isUpdating } = useUpdateTherapist();

  const getFieldError = (field: keyof typeof formValues) => {
    const serverError = serverErrors[field];
    const schema = therapistLicensesSchema.pick({ [field]: true });
    const clientError = schema.safeParse({ [field]: formValues[field] }).error?.issues[0]?.message;
    return serverError ?? clientError;
  };

  const startEdit = () => {
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormValues({
      license_number: details?.license_number || "",
      license_authority: details?.license_authority || "",
      certificate_file: null,
      license_file: null,
    });
  };

  const handleSave = async () => {
    const payload = {
      ...formValues,
      customer_id: String(userId),
    };

    try {
      await update(payload);
      toast.success("تم تحديث التراخيص والمستندات بنجاح");
      setEditing(false);
      refetch();
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

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

  const FileLink: React.FC<{ 
    url?: string; 
    label: string;
    icon: React.ReactNode;
  }> = ({ url, label, icon }) => (
    url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[#32A88D] hover:text-[#2a8a7a] transition-colors duration-200 font-medium"
      >
        {icon}
        {label}
        <Download className="w-4 h-4" />
      </a>
    ) : (
      <span className="text-gray-500">-</span>
    )
  );

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">التراخيص والمستندات</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل المستندات
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
            icon={<Shield className="w-5 h-5" />}
            label="رقم الترخيص"
            value={
              details?.license_number ? (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {details.license_number}
                </Badge>
              ) : "-"
            }
          />
          
          <FieldDisplay
            icon={<FileText className="w-5 h-5" />}
            label="جهة الترخيص"
            value={details?.license_authority || "-"}
          />
          
          <FieldDisplay
            icon={<Award className="w-5 h-5" />}
            label="ملف الشهادة"
            value={
              <FileLink 
                url={details?.certificate_file ?? undefined}
                label="عرض الشهادة"
                icon={<Award className="w-4 h-4" />}
              />
            }
          />
          
          <FieldDisplay
            icon={<Shield className="w-5 h-5" />}
            label="ملف الترخيص"
            value={
              <FileLink 
                url={details?.license_file ?? undefined}
                label="عرض الترخيص"
                icon={<Shield className="w-4 h-4" />}
              />
            }
          />
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل التراخيص والمستندات
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="رقم الترخيص"
              value={formValues.license_number}
              onChange={(e) =>
                setFormValues((s) => ({ ...s, license_number: e.target.value }))
              }
              error={getFieldError("license_number")}
              rtl
              type="number"
              className="no-spinner bg-white"
              placeholder="أدخل رقم الترخيص"
            />
            
            <FormInput
              label="جهة الترخيص"
              value={formValues.license_authority}
              onChange={(e) =>
                setFormValues((s) => ({
                  ...s,
                  license_authority: e.target.value,
                }))
              }
              error={getFieldError("license_authority")}
              rtl
              className="bg-white"
              placeholder="أدخل جهة الترخيص"
            />
            
            <div className="md:col-span-2">
              <FormFileUpload
                label="ملف الشهادة"
                onChange={(e) =>
                  setFormValues((s) => ({
                    ...s,
                    certificate_file: e.target.files?.[0] ?? null,
                  }))
                }
                error={getFieldError("certificate_file")}
                className="bg-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <FormFileUpload
                label="ملف الترخيص"
                onChange={(e) =>
                  setFormValues((s) => ({
                    ...s,
                    license_file: e.target.files?.[0] ?? null,
                  }))
                }
                error={getFieldError("license_file")}
                className="bg-white"
              />
            </div>
            
            {/* عرض الملفات الحالية إن وجدت */}
            {(details?.certificate_file || details?.license_file) && (
              <div className="md:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-3">الملفات الحالية:</h5>
                <div className="flex flex-wrap gap-4">
                  {details.certificate_file && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#32A88D]" />
                      <a
                        href={details.certificate_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#32A88D] hover:underline flex items-center gap-1"
                      >
                        الشهادة الحالية
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {details.license_file && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#32A88D]" />
                      <a
                        href={details.license_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#32A88D] hover:underline flex items-center gap-1"
                      >
                        الترخيص الحالي
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  رفع ملف جديد سيستبدل الملف الحالي
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}