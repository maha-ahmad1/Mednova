"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Briefcase, Building2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { registerUser, RegistrationData } from "@/features/auth/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registrationSchema = z
  .object({
    fullName: z.string().min(1, "الاسم الكامل مطلوب"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().min(1, "رقم الهاتف مطلوب"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    accountType: z.enum(["patient", "specialist", "clinics"]),
    acceptTerms: z.boolean().refine((val) => val === true, "يجب الموافقة على الشروط"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>; //It creates a type called RegistrationFormData that has the same structure and rules as the registrationSchema.


export function RegistrationForm() {
  const [countryCode, setCountryCode] = useState("+968");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register, // connects your form inputs to React Hook Form so it can track their values and validate them
    handleSubmit, //a function that handles form submission (it runs validation first, then calls your submit function if valid).
    watch, // lets you watch specific input values and re-render your component when they change
    formState: { errors, isValid }, // contains information about the form's state, including any validation errors and whether the form is valid
    setValue, //lets you programmatically set a value for a specific input field.
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema), // Using zodResolver to integrate Zod schema validation with react-hook-form
    defaultValues: {
      accountType: "patient",
      phone: "",
      acceptTerms: false,
    },
    mode: "onChange", 
  });

  const mutation = useMutation({
    mutationFn: (data: RegistrationData) => registerUser(data),
    onSuccess: (data) => {
      console.log("تم التسجيل بنجاح:", data);
      // هنا ممكن تعمل redirect أو show toast
    },
    onError: (error: unknown) => {
      console.error("حدث خطأ:", (error as Error).message || "خطأ غير معروف");
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    const { confirmPassword: _confirmPassword, ...submitData } = data;
    const finalData: RegistrationData = {
      ...submitData,
      phone: `${countryCode}${submitData.phone}`,
    };
    mutation.mutate(finalData);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent ">
      <CardHeader className="space-y-2 " dir="rtl">
        <CardTitle className="text-2xl font-bold text-foreground">
          إنشاء حساب جديد
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          قم بإدخال بياناتك للانضمام الى منصة ميدنوفا{" "}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
        <form className="space-y-5 " onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="space-y-2" dir="rtl">
            <Label htmlFor="fullName" className="text-right block ">
              الاسم الكامل
            </Label>
            <Input
              id="fullName"
              placeholder="أدخل اسمك الكامل"
              className={`text-right ${errors.fullName ? "border-red-500" : ""}`}
              dir="rtl"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 text-right">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2" dir="rtl">
            <Label htmlFor="email" className="text-right block">
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              className={`text-right ${errors.email ? "border-red-500" : ""}`}
              dir="rtl"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 text-right">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2" dir="rtl">
            <Label htmlFor="phone" className="text-right block">
              رقم الهاتف
            </Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+968">+968</SelectItem>
                  <SelectItem value="+971">+971</SelectItem>
                  <SelectItem value="+966">+966</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="0000 0000"
                className={`flex-1 text-right ${errors.phone ? "border-red-500" : ""}`}
                dir="rtl"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500 text-right">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2" dir="rtl">
            <Label htmlFor="password" className="text-right block ">
              كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                className={`text-right pr-10 ${errors.password ? "border-red-500" : ""}`}
                dir="rtl"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-2 h-6 w-6 p-0"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 text-right">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2" dir="rtl">
            <Label htmlFor="confirmPassword" className="text-right block ">
              تأكيد كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="تأكيد كلمة المرور"
                className={`text-right pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                dir="rtl"
                {...register("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-2 top-2 h-6 w-6 p-0"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 text-right">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-3" dir="rtl">
            <Label className="text-right block">نوع الحساب</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setValue("accountType", "patient")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  watch("accountType") === "patient"
                    ? "border-[#32A88D] bg-[#F0FDF4] text-[#32A88D]"
                    : "border-border bg-card hover:border-[#32A88D] hover:bg-[#F0FDF4] hover:text-[#32A88D]"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">مريض</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("accountType", "specialist")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  watch("accountType") === "specialist"
                    ? "border-[#32A88D] bg-[#F0FDF4] text-[#32A88D]"
                    : "border-border bg-card hover:border-[#32A88D] hover:bg-[#F0FDF4] hover:text-[#32A88D]"
                }`}
              >
                <Briefcase className="w-6 h-6" />
                <span className="text-xs font-medium">مختص</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("accountType", "clinics")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  watch("accountType") === "clinics"
                    ? "border-[#32A88D] bg-[#F0FDF4] text-[#32A88D]"
                    : "border-border bg-card hover:border-[#32A88D] hover:bg-[#F0FDF4] hover:text-[#32A88D]"
                }`}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-xs font-medium">مركز تأهيلي</span>
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2" dir="rtl">
            <input
              type="checkbox"
              id="terms"
              className={`mt-1 rounded border-border ${errors.acceptTerms ? "border-red-500" : ""}`}
              {...register("acceptTerms")}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              أوافق على{" "}
              <a href="#" className="text-[#32A88D] hover:underline">
                الشروط والأحكام
              </a>{" "}
              و{" "}
              <a href="#" className="text-[#32A88D] hover:underline">
                سياسة الخصوصية
              </a>
            </Label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 text-right">{errors.acceptTerms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#32A88D] hover:bg-[#32A88D]/90 text-primary-foreground font-semibold"
            size="lg"
            disabled={mutation.isPending || !isValid}
          >
            {mutation.isPending ? "جاري الإنشاء..." : "إنشاء حساب"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-[13px]">أو من خلال</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-8">
          <Button
            variant="outline"
            type="button"
            className="w-full h-14  bg-transparent hover:bg-[#F0FDF4]"
          >
            <Image
              src="/images/auth/google-icon.png"
              alt="Google Icon"
              width={25}
              height={25}
              className="mr-2"
            />
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full h-14 bg-transparent hover:bg-[#F0FDF4]"
          >
            <Image
              src="/images/auth/facebook-icon.png"
              alt="facebook Icon"
              width={25}
              height={25}
              className="mr-2"
            />
            Facebook
          </Button>
        </div>
        <div>
          <a href="#" className="text-[#4B5563] text-md cursor-default">
            لديك حساب بالفعل؟
          </a>{" "}
          <a href="#" className="text-[#32A88D] hover:underline">
            تسجيل دخول{" "}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}