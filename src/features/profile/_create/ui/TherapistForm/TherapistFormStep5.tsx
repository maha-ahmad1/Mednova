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
import { useTherapist } from "@/features/profile/_create/hooks/useTherapistStore";
import { showSuccessToast } from "@/lib/toastUtils";
import { toast } from "sonner";
import type { TherapistFormValues } from "@/app/api/therapist";
import { Loader2 } from "lucide-react";
import { SubmitHandler } from "react-hook-form";
import { useApplyServerErrors } from "@/features/profile/_create/hooks/useApplyServerErrors";

interface TherapistStep4Props {
  onBack: () => void;
  formData: Record<string, unknown>;
  updateFormData: (data: Partial<Record<string, unknown>>) => void;
  globalErrors?: Record<string, string>;
  setGlobalErrors?: (errors: Record<string, string>) => void;
}
const step4Schema = z.object({
  bio: z.string().min(10, "يرجى كتابة نبذة لا تقل عن 10 أحرف"),
});

type Step4Data = z.infer<typeof step4Schema>;

export function TherapistFormStep5({
  onBack,
  formData,
  updateFormData,
  globalErrors,
  setGlobalErrors,
}: TherapistStep4Props) {
  const methods = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
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

  useApplyServerErrors<Step4Data>({
    errors: globalErrors,
    setError: methods.setError,
    fields: stepFields,
  });

  const { data: session, update } = useSession();
  const router = useRouter();
  const { storeTherapist, isStoring } = useTherapist({
    onValidationError: (errors) => {
      setGlobalErrors?.(errors);
    },
  });

  const onSubmit: SubmitHandler<Step4Data> = async (data) => {
    console.log("Starting form submission...");
    console.log(" Session:", session);
    console.log(" Form data:", data);
    console.log(" Combined formData:", formData);
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

      const schedulePayload = {
        day_of_week: (formData.day_of_week as string[]) || [],
        start_time_morning: formData.start_time_morning || "",
        end_time_morning: formData.end_time_morning || "",
        is_have_evening_time: isHaveEveningNumber,
      };

      const rawPayload = {
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
        customer_id: session.user.id,
        full_name:
          typeof formData.full_name === "string"
            ? formData.full_name
            : undefined,
        email: typeof formData.email === "string" ? formData.email : undefined,
        phone: typeof formData.phone === "string" ? formData.phone : undefined,
        gender:
          formData.gender === "male"
            ? "Male"
            : formData.gender === "female"
            ? "Female"
            : undefined,
        formatted_address:
          typeof formData.formatted_address === "string"
            ? formData.formatted_address
            : undefined,
        medical_specialties_id:
          typeof formData.medical_specialties_id === "string"
            ? formData.medical_specialties_id
            : undefined,
        university_name:
          typeof formData.university_name === "string"
            ? formData.university_name
            : undefined,
        graduation_year:
          typeof formData.graduation_year === "string"
            ? formData.graduation_year
            : undefined,
        countries_certified:
          typeof formData.countries_certified === "string"
            ? formData.countries_certified
            : undefined,
        experience_years:
          typeof formData.experience_years === "string"
            ? formData.experience_years
            : undefined,
        license_number:
          typeof formData.license_number === "string"
            ? formData.license_number
            : undefined,
        license_authority:
          typeof formData.license_authority === "string"
            ? formData.license_authority
            : undefined,
        certificate_file:
          formData.certificate_file instanceof File
            ? formData.certificate_file
            : undefined,
        license_file:
          formData.license_file instanceof File
            ? formData.license_file
            : undefined,
        bio: data.bio,
        birth_date:
          typeof formData.birth_date === "string"
            ? formData.birth_date
            : undefined,
        image:
          formData.image instanceof File
            ? formData.image
            : z.string().parse(formData.image),
        country:
          typeof formData.country === "string" ? formData.country : undefined,
        city: typeof formData.city === "string" ? formData.city : undefined,
        day_of_week: schedulePayload.day_of_week,
        start_time_morning: schedulePayload.start_time_morning,
        end_time_morning: schedulePayload.end_time_morning,
        is_have_evening_time: schedulePayload.is_have_evening_time,
        timezone:
          typeof formData.timezone === "string" ? formData.timezone : undefined,
      } as Record<string, unknown>;

      if (eveningFlag) {
        (rawPayload as Record<string, unknown>).start_time_evening =
          formData.start_time_evening || "";
        (rawPayload as Record<string, unknown>).end_time_evening =
          formData.end_time_evening || "";
      }

      const payload = rawPayload as unknown as TherapistFormValues;

      await storeTherapist(payload);
      setGlobalErrors?.({});
      updateFormData({ bio: data.bio });

      await update({
        user: {
          ...session.user,
          is_completed: true,
        },
      });
      showSuccessToast("تم إرسال بياناتك بنجاح!");

      router.replace("/profile");
    } catch {}
  };

  return (
    <FormStepCard
      title="انضم كمختص إلى ميدنوفا"
      description="سجّل كمختص في منصة ميدنوفا لبدء تقديم الاستشارات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextArea
                label="نبذة عنك"
                rtl
                placeholder="اكتب نبذة قصيرة..."
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
              className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] !hovetr:bg-[#32A88D] hover:text-white"
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
