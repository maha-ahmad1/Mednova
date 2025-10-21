"use client";
import { FormInput } from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  GraduationCap,
  Briefcase,
  Globe,
  Building2,
  ChartLine,
} from "lucide-react";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
const step2Schema = z.object({
  medical_specialties_id: z.string().min(1, "يرجى اختيار التخصص"),
  university_name: z.string().min(1, "اسم الجامعة مطلوب"),
  graduation_year: z.string().min(1, "سنة التخرج مطلوبة"),
  countries_certified: z.string().min(1, "يرجى إدخال الدول المعتمد فيها"),
  experience_years: z.string().min(1, "عدد سنوات الخبرة مطلوب"),
});

type Step2Data = z.infer<typeof step2Schema>;

export function TherapistFormStep2({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const methods = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data: Step2Data) => {
    console.log("Step 2 data:", data);
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
              label="التخصص الطبي"
              placeholder="أدخل تخصصك"
              icon={Briefcase}
              iconPosition="right"
              rtl
              error={errors.medical_specialties_id?.message}
              {...register("medical_specialties_id")}
            />

            <FormInput
              label="اسم الجامعة"
              placeholder="أدخل اسم الجامعة"
              icon={Building2}
              iconPosition="right"
              rtl
              error={errors.university_name?.message}
              {...register("university_name")}
            />

            <FormInput
              label="سنة التخرج"
              type="number"
              placeholder="مثال: 2020"
              icon={GraduationCap}
              iconPosition="right"
              rtl
              className="no-spinner"
              error={errors.graduation_year?.message}
              {...register("graduation_year")}
            />

            <FormInput
              label="عدد سنوات الخبرة"
              type="number"
              placeholder="مثال: 5"
              icon={ChartLine}
              iconPosition="right"
              rtl
              className="no-spinner"
              error={errors.experience_years?.message}
              {...register("experience_years")}
            />

            <FormInput
              label="الدول المعتمد فيها"
              placeholder="أدخل الدول المعتمدة"
              icon={Globe}
              iconPosition="right"
              rtl
              error={errors.countries_certified?.message}
              {...register("countries_certified")}
            />
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
