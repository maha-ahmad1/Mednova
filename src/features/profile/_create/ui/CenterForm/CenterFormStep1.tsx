"use client";

import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Phone, Home, Loader2, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  FormInput,
  FormPhoneInput,
  FormSelect,
  ProfileImageUpload,
} from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { useStepFormAutosave } from "@/features/profile/_create/hooks/useStepFormAutosave";
import { parsePhoneNumber } from "@/lib/phone";

const step1Schema = z.object({
  full_name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  gender: z.enum(["male", "female"]),
  formatted_address: z.string().min(1, "العنوان مطلوب"),
  year_establishment: z.string().min(4, "سنة التأسيس مطلوبة"),
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: "يرجى رفع صورة المركز",
    })
    .refine((file) => file, {
      message: "يرجى رفع صورة المركز",
    }),
  name_center: z.string().min(1, "اسم المركز مطلوب"),
  birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
});

type Step1Data = z.infer<typeof step1Schema>;

interface CenterStep1Props {
  onNext: () => void;
  formData: Partial<Step1Data>;
  updateFormData: (data: Partial<Step1Data>) => void;
  globalErrors?: Record<string, string>;
}

export function CenterFormStep1({
  onNext,
  formData,
  updateFormData,
  globalErrors,
}: CenterStep1Props) {
  const { data: session, status } = useSession();
  const initialPhone = parsePhoneNumber(formData.phone);
  const [phoneCountryCode, setPhoneCountryCode] = useState(
    initialPhone.countryCode,
  );

  const methods = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      name_center: formData.name_center || "",
      full_name: formData.full_name || "",
      email: formData.email || "",
      phone: initialPhone.localNumber,
      gender: formData.gender || undefined,
      formatted_address: formData.formatted_address || "",
      year_establishment: formData.year_establishment || "",
      image: formData?.image instanceof File ? formData.image : undefined,
      birth_date: formData.birth_date || "",
    } as Partial<Step1Data>,
  });

  const [centerImage, setCenterImage] = useState<File | null>(
    formData?.image instanceof File ? formData.image : null,
  );

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
  } = methods;

  const persistDraft = useCallback((values: Partial<Step1Data>) => {
    updateFormData(values);
  }, [updateFormData]);

  useStepFormAutosave(methods, persistDraft);

  // useEffect(() => {
  //   if (centerImage) {
  //     methods.setValue("image", centerImage, {
  //       shouldValidate: true,
  //       shouldDirty: true,
  //     });
  //   } else {
  //     methods.setValue("image", undefined, {
  //       shouldValidate: true,
  //       shouldDirty: true,
  //     });
  //   }
  // }, [centerImage, methods]);

   useEffect(() => {
  if (centerImage) {
    methods.setValue("image", centerImage, { shouldValidate: true });
  } else {
    // عند إزالة الصورة، اضبط القيمة على null وافرض التحقق
    methods.setValue("image", null);
  }
}, [centerImage, methods]);

  useEffect(() => {
    if (session?.user && !formData.full_name) {
      const parsedSessionPhone = parsePhoneNumber(session.user.phone);
      setPhoneCountryCode(parsedSessionPhone.countryCode);
      methods.reset({
        full_name: session.user.full_name || "",
        email: session.user.email || "",
        phone: parsedSessionPhone.localNumber,
        gender: formData.gender || undefined,
        formatted_address: formData.formatted_address || "",
        year_establishment: formData.year_establishment || "",
        birth_date: formData.birth_date || "",
        image: formData?.image instanceof File ? formData.image : undefined,
        name_center: formData.name_center || "",
      });
    }
  }, [session?.user, methods, formData]);

  useEffect(() => {
    if (globalErrors) {
      Object.entries(globalErrors).forEach(([field, message]) => {
        setError(field as keyof Step1Data, {
          type: "server",
          message,
        });
      });
    }
  }, [globalErrors, setError]);

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

            {/* <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <FormPhoneInput
                  {...field}
                  label="رقم الهاتف"
                  icon={Phone}
                  iconPosition="right"
                  rtl
                  countryCodeValue={phoneCountryCode}
                  onCountryCodeChange={setPhoneCountryCode}
                  error={errors.phone?.message}
                  className="no-spinner"
                  readOnly
                />
              )}
            /> */}
            <FormInput
              label="رقم الهاتف"
              placeholder="0000 0000"
              icon={Phone}
              iconPosition="right"
              rtl
              error={errors.phone?.message}
              {...methods.register("phone")}
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
              value={centerImage}
              onChange={setCenterImage}
              error={errors.image?.message as string | undefined}
            />
          </div>
          <FormSubmitButton className="px-6 py-5 mt-4">التالي</FormSubmitButton>
        </form>
      </FormProvider>
    </FormStepCard>
  );
}
