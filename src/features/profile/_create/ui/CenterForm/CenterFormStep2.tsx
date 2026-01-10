"use client";
import { FormInput } from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "lucide-react";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { medicalSpecialties } from "@/constants/medicalSpecialties";
import { Checkbox } from "@/components/ui/checkbox";
import { Video, MessageSquare } from "lucide-react";
import { FormSelect } from "@/shared/ui/forms/components/FormSelect";
const step2Schema = z.object({
  specialty_id: z.array(z.string()).min(1, "يرجى اختيار تخصص واحد على الأقل"),
  year_establishment: z.string().min(1, "سنة التأسيس مطلوبة"),
  video_consultation_price: z
    .string()
    .min(1, "حقل سعر الاستشارة المرئية مطلوب."),
  chat_consultation_price: z.string().min(1, "حقل سعر الاستشارة النصية مطلوب."),
  currency: z.string().min(1, "حقل العملة مطلوب."),
});

type Step2Data = z.infer<typeof step2Schema>;

interface CenterStep2Props {
  onNext: () => void;
  onBack: () => void;
  formData: Partial<Step2Data>;
  updateFormData: (data: Partial<Step2Data>) => void;
  setGlobalErrors?: (errors: Record<string, string>) => void;
}

export function CenterFormStep2({
  onNext,
  onBack,
  formData,
  updateFormData,
}: CenterStep2Props) {
  const methods = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      specialty_id: formData.specialty_id || [],
      year_establishment: formData.year_establishment || "",
      video_consultation_price: formData.video_consultation_price || "",
      chat_consultation_price: formData.chat_consultation_price || "",
      currency: formData.currency || "",
    },
  });
  const currencyOptions = [{ value: "OMR", label: "ريال عماني (OMR)" }];
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedSpecialties = watch("specialty_id");

  const toggleSpecialty = (specialtyId: string) => {
    if (selectedSpecialties.includes(specialtyId)) {
      setValue(
        "specialty_id",
        selectedSpecialties.filter((id) => id !== specialtyId)
      );
    } else {
      setValue("specialty_id", [...selectedSpecialties, specialtyId]);
    }
  };

  const onSubmit = (data: Step2Data) => {
    updateFormData(data);
    onNext();
  };

  return (
    <FormStepCard
      title="انضم كمركز طبي إلى ميدنوفا"
      description="سجّل مركزك الطبي في منصة ميدنوفا لبدء تقديم الخدمات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          <div>
            <label className="block mb-3 font-medium text-lg">
              التخصصات الطبية
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medicalSpecialties.map((specialty) => (
                <div
                  key={specialty.id}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <Controller
                    name="specialty_id"
                    control={control}
                    render={() => (
                      <Checkbox
                        id={specialty.id}
                        checked={selectedSpecialties.includes(specialty.id)}
                        onCheckedChange={() => toggleSpecialty(specialty.id)}
                      />
                    )}
                  />
                  <label
                    htmlFor={specialty.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {specialty.name}
                  </label>
                </div>
              ))}
            </div>
            {errors.specialty_id && (
              <p className="text-red-500 text-sm mt-2">
                {errors.specialty_id.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="سنة التأسيس"
              type="number"
              placeholder="مثال: 2015"
              icon={Calendar}
              iconPosition="right"
              rtl
              className="no-spinner"
              error={errors.year_establishment?.message}
              {...register("year_establishment")}
            />
          </div>
     <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground">
              معلومات الأسعار
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="سعر الاستشارة المرئية"
                type="number"
                placeholder="أدخل السعر"
                icon={Video}
                iconPosition="right"
                rtl
                className="no-spinner"
                error={errors.video_consultation_price?.message}
                {...register("video_consultation_price")}
              />

              <FormInput
                label="سعر الاستشارة النصية"
                type="number"
                placeholder="أدخل السعر"
                icon={MessageSquare}
                iconPosition="right"
                rtl
                className="no-spinner"
                error={errors.chat_consultation_price?.message}
                {...register("chat_consultation_price")}
              />

              <Controller
                control={methods.control}
                name="currency"
                render={({ field }) => (
                  <FormSelect
                    label="العملة"
                    placeholder="اختر العملة"
                    options={currencyOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    rtl
                    error={errors.currency?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <FormSubmitButton
              align="left"
              type="button"
              onClick={onBack}
              className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] hover:text-white"
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
