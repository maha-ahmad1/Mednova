"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/shared/ui/TextArea";
import { useUpdateTherapist } from "@/features/profile/_views/hooks/useUpdateTherapist";
import { toast } from "sonner";
import type { TherapistFormValues } from "@/app/api/therapist";
import type { TherapistProfile } from "@/types/therpist";
import { bioSchema } from "@/lib/validation";
import { Loader2, Edit, User, FileText } from "lucide-react";

type TherapistBioCardProps = {
  details: TherapistProfile["therapist_details"];
  userId: string;
  refetch: () => void;
};

export function TherapistBioCard({
  details,
  userId,
  refetch,
}: TherapistBioCardProps) {
  const [editing, setEditing] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [bio, setBio] = useState(details?.bio ?? "");
  const [localDetails, setLocalDetails] = useState<
    TherapistProfile["therapist_details"] | null
  >(null);

  const { update, isUpdating } = useUpdateTherapist({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  useEffect(() => {
    if (details) {
      setLocalDetails(details);
      setBio(details.bio ?? "");
    }
  }, [details]);

  const startEdit = () => {
    setBio(localDetails?.bio ?? "");
    setEditing(true);
  };

  const cancelEdit = () => {
    setBio(localDetails?.bio ?? "");
    setEditing(false);
    setServerErrors({});
  };

  const handleChange = (value: string) => {
    setBio(value);

    const result = bioSchema.safeParse({ bio: value });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setServerErrors(fieldErrors);
    } else {
      setServerErrors({});
    }
  };

  const handleSave = async () => {
    const result = bioSchema.safeParse({ bio });
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
      bio,
      customer_id: String(userId),
    };

    try {
      await update(payload);
      await refetch();
      toast.success("تم حفظ النبذة بنجاح");
      setLocalDetails((prev) => ({ ...prev, bio }));
      setEditing(false);
      setServerErrors({});
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const getFieldError = (field: "bio") => serverErrors[field];

  const displayDetails = localDetails ?? details;
  const characterCount = bio.length;
  const maxCharacters = 1000; // يمكن تعديل هذا الرقم حسب الحاجة

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">نبذة عن المعالج</h3>
        </div>
        
        {!editing ? (
          <Button 
            onClick={startEdit} 
            variant="outline" 
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل النبذة
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
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-[#32A88D] mt-1" />
            <div className="flex-1">
              <span className="text-sm text-gray-500 block mb-3">النبذة الشخصية</span>
              {displayDetails?.bio ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-justify">
                    {displayDetails.bio}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>لا توجد نبذة شخصية مضافة</p>
                  <p className="text-sm mt-1">اضغط على زر التعديل لإضافة نبذة عن نفسك</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            تعديل النبذة الشخصية
          </h4>
          
          <div className="space-y-4">
            <TextArea
              label="النبذة الشخصية"
              rtl
              value={bio}
              onChange={(e) => handleChange(e.target.value)}
              error={getFieldError("bio")}
              className="bg-white min-h-[200px] resize-vertical"
              placeholder="أكتب نبذة مختصرة عن نفسك، خبراتك، تخصصك، وأي معلومات أخرى تريد مشاركتها مع المرضى..."
            />
            
            {/* عداد الأحرف */}
            <div className="flex justify-between items-center text-sm">
              <span className={`${
                characterCount > maxCharacters * 0.8 
                  ? "text-amber-600" 
                  : "text-gray-500"
              }`}>
                {characterCount} / {maxCharacters} حرف
              </span>
              {characterCount > maxCharacters * 0.8 && (
                <span className="text-amber-600">
                  {characterCount > maxCharacters 
                    ? "تجاوزت الحد المسموح" 
                    : "اقتربت من الحد المسموح"}
                </span>
              )}
            </div>

            {/* نصائح للكتابة */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                نصائح للكتابة:
              </h5>
              <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                <li>اذكر تخصصك وخبراتك العملية</li>
                <li>أضف معلومات عن نهجك في العلاج</li>
                <li>شارك شهاداتك أو إنجازاتك البارزة</li>
                <li>حافظ على اللغة واضحة ومهنية</li>
              </ul>
            </div>

          
          </div>
        </div>
      )}
    </div>
  );
}