"use client";
import { FormInput, FormSelect } from "@/shared/ui/forms";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, User, Phone, Home } from "lucide-react";
import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
const step1Schema = z.object({
  full_name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد غير صالح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  gender: z.enum(["male", "female"]),
  address: z.string().min(1, "العنوان مطلوب"),
  birth_date: z.string().min(1, "تاريخ الميلاد مطلوب"),
});

type Step1Data = z.infer<typeof step1Schema>;

export function TherapistFormStep1({ onNext }: { onNext: () => void }) {
  const methods = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data: Step1Data) => {
    console.log("Step 1 data:", data);
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
              />
              <FormInput
                label="رقم الهاتف"
                placeholder="05938934"
                icon={Phone}
                iconPosition="right"
                rtl
                error={errors.phone?.message}
                {...register("phone")}
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
                error={errors.address?.message}
                {...register("address")}
              />
              <FormInput
                label="تاريخ الميلاد"
                placeholder="9/9/1999"
                type="date"
                rtl
                error={errors.birth_date?.message}
                {...register("birth_date")}
              />
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
