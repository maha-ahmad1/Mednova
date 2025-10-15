// "use client"

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useMutation } from "@tanstack/react-query"
// import { useRouter } from "next/navigation"
// import * as z from "zod"

// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { FormPasswordInput, FormSubmitButton } from "@/shared/ui/forms"
// import { resetPassword } from "@/features/auth/api/authApi"

// const resetPasswordSchema = z.object({
//   email: z.string().email("بريد إلكتروني غير صالح"),
//   token: z.string().min(4, "الرمز يجب أن يكون 4 أرقام على الأقل"),
//   password: z
//     .string()
//     .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/, "يجب أن تحتوي على حرف كبير وحرف صغير ورمز"),
//   password_confirmation: z.string(),
// }).refine((data) => data.password === data.password_confirmation, {
//   message: "كلمة المرور غير متطابقة",
//   path: ["password_confirmation"],
// })

// type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// export function ResetPasswordForm() {
//   const router = useRouter()
//   const [serverError, setServerError] = useState<string | null>(null)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm<ResetPasswordFormData>({
//     resolver: zodResolver(resetPasswordSchema),
//     mode: "onChange",
//   })

//   const mutation = useMutation({
//     mutationFn: (data: ResetPasswordFormData) =>
//       resetPassword({
//         email: data.email,
//         token: data.token,
//         password: data.password,
//         password_confirmation: data.password_confirmation,
//         verification_method: "email",
//       }),
//     onSuccess: (data) => {
//       if (data.success) {
//         router.push("/auth/login")
//       } else {
//         setServerError(data.message || "حدث خطأ أثناء إعادة التعيين")
//       }
//     },
//     onError: () => setServerError("حدث خطأ في الاتصال بالخادم"),
//   })

//   const onSubmit = (data: ResetPasswordFormData) => {
//     setServerError(null)
//     mutation.mutate(data)
//   }

//   return (
//     <Card className="w-full h-full flex flex-col justify-center border-0 shadow-none bg-transparent">
//       <CardHeader dir="rtl" className="space-y-2">
//         <CardTitle className="text-2xl font-bold text-foreground">
//           إعادة تعيين كلمة المرور
//         </CardTitle>
//         <CardDescription className="text-muted-foreground">
//           أدخل الرمز وكلمة المرور الجديدة لتعيينها
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-6 flex-1 flex flex-col justify-center mt-[-30px]">
//         <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} dir="rtl">
//           {serverError && (
//             <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded text-right text-sm">
//               {serverError}
//             </div>
//           )}

//           <input
//             type="email"
//             placeholder="example@email.com"
//             className="w-full border border-border rounded-md p-2 text-right"
//             {...register("email")}
//           />
//           {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

//           <input
//             type="text"
//             placeholder="أدخل الرمز المرسل"
//             className="w-full border border-border rounded-md p-2 text-right"
//             {...register("token")}
//           />
//           {errors.token && <p className="text-red-600 text-sm">{errors.token.message}</p>}

//           <FormPasswordInput
//             label="كلمة المرور الجديدة"
//             placeholder="أدخل كلمة المرور الجديدة"
//             rtl
//             error={errors.password?.message}
//             {...register("password")}
//           />

//           <FormPasswordInput
//             label="تأكيد كلمة المرور"
//             placeholder="أعد إدخال كلمة المرور"
//             rtl
//             error={errors.password_confirmation?.message}
//             {...register("password_confirmation")}
//           />

//           <FormSubmitButton
//             isLoading={mutation.isPending}
//             loadingText="جارٍ إعادة التعيين..."
//             disabled={!isValid}
//           >
//             إعادة التعيين
//           </FormSubmitButton>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }
