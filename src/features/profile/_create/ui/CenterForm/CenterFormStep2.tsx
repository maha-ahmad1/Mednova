"use client";
import { FormInput } from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { useCallback } from "react";
import { useStepFormAutosave } from "@/features/profile/_create/hooks/useStepFormAutosave";
import { medicalSpecialties } from "@/constants/medicalSpecialties";
import { Video, MessageSquare, Check } from "lucide-react";
import { FormSelect } from "@/shared/ui/forms/components/FormSelect";
import { cn } from "@/lib/utils";
import { CustomCheckbox } from "@/shared/ui/forms/components/CustomCheckbox";

const step2Schema = z.object({
  specialty_id: z.array(z.string()).min(1, "يرجى اختيار تخصص واحد على الأقل"),
  // year_establishment: z.string().min(1, "سنة التأسيس مطلوبة"),
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

// مكون Checkbox مخصص للموقع
// function CustomCheckbox({
//   id,
//   checked,
//   onChange,
//   label
// }: {
//   id: string;
//   checked: boolean;
//   onChange: () => void;
//   label: string;
// }) {
//   return (
//     <div className="relative">
//       <input
//         type="checkbox"
//         id={id}
//         checked={checked}
//         onChange={onChange}
//         className="absolute opacity-0 w-0 h-0"
//       />
//       <label
//         htmlFor={id}
//         className={cn(
//           "flex items-center gap-3   cursor-pointer transition-all duration-200",
//         )}
//       >
//         <div className={cn(
//           "flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all duration-200",
//           checked
//             ? "border-[#32A88D] bg-[#32A88D]"
//             : "border-gray-300 bg-white"
//         )}>
//           {checked && (
//             <Check className="w-4 h-4 text-white stroke-[3]" />
//           )}
//         </div>

//         {/* النص */}
//         <span className={cn(
//           "text-base font-medium transition-colors duration-200",
//           checked ? "text-[#32A88D]" : "text-gray-700"
//         )}>
//           {label}
//         </span>
//       </label>
//     </div>
//   );
// }

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
      // year_establishment: formData.year_establishment || "",
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

  const persistDraft = useCallback((values: Partial<Step2Data>) => {
    updateFormData(values);
  }, [updateFormData]);

  useStepFormAutosave(methods, persistDraft);

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
          {/* قسم التخصصات الطبية مع تصميم جديد */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="block font-medium text-lg mb-2 text-gray-800">
                التخصصات الطبية
              </label>
            </div>

            {/* <p className="text-gray-600 text-sm mb-4">
              اختر التخصصات الطبية التي يقدمها مركزك (يمكن اختيار أكثر من تخصص)
            </p> */}

            {/* شبكة التخصصات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medicalSpecialties.map((specialty) => (
                <CustomCheckbox
                  key={specialty.id}
                  id={specialty.id}
                  checked={selectedSpecialties.includes(specialty.id)}
                  onChange={() => toggleSpecialty(specialty.id)}
                  label={specialty.name}
                  // error={errors.specialty.id?.message}
                />
              ))}
            </div>
            {errors.specialty_id && (
              <p className="text-sm text-destructive">
                {errors.specialty_id.message}
              </p>
            )}
            {/* رسالة الخطأ */}
            {/* {errors.specialty_id && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-600 text-sm font-medium">
                  {errors.specialty_id.message}
                </p>
              </div>
            )} */}

            {/* عداد التخصصات المختارة */}
            {/* {selectedSpecialties.length > 0 && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-[#32A88D]/10 border border-[#32A88D]/20 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center bg-[#32A88D] text-white rounded-full text-sm font-bold">
                  {selectedSpecialties.length}
                </div>
                <p className="text-[#32A88D] font-medium">
                  {selectedSpecialties.length} تخصص{selectedSpecialties.length > 1 ? "ات" : ""} مختار{selectedSpecialties.length > 1 ? "ة" : ""}
                </p>
              </div>
            )} */}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-800">
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
