// "use client";

// import { useForm, Controller, FormProvider } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { FormInput, FormSelect } from "@/shared/ui/forms";
// import { Mail, User, Phone, Home, Heart } from "lucide-react";
// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
// import { useSession } from "next-auth/react";
// import { usePatient } from "../../hooks/usePatient";
// import Image from "next/image";
// import { Loader2 } from "lucide-react";
// import { AxiosError } from "axios";
// import { handleFormErrors } from "@/lib/handleFormErrors";
// import { showSuccessToast } from "@/lib/toastUtils";

// // ✅ Zod Schema
// const patientSchema = z.object({
//   full_name: z.string().min(1, "الاسم الكامل مطلوب"),
//   email: z.string().email("بريد إلكتروني غير صالح"),
//   emergency_phone: z.string().optional(),
//   phone: z.string().min(1, "رقم الهاتف مطلوب"),
//   gender: z
//     .enum(["male", "female"])
//     .refine((val) => !!val, { message: "يرجى تحديد الجنس" }),
//   address: z.string().min(1, "العنوان مطلوب"),
//   relationship: z.string().optional(),
//   birth_date: z.string().min(1, "التاريخ الميلاد مطلوب"),
// });

// type PatientFormData = z.infer<typeof patientSchema>;



// export function PatientForm() {
//   const { storePatient } = usePatient();
//   const { data: session, status } = useSession();
//   const [isLoading, setIsLoading] = useState(false);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const user = session?.user;
//   console.log(user);

//   const methods = useForm<PatientFormData>({
//     resolver: zodResolver(patientSchema),
//     mode: "onChange",
//     defaultValues: {
//       full_name: "",
//       email: "",
//       phone: "",
//     },
//   });

//   useEffect(() => {
//     if (session?.user) {
//       methods.reset({
//         full_name: session.user.full_name,
//         email: session.user.email,
//         phone: session.user.phone,
//       });
//     }
//   }, [session?.user, methods]);

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <Loader2 className="w-10 h-10 animate-spin text-[#32A88D]" />
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className="flex items-center justify-center h-[60vh] text-gray-600">
//         لم يتم تسجيل الدخول
//       </div>
//     );
//   }

//   console.log(session.user);

//   const {
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = methods;

//   const onSubmit = async (data: PatientFormData) => {
//     try {
//       setIsLoading(true);

//       const payload = {
//         customer_id: session?.user?.id,
//         gender: data.gender === "male" ? "Male" : "Female",
//         birth_date: data.birth_date,
//         image: imageFile,
//         emergency_phone: data.emergency_phone,
//         relationship: data.relationship,
//       };

//       const response = await storePatient(payload);
//       console.log("✅ Patient saved:", response);
//     showSuccessToast("تم حفظ البيانات بنجاح!");
//     } catch (error) {
//       handleFormErrors<PatientFormData>(
//         error as AxiosError<{
//           message?: string;
//           data?: Record<string, string[]>;
//         }>,
//         setError
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="mb-10 mr-60 ">
//         <h1 className="text-2xl font-bold">معلومات المريض الشخصية</h1>

//         <p className="text-sm text-gray-600 leading-relaxed mt-2">
//           يرجى تعبئة البيانات التالية بدقة لتسهيل إجراءات المتابعة الطبية داخل
//           منصة
//           <span className="text-[#32A88D] font-medium"> ميدنوفا</span>.
//         </p>
//       </div>

//       <Card className="max-w-5xl mx-auto shadow-lg border-0">
//         <CardHeader className="space-y-2" dir="rtl">
//           <CardTitle className="text-2xl font-bold text-foreground">
//             إدخال بيانات المريض{" "}
//           </CardTitle>
//           <CardDescription className="text-md">
//             قم بإدخال بياناتك للانضمام الى منصة ميدنوفا
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="px-14 ">
//           <FormProvider {...methods}>
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="space-y-6"
//               dir="rtl"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <FormInput
//                   label="الاسم الكامل"
//                   placeholder="أدخل اسم المريض"
//                   icon={User}
//                   iconPosition="right"
//                   rtl
//                   error={errors.full_name?.message}
//                   {...methods.register("full_name")}
//                   readOnly
//                 />

//                 <FormInput
//                   label="البريد الإلكتروني"
//                   type="email"
//                   placeholder="example@email.com"
//                   icon={Mail}
//                   iconPosition="right"
//                   rtl
//                   error={errors.email?.message}
//                   {...methods.register("email")}
//                   readOnly
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <FormInput
//                   label="رقم الهاتف"
//                   placeholder="0000 0000"
//                   icon={Phone}
//                   iconPosition="right"
//                   rtl
//                   error={errors.phone?.message}
//                   {...methods.register("phone")}
//                   readOnly
//                 />
//                 <FormInput
//                   label="تاريخ الميلاد"
//                   placeholder="9/9/1999"
//                   type="date"
//                   rtl
//                   error={errors.birth_date?.message}
//                   {...methods.register("birth_date")}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <FormInput
//                   label="جهة اتصال للطوارئ "
//                   placeholder="056934524"
//                   icon={Phone}
//                   iconPosition="right"
//                   rtl
//                   error={errors.emergency_phone?.message}
//                   {...methods.register("emergency_phone")}
//                 />

//                 <FormInput
//                   label="صلة القرابة"
//                   placeholder="صديق"
//                   icon={Heart}
//                   iconPosition="right"
//                   rtl
//                   error={errors.relationship?.message}
//                   {...methods.register("relationship")}
//                 />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <Controller
//                   name="gender"
//                   control={methods.control}
//                   render={({ field }) => (
//                     <FormSelect
//                       label="الجنس"
//                       rtl
//                       options={[
//                         { value: "male", label: "ذكر" },
//                         { value: "female", label: "أنثى" },
//                       ]}
//                       value={field.value}
//                       onValueChange={field.onChange}
//                       error={errors.gender?.message}
//                     />
//                   )}
//                 />

//                 <FormInput
//                   label="عنوان السكن"
//                   placeholder="أدخل العنوان"
//                   icon={Home}
//                   iconPosition="right"
//                   rtl
//                   error={errors.address?.message}
//                   {...methods.register("address")}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
//                 <FormInput
//                   label="رفع الصورة الشخصية"
//                   type="file"
//                   accept="image/*"
//                   rtl
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       setImageFile(file);
//                       const reader = new FileReader();
//                       reader.onloadend = () => {
//                         setImagePreview(reader.result as string);
//                       };
//                       reader.readAsDataURL(file);
//                     }
//                   }}
//                 />

//                 {imagePreview && (
//                   <div className="">
//                     <Image
//                       width={100}
//                       height={100}
//                       src={imagePreview}
//                       alt="معاينة الصورة"
//                       className="w-24 h-24 rounded-full object-cover border"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setImageFile(null);
//                         setImagePreview(null);
//                       }}
//                       className="text-sm text-red-500 hover:underline"
//                     >
//                       إزالة الصورة
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <FormSubmitButton
//                 className="py-5 px-6   "
//                 size="sm"
//                 variant="default"
//               >
//                 حفظ البيانات
//               </FormSubmitButton>
//             </form>
//           </FormProvider>
//         </CardContent>
//       </Card>
//     </>
//   );
// }

export * from "./PatientFormStep1"
export * from "./PatientFormStep2"
export * from "./PatientWrapper"
export * from "./PatientSuccess"


