"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/shared/ui/forms";
import { toast } from "sonner";
import type { TherapistProfile } from "@/types/therpist";
import type { TherapistFormValues } from "@/app/api/therapist";
import { useUpdateTherapist } from "@/features/profile/_views/hooks/useUpdateTherapist";
import { pricingSchema } from "@/lib/validation";
import { Loader2, Edit, Video, MessageSquare, BadgeDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TherapistPricingCardProps = {
  details: TherapistProfile["therapist_details"];
  userId: string;
  refetch: () => void;
};

const currencyOptions = [{ value: "OMR", label: "ريال عماني (OMR)" }];

export function TherapistPricingCard({
  details,
  userId,
  refetch,
}: TherapistPricingCardProps) {
  const [editing, setEditing] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    video_consultation_price: "",
    chat_consultation_price: "",
    currency: "",
  });

  const { update, isUpdating } = useUpdateTherapist({
    onValidationError: (errs) => setServerErrors(errs || {}),
  });

  useEffect(() => {
    setValues({
      video_consultation_price:
        details?.video_consultation_price?.toString() || "",
      chat_consultation_price:
        details?.chat_consultation_price?.toString() || "",
      currency: details?.currency || "",
    });
  }, [details?.video_consultation_price, details?.chat_consultation_price, details?.currency]);

  const startEdit = () => {
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setValues({
      video_consultation_price:
        details?.video_consultation_price?.toString() || "",
      chat_consultation_price:
        details?.chat_consultation_price?.toString() || "",
      currency: details?.currency || "",
    });
    setServerErrors({});
  };

  const getFieldError = (field: keyof typeof values) => {
    const serverError = serverErrors[field];
    const clientError = pricingSchema.shape[field]?.safeParse(values[field] ?? "")
      .error?.issues?.[0]?.message;
    return serverError ?? clientError;
  };

  const handleSave = async () => {
    const result = pricingSchema.safeParse(values);
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
      customer_id: String(userId),
    };

    try {
      await update(payload);
      await refetch();
      toast.success("تم تحديث الأسعار بنجاح");
      setEditing(false);
      setServerErrors({});
    } catch {
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const FieldDisplay: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
  }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
      <div className="text-[#32A88D] mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-sm text-gray-500 block mb-2">{label}</span>
        <span className="text-gray-800 font-medium block">{value ?? "-"}</span>
      </div>
    </div>
  );

  const currencyLabel =
    currencyOptions.find((c) => c.value === values.currency)?.label ?? values.currency;

  return (
    <div className="bg-gradient-to-l from-[#32A88D]/10 to-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#32A88D] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-800">أسعار الاستشارات</h3>
        </div>

        {!editing ? (
          <Button
            onClick={startEdit}
            variant="outline"
            size="sm"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            تعديل الأسعار
          </Button>
        ) : (
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
        )}
      </div>

      {!editing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldDisplay
            icon={<Video className="w-5 h-5" />}
            label="سعر الاستشارة المرئية"
            value={
              values.video_consultation_price ? (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {values.video_consultation_price}
                </Badge>
              ) : (
                "-"
              )
            }
          />
          <FieldDisplay
            icon={<MessageSquare className="w-5 h-5" />}
            label="سعر الاستشارة النصية"
            value={
              values.chat_consultation_price ? (
                <Badge className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {values.chat_consultation_price}
                </Badge>
              ) : (
                "-"
              )
            }
          />
          <FieldDisplay
            icon={<BadgeDollarSign className="w-5 h-5" />}
            label="العملة"
            value={
              currencyLabel ? (
                <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                  {currencyLabel}
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
            تعديل أسعار الاستشارات
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="سعر الاستشارة المرئية"
              type="number"
              value={values.video_consultation_price}
              onChange={(e) =>
                setValues((v) => ({ ...v, video_consultation_price: e.target.value }))
              }
              rtl
              className="no-spinner bg-white"
              error={getFieldError("video_consultation_price")}
            />

            <FormInput
              label="سعر الاستشارة النصية"
              type="number"
              value={values.chat_consultation_price}
              onChange={(e) =>
                setValues((v) => ({ ...v, chat_consultation_price: e.target.value }))
              }
              rtl
              className="no-spinner bg-white"
              error={getFieldError("chat_consultation_price")}
            />

            <FormSelect
              label="العملة"
              options={currencyOptions}
              value={values.currency}
              onValueChange={(val) => setValues((v) => ({ ...v, currency: val }))}
              rtl
              error={getFieldError("currency")}
              className="bg-white"
              placeholder="اختر العملة"
            />
          </div>
        </div>
      )}
    </div>
  );
}
