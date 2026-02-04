// "use client";
// import { FormInput } from "@/shared/ui/forms";
// import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
// import { useForm, FormProvider ,Controller} from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   GraduationCap,
//   Briefcase,
//   Globe,
//   Building2,
//   ChartLine,
// } from "lucide-react";
// import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
// // import { useState } from "react";
// //import { TherapistFormValues } from "@/app/api/therapist";
// import { medicalSpecialties } from "@/constants/medicalSpecialties";
// import { FormSelect } from "@/shared/ui/forms";
// // import Image from "next/image";
// // import { Button } from "@/components/ui/button";

// const step2Schema = z.object({
//   medical_specialties_id: z.string().min(1, "يرجى اختيار التخصص"),
//   university_name: z.string().min(1, "اسم الجامعة مطلوب"),
//   graduation_year: z.string().min(1, "سنة التخرج مطلوبة"),
//   countries_certified: z.string().min(1, "يرجى إدخال الدول المعتمد فيها"),
//   experience_years: z.string().min(1, "عدد سنوات الخبرة مطلوب"),
//   // image: z.instanceof(File, { message: "يرجى رفع صورة شخصية" }),
// });

// type Step2Data = z.infer<typeof step2Schema>;

// interface TherapistStep2Props {
//   onNext: () => void;
//   onBack: () => void;
//   formData: Partial<z.infer<typeof step2Schema>>;
//   updateFormData: (
//     data: Partial<Record<string, string | File | undefined>>
//   ) => void;
//   setGlobalErrors?: (errors: Record<string, string>) => void;
// }

// export function TherapistFormStep2({
//   onNext,
//   onBack,
//   formData,
//   updateFormData,
// }: TherapistStep2Props) {
//   const methods = useForm<Step2Data>({
//     resolver: zodResolver(step2Schema),
//     mode: "onChange",
//     defaultValues: {
//       medical_specialties_id: formData.medical_specialties_id || "",
//       university_name: formData.university_name || "",
//       graduation_year: formData.graduation_year || "",
//       countries_certified: formData.countries_certified || "",
//       experience_years: formData.experience_years || "",
//     },
//   });

//   // const [profileImage, setProfileImage] = useState<File | null>(
//   //   formData.image && typeof formData.image !== "string" ? formData.image : null
//   // );
//   // const [imagePreview, setImagePreview] = useState<string | null>(
//   //   formData.image && typeof formData.image === "string" ? formData.image : null
//   // );

//   // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (file) {
//   //     setProfileImage(file);
//   //     methods.setValue("image", file, { shouldValidate: true });
//   //     setImagePreview(URL.createObjectURL(file));
//   //   }
//   // };

//   // const removeImage = () => {
//   //   setProfileImage(null);
//   //   methods.resetField("image");
//   //   setImagePreview(null);
//   // };

//   const {
//     handleSubmit,
//     register,
//     formState: { errors },
//   } = methods;

//   const onSubmit = (data: Step2Data) => {
//     updateFormData(data);
//     onNext();
//   };

//   return (
//     <FormStepCard
//       title="انضم كمختص إلى ميدنوفا"
//       description="سجّل كمختص في منصة ميدنوفا لبدء تقديم الاستشارات الطبية والمساهمة في تحسين الرعاية الصحية."
//     >
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Controller
//               control={methods.control}
//               name="medical_specialties_id"
//               render={({ field }) => (
//                 <FormSelect
//                   label="التخصص الطبي"
//                   placeholder="اختر التخصص"
//                   options={medicalSpecialties.map((s) => ({
//                     value: s.id,
//                     label: s.name,
//                   }))}
//                   value={field.value}
//                   onValueChange={field.onChange}
//                   rtl
//                   error={errors.medical_specialties_id?.message}
//                 />
//               )}
//             />

//             <FormInput
//               label="اسم الجامعة"
//               placeholder="أدخل اسم الجامعة"
//               icon={Building2}
//               iconPosition="right"
//               rtl
//               error={errors.university_name?.message}
//               {...register("university_name")}
//             />

