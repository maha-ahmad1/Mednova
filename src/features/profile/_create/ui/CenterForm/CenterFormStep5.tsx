"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import * as z from "zod";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { Controller } from "react-hook-form";
import { TextArea } from "@/shared/ui/components/TextArea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCenterStore } from "@/features/profile/_create/hooks/useCenterStore";
import { showSuccessToast } from "@/lib/toastUtils";
import { toast } from "sonner";
import type { CenterFormValues } from "@/app/api/center";
import { Loader2 } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { useApplyServerErrors } from "@/features/profile/_create/hooks/useApplyServerErrors";
import { useClearServerErrorsOnChange } from "@/features/profile/_create/hooks/useClearServerErrorsOnChange";

const step5Schema = z.object({
  bio: z.string().min(10, "يرجى كتابة نبذة لا تقل عن 10 أحرف"),
});

type Step5Data = z.infer<typeof step5Schema>;

interface CenterStep5Props {
  onBack: () => void;
  formData: Record<string, unknown>;
  updateFormData: (data: Partial<Record<string, unknown>>) => void;
  globalErrors?: Record<string, string>;
  setGlobalErrors?: (errors: Record<string, string>) => void;
}

export function CenterFormStep5({
  onBack,
  formData,
  updateFormData,
  globalErrors,
  setGlobalErrors,
}: CenterStep5Props) {
  const methods = useForm<Step5Data>({
    resolver: zodResolver(step5Schema),
    mode: "onChange",
    defaultValues: {
      bio: String((formData as Record<string, unknown>).bio ?? ""),
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const stepFields = ["bio"] as const;

  useApplyServerErrors<Step5Data>({
    errors: globalErrors,
    setError: methods.setError,
    fields: stepFields,
  });

  useClearServerErrorsOnChange<Step5Data>({
    methods,
    setErrors: setGlobalErrors,
    fields: stepFields,
  });

  const { data: session, update } = useSession();
  const router = useRouter();
  const { storeCenter, isStoring } = useCenterStore({
    onValidationError: (errors) => {
      setGlobalErrors?.(errors);
    },
  });

  const onSubmit: SubmitHandler<Step5Data> = async (data) => {
    console.log("Starting form submission...");
    console.log("Session:", session);
    console.log("Form data:", data);
    console.log("Combined formData:", formData);

    if (!session?.user?.id) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    if (!navigator.onLine) {
      toast.error("لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك.");
      return;
    }

    try {
      const eveningFlag =
        formData.is_have_evening_time === 1 ||
        formData.is_have_evening_time === "1" ||
        formData.is_have_evening_time === true;

      const isHaveEveningNumber = eveningFlag ? 1 : 0;

      const rawPayload = {
        customer_id: session.user.id,
        gender:
          formData.gender === "male"
            ? "Male"
            : formData.gender === "female"
            ? "Female"
            : undefined,
        birth_date:
          typeof formData.birth_date === "string"
            ? formData.birth_date
            : undefined,
        image:
          formData.image instanceof File
            ? formData.image
            : z.string().parse(formData.image),
        specialty_id: Array.isArray(formData.specialty_id)
          ? formData.specialty_id.map(String)
          : [],
        year_establishment:
          typeof formData.year_establishment === "string"
            ? formData.year_establishment
            : undefined,

        name_center:
          typeof formData.name_center === "string"
            ? formData.name_center
            : undefined,
        has_commercial_registration:
          formData.has_commercial_registration === 1 ||
          formData.has_commercial_registration === true,
        commercial_registration_number:
          typeof formData.commercial_registration_number === "string"
            ? formData.commercial_registration_number
            : undefined,
        commercial_registration_file:
          formData.commercial_registration_file instanceof File
            ? formData.commercial_registration_file
            : undefined,
        commercial_registration_authority:
          typeof formData.commercial_registration_authority === "string"
            ? formData.commercial_registration_authority
            : undefined,
        license_authority:
          typeof formData.license_authority === "string"
            ? formData.license_authority
            : undefined,
        license_file:
          formData.license_file instanceof File
            ? formData.license_file
            : undefined,
        license_number:
          typeof formData.license_number === "string"
            ? formData.license_number
            : undefined,
        bio: data.bio,
        day_of_week: (formData.day_of_week as string[]) || [],
        video_consultation_price:
          typeof formData.video_consultation_price === "string" ||
          typeof formData.video_consultation_price === "number"
            ? formData.video_consultation_price
            : undefined,

        chat_consultation_price:
          typeof formData.chat_consultation_price === "string" ||
          typeof formData.chat_consultation_price === "number"
            ? formData.chat_consultation_price
            : undefined,

        currency:
          typeof formData.currency === "string" ? formData.currency : undefined,
        is_have_evening_time: isHaveEveningNumber,
        start_time_morning: formData.start_time_morning || "",
        end_time_morning: formData.end_time_morning || "",
        city: typeof formData.city === "string" ? formData.city : undefined,
        country:
          typeof formData.country === "string" ? formData.country : undefined,
        timezone:
          typeof formData.timezone === "string" ? formData.timezone : undefined,
        formatted_address:
          typeof formData.formatted_address === "string"
            ? formData.formatted_address
            : undefined,
      } as Record<string, unknown>;
      if (eveningFlag) {
        (rawPayload as Record<string, unknown>).start_time_evening =
          formData.start_time_evening || "";
        (rawPayload as Record<string, unknown>).end_time_evening =
          formData.end_time_evening || "";
      }

      const payload = rawPayload as unknown as CenterFormValues;

      await storeCenter(payload);
      setGlobalErrors?.({});
      updateFormData({ bio: data.bio });

      await update({
        user: {
          ...session.user,
          is_completed: true,
        },
      });
      showSuccessToast("تم إرسال بيانات المركز بنجاح!");

      router.replace("/profile");
    } catch {}
  };

  return (
    <FormStepCard
      title="انضم كمركز طبي إلى ميدنوفا"
      description="سجّل مركزك الطبي في منصة ميدنوفا لبدء تقديم الخدمات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextArea
                label="نبذة عن المركز"
                rtl
                placeholder="اكتب نبذة قصيرة عن المركز..."
                value={field.value}
                onChange={field.onChange}
                error={errors.bio?.message}
              />
            )}
          />

          <div className="flex justify-between mt-4">
            <FormSubmitButton
              align="left"
              type="button"
              onClick={() => {
                updateFormData({ bio: methods.getValues("bio") })
                onBack()
              }}
              className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] hover:text-white"
            >
              رجوع
            </FormSubmitButton>
            <FormSubmitButton className="px-6 py-5" disabled={isStoring}>
              {isStoring ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" /> جارٍ
                  الإرسال...
                </>
              ) : (
                "إرسال"
              )}
            </FormSubmitButton>
          </div>
        </form>
      </FormProvider>
    </FormStepCard>
  );
}
