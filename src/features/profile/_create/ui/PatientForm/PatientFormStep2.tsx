"use client";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormInput, FormSelect, ProfileImageUpload } from "@/shared/ui/forms";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
import { useSession } from "next-auth/react";
import { usePatient } from "../../hooks/usePatientStore";
import type { PatientFormValues } from "@/types/patient";
import { WifiOff, RefreshCw, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccessToast } from "@/lib/toastUtils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { countries } from "@/constants/countries";
import { patientFormSchema } from "@/features/profile/_create/validation/formSchemas";

const patientStep2Schema = patientFormSchema.pick({
  gender: true,
  formatted_address: true,
  country: true,
  city: true,
  image: true,
});

export type PatientFormData = Partial<z.infer<typeof patientFormSchema>>;

type PatientStep2FormData = z.infer<typeof patientStep2Schema>;

interface PatientFormStep2Props {
  onNext: () => void;
  onBack: () => void;
  formData: PatientFormData;
  updateFormData: (data: PatientFormData) => void;
  handleGlobalErrors: Record<string, string>;
  setGlobalErrors?: (errors: Record<string, string>) => void;
}

export function PatientFormStep2({
  onNext,
  onBack,
  formData,
  updateFormData,
  setGlobalErrors,
}: PatientFormStep2Props) {
  const { storePatient } = usePatient({
    onValidationError: (errors: Record<string, string>) => {
      setGlobalErrors?.(errors);
    },
  });
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>(
    formData?.image instanceof File ? formData.image : undefined
  );
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();
  const [countryCode] = useState(formData.countryCode || "+968");

  const methods = useForm<PatientStep2FormData>({
    resolver: zodResolver(patientStep2Schema),
    mode: "onChange",
    defaultValues: {
      gender: formData.gender || undefined,
      formatted_address: formData.formatted_address || "",
      country: formData.country || "",
      city: formData.city || "",
      image: formData.image instanceof File ? formData.image : undefined,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;
  const country = methods.watch("country");

  useEffect(() => {
    setValue("image", imageFile ?? undefined, { shouldValidate: true });
  }, [imageFile, setValue]);

  useEffect(() => {
    if (status === "unauthenticated" && !navigator.onLine) {
      setNetworkError(true);
      toast.error("لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك بالشبكة.");
    } else if (status === "unauthenticated") {
      toast.error("لا يمكن الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل.");
    } else {
      setNetworkError(false);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
      </div>
    );
  }

  if (networkError || (!session && status === "unauthenticated")) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <WifiOff className="h-12 w-12 text-destructive" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">مشكلة في الاتصال</h3>
                <p className="text-sm text-muted-foreground">
                  تأكد من:
                  <br />• اتصالك بالإنترنت
                  <br />• تشغيل الخادم (Backend Server)
                  <br />• صحة عنوان الـ API
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  رجوع
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-[#32A88D] hover:bg-[#2a9178]"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">غير مسجل دخول</h3>
                <p className="text-sm text-muted-foreground">
                  يرجى تسجيل الدخول للمتابعة
                </p>
              </div>
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-[#32A88D] hover:bg-[#2a9178]"
              >
                تسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: PatientStep2FormData) => {
    if (!session?.user?.id) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    if (!navigator.onLine) {
      toast.error("لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك.");
      return;
    }

    try {
      setIsLoading(true);

      const emergencyPhoneWithCode = formData.emergency_phone
        ? `${countryCode}${formData.emergency_phone}`
        : "";

      const payload: PatientFormValues = {
        customer_id: session.user.id,
        gender: data.gender === "male" ? "Male" : "Female",
        birth_date: formData.birth_date,
        image: imageFile,
        emergency_phone: emergencyPhoneWithCode,
        relationship: formData.relationship,
        formatted_address: data.formatted_address,
        country: data.country,
        city: data.city,
      };
      await storePatient(payload);
      setGlobalErrors?.({});
      updateFormData({
        ...formData,
        gender: data.gender,
        formatted_address: data.formatted_address,
        image: imageFile,
        country: data.country,
        city: data.city,
      });

      // await signIn("credentials", {
      //   redirect: false,
      //   email: session?.user?.email || "",
      // });

      //   await update({
      //     user: {
      //       ...session.user,
      //       // isCompleted: true,
      //     },
      //   })
      await update({
        user: {
          ...session.user,
          is_completed: true,
          status: session.user.status,
        },
      });
              console.log("status .sss"+status)

      showSuccessToast("تم حفظ البيانات بنجاح!");

      router.replace("/profile");
      onNext();
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const currentData = methods.getValues();
    updateFormData({
      gender: currentData.gender,
      formatted_address: currentData.formatted_address,
      image: imageFile,
      country: currentData.country,
      city: currentData.city,
    });
    onBack();
  };

  return (
    <Card className="max-w-5xl mx-auto shadow-lg border-0">
      <CardHeader className="space-y-2" dir="rtl">
        <CardTitle className="text-2xl font-bold text-foreground">
          إدخال بيانات المريض
        </CardTitle>
        <CardDescription className="text-md">
          قم بإدخال بياناتك للانضمام الى منصة ميدنوفا
        </CardDescription>
      </CardHeader>

      <CardContent className="px-14">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            dir="rtl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Controller
                name="gender"
                control={methods.control}
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
                label="عنوان السكن"
                placeholder="أدخل العنوان"
                icon={Home}
                iconPosition="right"
                rtl
                error={errors.formatted_address?.message}
                {...methods.register("formatted_address")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="country"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <FormSelect
                    label="الدولة"
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("city", "");
                    }}
                    options={countries.map((c) => ({
                      value: c.name,
                      label: c.name,
                    }))}
                    error={fieldState.error?.message}
                    rtl
                  />
                )}
              />

              <Controller
                name="city"
                control={methods.control}
                render={({ field, fieldState }) => {
                  const selectedCountry = countries.find(
                    (c) => c.name === country
                  );
                  return (
                    <FormSelect
                      label="المدينة"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={
                        selectedCountry?.cities.map((city) => ({
                          value: city,
                          label: city,
                        })) || []
                      }
                      error={fieldState.error?.message}
                      rtl
                    />
                  );
                }}
              />
            </div>

            <ProfileImageUpload
              label="رفع الصورة الشخصية"
              value={imageFile ?? null}
              onChange={(file) => setImageFile(file ?? undefined)}
            />
            {errors.image?.message && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}

            <div className="flex justify-between mt-4">
              <FormSubmitButton
                align="left"
                type="button"
                onClick={handleBack}
                className="px-6 py-5 bg-[#32A88D]/20 text-[#32A88D] hover:bg-[#32A88D] hover:text-white"
                disabled={isLoading}
              >
                رجوع
              </FormSubmitButton>

              <FormSubmitButton
                size="sm"
                variant="default"
                className="px-6 py-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ البيانات"
                )}
              </FormSubmitButton>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
