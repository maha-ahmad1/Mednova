"use client";
import { FormInput } from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, BadgeCheck, Copyright, ShieldCheck } from "lucide-react";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { FormFileUpload } from "@/shared/ui/forms";

const step3Schema = z.object({
  license_number: z.string().min(1, "رقم الترخيص مطلوب"),
  license_authority: z.string().min(1, "الجهة المصدرة مطلوبة"),
  certificate_file: z.any().optional(),
  license_file: z.any().optional(),
});

type Step3Data = z.infer<typeof step3Schema>;

export function TherapistFormStep3({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const methods = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data: Step3Data) => {
    console.log("Step 3 data:", data);
    onNext();
  };

  return (
    <FormStepCard
      title="انضم كمختص إلى ميدنوفا"
      description="سجّل كمختص في منصة ميدنوفا لبدء تقديم الاستشارات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="رقم الترخيص"
              placeholder="أدخل رقم الترخيص"
              icon={BadgeCheck}
              iconPosition="right"
              rtl
              error={errors.license_number?.message}
              {...register("license_number")}
            />

            <FormInput
              label="الجهة المصدرة"
              placeholder="اسم الجهة"
              icon={FileText}
              iconPosition="right"
              rtl
              error={errors.license_authority?.message}
              {...register("license_authority")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FormFileUpload
                type="file"
                label=" ملف الشهادة"
                icon={ShieldCheck}
                iconPosition="right"
                rtl
                error={errors.license_authority?.message}
                {...register("certificate_file")}
              />
            </div>

            <div>
              <FormFileUpload
                type="file"
                label="   ملف الترخيص"
                icon={Copyright}
                iconPosition="right"
                rtl
                error={errors.license_authority?.message}
                {...register("license_file")}
              />
            </div>
          </div>

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
