"use client";
import { FormInput, FormSelect } from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Phone, Home, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const step1Schema = z.object({
  full_name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  gender: z.enum(["male", "female"]),
  formatted_address: z.string().min(1, "العنوان مطلوب"),
  birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
  image: z.instanceof(File, { message: "يرجى رفع صورة شخصية" }),
});

type Step1Data = z.infer<typeof step1Schema>;

interface TherapistStep1Props {
  onNext: () => void;
  formData: Partial<Step1Data>;
  updateFormData: (data: Partial<Step1Data>) => void;
  globalErrors?: Record<string, string>;
}

export function TherapistFormStep1({
  onNext,
  formData,
  updateFormData,
  globalErrors,
}: TherapistStep1Props) {
  const { data: session, status } = useSession();

  const methods = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      full_name: formData.full_name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      gender: formData.gender || undefined,
      formatted_address: formData.formatted_address || "",
      birth_date: formData.birth_date || "",
      image: formData.image instanceof File ? formData.image : undefined,
    } as Partial<Step1Data>,
  });

  const [profileImage, setProfileImage] = useState<File | null>(
    formData.image && typeof formData.image !== "string" ? formData.image : null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.image && typeof formData.image === "string" ? formData.image : null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      methods.setValue("image", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    methods.resetField("image");
    setImagePreview(null);
  };

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (session?.user && !formData.full_name) {
      methods.reset({
        full_name: session.user.full_name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      });
    }
  }, [session?.user, methods, formData]);
  const { setError } = methods;

  useEffect(() => {
    if (globalErrors) {
      Object.entries(globalErrors).forEach(([field, message]) => {
        setError(field as keyof Step1Data, { type: "server", message });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalErrors]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
      </div>
    );
  }

  const onSubmit = (data: Step1Data) => {
    updateFormData(data);
    onNext();
  };

  return (
    <>
      <FormStepCard
        title="انضم كمختص إلى ميدنوفا"
        description="سجّل كمختص في منصة ميدنوفا لبدء تقديم الاستشارات الطبية والمساهمة في تحسين الرعاية الصحية."
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            dir="rtl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="الاسم الكامل"
                placeholder="احمد عبدالله "
                icon={User}
                iconPosition="right"
                rtl
                error={errors.full_name?.message}
                {...register("full_name")}
                readOnly
              />
              <FormInput
                label="البريد الإلكتروني"
                placeholder="Ahmad.@email.com"
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
                placeholder="05938934"
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

              <FormInput
                label="العنوان"
                placeholder="المسقط"
                icon={Home}
                iconPosition="right"
                rtl
                error={errors.formatted_address?.message}
                {...register("formatted_address")}
              />
              <FormInput
                label="تاريخ الميلاد"
                placeholder="YYYY-MM-DD"
                type="date"
                rtl
                error={errors.birth_date?.message}
                {...register("birth_date")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="الصورة الشخصية"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div className="relative w-32 h-32">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={removeImage}
                  >
                    إزالة
                  </Button>
                </div>
              )}
            </div>
            <FormSubmitButton className="px-6 py-5 mt-4">
              التالي
            </FormSubmitButton>
          </form>
        </FormProvider>
      </FormStepCard>
    </>
  );
}
