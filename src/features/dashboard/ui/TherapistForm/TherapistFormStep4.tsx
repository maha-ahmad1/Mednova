"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import * as z from "zod";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { Controller } from "react-hook-form";
import { TextArea } from "@/shared/ui/TextArea";
const step4Schema = z.object({
  bio: z.string().min(10, "يرجى كتابة نبذة لا تقل عن 10 أحرف"),
});

type Step4Data = z.infer<typeof step4Schema>;

export function TherapistFormStep4({ onBack }: { onBack: () => void }) {
  const methods = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: Step4Data) => {
    console.log("✅ النموذج النهائي:", data);
    alert("تم إرسال بياناتك بنجاح!");
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
              onClick={onBack}
              className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] !hovetr:bg-[#32A88D] hover:text-white"
            >
              رجوع
            </FormSubmitButton>
            <FormSubmitButton className="px-6 py-5">التالي</FormSubmitButton>
          </div>
        </form>
      </FormProvider>
    </FormStepCard>
  );
}