//             <FormInput
//               label="سنة التخرج"
//               type="number"
//               placeholder="مثال: 2020"
//               icon={GraduationCap}
//               iconPosition="right"
//               rtl
//               className="no-spinner"
//               error={errors.graduation_year?.message}
//               {...register("graduation_year")}
//             />

//             <FormInput
//               label="عدد سنوات الخبرة"
//               type="number"
//               placeholder="مثال: 5"
//               icon={ChartLine}
//               iconPosition="right"
//               rtl
//               className="no-spinner"
//               error={errors.experience_years?.message}
//               {...register("experience_years")}
//             />

//             <FormInput
//               label="الدول المعتمد فيها"
//               placeholder="أدخل الدول المعتمدة"
//               icon={Globe}
//               iconPosition="right"
//               rtl
//               error={errors.countries_certified?.message}
//               {...register("countries_certified")}
//             />
//           </div>
//           {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <FormInput
//               label="الصورة الشخصية"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//             />

//             {imagePreview && (
//               <div className="relative w-32 h-32">
//                 <Image
//                   src={imagePreview}
//                   alt="Profile preview"
//                   fill
//                   className="rounded-lg object-cover"
//                 />
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="sm"
//                   className="absolute top-1 right-1"
//                   onClick={removeImage}
//                 >
//                   إزالة
//                 </Button>
//               </div>
//             )}
//           </div> */}
//           <div className="flex justify-between mt-4">
//             <FormSubmitButton
//               align="left"
//               type="button"
//               onClick={onBack}
//               className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] !hovetr:bg-[#32A88D] hover:text-white"
//             >
//               رجوع
//             </FormSubmitButton>
//             <FormSubmitButton className="px-6 py-5">التالي</FormSubmitButton>
//           </div>
//         </form>
//       </FormProvider>
//     </FormStepCard>
//   );
// }



"use client"
import { FormInput } from "@/shared/ui/forms"
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GraduationCap, Globe, Building2, Baseline as ChartLine, Video, MessageSquare } from "lucide-react"
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard"
import { medicalSpecialties } from "@/constants/medicalSpecialties"
import { FormSelect } from "@/shared/ui/forms"
import { therapistStep2Schema } from "@/features/profile/_create/validation/registrationSchemas"
import { z } from "zod"

type Step2Data = z.infer<typeof therapistStep2Schema>

interface TherapistStep2Props {
  onNext: () => void
  onBack: () => void
  formData: Partial<z.infer<typeof step2Schema>>
  updateFormData: (data: Partial<Record<string, string | File | undefined>>) => void
  setGlobalErrors?: (errors: Record<string, string>) => void
}

const currencyOptions = [
   { value: "OMR", label: "ريال عماني (OMR)" },

]

export function TherapistFormStep2({ onNext, onBack, formData, updateFormData }: TherapistStep2Props) {
  const methods = useForm<Step2Data>({
    resolver: zodResolver(therapistStep2Schema),
    mode: "onChange",
    defaultValues: {
      medical_specialties_id: formData.medical_specialties_id || "",
      university_name: formData.university_name || "",
      graduation_year: formData.graduation_year ?? "",
      countries_certified: formData.countries_certified || "",
      experience_years: formData.experience_years ?? "",
      video_consultation_price: formData.video_consultation_price ?? "",
      chat_consultation_price: formData.chat_consultation_price ?? "",
      currency: formData.currency || "",
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  const onSubmit = (data: Step2Data) => {
    updateFormData(data)
    onNext()
  }

  return (
    <FormStepCard
      title="انضم كمختص إلى ميدنوفا"
      description="سجّل كمختص في منصة ميدنوفا لبدء تقديم الاستشارات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Controller
              control={methods.control}
              name="medical_specialties_id"
              render={({ field }) => (
                <FormSelect
                  label="التخصص الطبي"
                  placeholder="اختر التخصص"
                  options={medicalSpecialties.map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  rtl
                  error={errors.medical_specialties_id?.message}
                />
              )}
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

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground">معلومات الأسعار</h3>

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
              className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] !hovetr:bg-[#32A88D] hover:text-white"
            >
              رجوع
            </FormSubmitButton>
            <FormSubmitButton className="px-6 py-5">التالي</FormSubmitButton>
          </div>
        </form>
      </FormProvider>
    </FormStepCard>
  )
}
