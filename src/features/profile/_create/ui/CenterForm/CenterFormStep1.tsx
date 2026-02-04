"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Phone, Home, Loader2, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

import { FormInput, FormSelect, ProfileImageUpload } from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { useApplyServerErrors } from "@/features/profile/_create/hooks/useApplyServerErrors";
import { useClearServerErrorsOnChange } from "@/features/profile/_create/hooks/useClearServerErrorsOnChange";

const step1Schema = z.object({
  full_name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  gender: z.enum(["male", "female"]),
  formatted_address: z.string().min(1, "العنوان مطلوب"),
  year_establishment: z.string().min(4, "سنة التأسيس مطلوبة"),
  image: z.instanceof(File, { message: "يرجى رفع صورة المركز" }),
  name_center: z.string().min(1, "اسم المركز مطلوب"),
  birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
});

type Step1Data = z.infer<typeof step1Schema>;

interface CenterStep1Props {
  onNext: () => void;
  formData: Partial<Step1Data>;
  updateFormData: (data: Partial<Step1Data>) => void;
  globalErrors?: Record<string, string>;
  setGlobalErrors?: (errors: Record<string, string>) => void;
}

export function CenterFormStep1({
  onNext,
  formData,
  updateFormData,
  globalErrors,
  setGlobalErrors,
}: CenterStep1Props) {
  const { data: session, status } = useSession();

  const methods = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      name_center: formData.name_center || "",
      full_name: formData.full_name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      gender: formData.gender || undefined,
      formatted_address: formData.formatted_address || "",
      year_establishment: formData.year_establishment || "",
      image: formData?.image instanceof File ? formData.image : undefined,
      birth_date: formData.birth_date || "",
    } as Partial<Step1Data>,
  });

  const [centerImage, setCenterImage] = useState<File | undefined>(
    formData?.image instanceof File ? formData.image : undefined
  );

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
  } = methods;

  useEffect(() => {
    if (centerImage) {
      methods.setValue("image", centerImage, { shouldValidate: true });
    } else {
      methods.resetField("image");
    }
  }, [centerImage, methods]);

  useEffect(() => {
    if (session?.user && !formData.full_name) {
      methods.reset({
        full_name: session.user.full_name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        gender: formData.gender || undefined,
        formatted_address: formData.formatted_address || "",
        year_establishment: formData.year_establishment || "",
        birth_date: formData.birth_date || "",
        image: formData?.image instanceof File ? formData.image : undefined,
        name_center: formData.name_center || "",
      });
    }
  }, [session?.user, methods, formData]);

  const stepFields = [
    "name_center",
    "full_name",
    "email",
    "phone",
    "gender",
    "formatted_address",
    "year_establishment",
    "image",
    "birth_date",
  ] as const;

  useApplyServerErrors<Step1Data>({
    setError,
    fields: stepFields,
  });

  useClearServerErrorsOnChange<Step1Data>({
    methods,
    setErrors: setGlobalErrors,
    fields: stepFields,
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
      </div>
    );
  }

  const onSubmit = (data: Step1Data) => {
    updateFormData({ ...data, image: centerImage ?? data.image });
    onNext();
  };

  return (
    <FormStepCard
      title="انضم كمركز طبي إلى ميدنوفا"
      description="سجّل مركزك الطبي في منصة ميدنوفا لبدء تقديم الخدمات الطبية والمساهمة في تحسين الرعاية الصحية."
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
          {/* <h3 className="text-sm font-semibold text-muted-foreground">
            بيانات المستخدم
          </h3> */}
          <h3 className="text-lg font-semibold text-foreground">
            بيانات المستخدم
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="الاسم الكامل"
              icon={User}
              iconPosition="right"
              rtl
              error={errors.full_name?.message}
              {...register("full_name")}
              readOnly
            />

            <FormInput
              label="البريد الإلكتروني"
              type="email"
              icon={Mail}
              iconPosition="right"
              rtl
              error={errors.email?.message}
              {...register("email")}
              readOnly
            />

            <FormInput
              label="رقم الهاتف"
              icon={Phone}
              iconPosition="right"
              rtl
              error={errors.phone?.message}
              {...register("phone")}
              readOnly
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormSelect
                  label="الجنس"
                  rtl
                  options={[
                    { value: "male", label: "ذكر" },
                    { value: "female", label: "أنثى" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.gender?.message}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="تاريخ الميلاد"
              placeholder="YYYY-MM-DD"
              type="date"
              rtl
              error={errors.birth_date?.message}
              {...register("birth_date")}
            />
          </div>
          {/* <hr className="my-6" />

          <h3 className="text-sm font-semibold text-muted-foreground">
            بيانات المركز
          </h3> */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground">
              بيانات المركز
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="اسم المركز"
                icon={User}
                iconPosition="right"
                rtl
                error={errors.name_center?.message}
                {...register("name_center")}
                placeholder=" مركز النور الطبي"
              />

              <FormInput
                label="العنوان"
                icon={Home}
                iconPosition="right"
                rtl
                error={errors.formatted_address?.message}
                {...register("formatted_address")}
                placeholder=" المسقط"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="سنة التأسيس"
                type="number"
                placeholder=" 2015"
                icon={Calendar}
                iconPosition="right"
                rtl
                className="no-spinner"
                error={errors.year_establishment?.message}
                {...register("year_establishment")}
              />
            </div>
            <ProfileImageUpload
              label="صورة المركز"
              value={centerImage ?? null}
              onChange={(file) => setCenterImage(file ?? undefined)}
            />
          </div>
          <FormSubmitButton className="px-6 py-5 mt-4">التالي</FormSubmitButton>
        </form>
      </FormProvider>
    </FormStepCard>
  );
}
