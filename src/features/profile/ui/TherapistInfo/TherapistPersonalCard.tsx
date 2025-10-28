// "use client";

// import React, { useState } from "react";
// import { User, Mail, Phone, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { FormInput, FormSelect, FormFileUpload } from "@/shared/ui/forms";
// import { FormPhoneInput } from "@/shared/ui/forms";
// import { personalSchema } from "@/features/profile/schemas/personalSchema";
// import 


// export function TherapistPersonalCard({
//   details,
//   isUpdating,
//   serverErrors = {},
//   onSave,
// }: {
//   details: any;
//   isUpdating: boolean;
//   serverErrors?: Record<string, string>;
//   onSave: (values: any) => void;
// }) {
//   const [editing, setEditing] = useState(false);
//   const [formValues, setFormValues] = useState<any>({
//     full_name: details?.full_name ?? "",
//     email: details?.email ?? "",
//     phone: details?.phone ?? "",
//     birth_date: details?.birth_date ?? "",
//     gender: details?.gender ?? "",
//     image: null,
//   });
//   const [countryCode, setCountryCode] = useState("+970");

//   const handleCancel = () => {
//     setFormValues({
//       full_name: details?.full_name ?? "",
//       email: details?.email ?? "",
//       phone: details?.phone ?? "",
//       birth_date: details?.birth_date ?? "",
//       gender: details?.gender ?? "",
//       image: null,
//     });
//     setEditing(false);
//   };

//   const handleSave = () => {
//     onSave(formValues);
//     setEditing(false);
//   };

//   return (
//     <Card title="المعلومات الشخصية">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
//         <div className="flex flex-col lg:flex-row lg:items-start gap-6">
//           {/* الصورة */}
//           <div className="flex flex-col items-center lg:items-start gap-2">
//             <div
//               className={`w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 ${
//                 editing ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
//               }`}
//             >
//               {editing && formValues.image instanceof File ? (
//                 <img
//                   src={URL.createObjectURL(formValues.image)}
//                   alt="Preview"
//                   className="w-full h-full object-cover"
//                 />
//               ) : details?.image ? (
//                 <img
//                   src={details.image}
//                   alt={details.full_name ?? "Avatar"}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
//                   <User className="w-8 h-8" />
//                 </div>
//               )}
//             </div>

//             {editing ? (
//               <FormFileUpload
//                 label="تغيير الصورة"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     setFormValues((s: any) => ({ ...s, image: file }));
//                   }
//                 }}
//                 className="text-xs text-center"
//               />
//             ) : null}

//             {details?.image && !editing && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => window.open(details.image, "_blank")}
//               >
//                 عرض الصورة
//               </Button>
//             )}
//           </div>

//           {/* باقي التفاصيل */}
//           <div className="flex-1">
//             <div
//               className={`flex justify-end mb-4 p-2 rounded-md ${
//                 editing ? "bg-green-50 border border-green-200" : ""
//               }`}
//             >
//               {editing ? (
//                 <div className="flex gap-2">
//                   <Button
//                     onClick={handleSave}
//                     disabled={isUpdating}
//                     size="sm"
//                     className="bg-green-500 hover:bg-green-600"
//                   >
//                     {isUpdating ? (
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     ) : null}
//                     حفظ
//                   </Button>
//                   <Button onClick={handleCancel} variant="outline" size="sm">
//                     إلغاء
//                   </Button>
//                 </div>
//               ) : (
//                 <Button onClick={() => setEditing(true)} variant="outline" size="sm">
//                   تعديل
//                 </Button>
//               )}
//             </div>

//             {/* وضع العرض */}
//             {!editing ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
//                 <Field label="الاسم الكامل" value={details?.full_name ?? "-"} />
//                 <Field label="البريد الإلكتروني" value={details?.email ?? "-"} />
//                 <Field label="الهاتف" value={details?.phone ?? "-"} />
//                 <Field
//                   label="تاريخ الميلاد"
//                   value={formatDateForDisplay(details?.birth_date) ?? "-"}
//                 />
//                 <Field
//                   label="الجنس"
//                   value={
//                     details?.gender ? (
//                       <Badge variant={details.gender === "male" ? "secondary" : "default"}>
//                         {details.gender === "male" ? "ذكر" : "أنثى"}
//                       </Badge>
//                     ) : (
//                       "-"
//                     )
//                   }
//                 />
//                 <Field label="نوع الحساب" value={details?.type_account ?? "-"} />
//               </div>
//             ) : (
//               // وضع التعديل
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2 bg-gray-50 p-4 rounded-md">
//                 <FormInput
//                   label="الاسم الكامل"
//                   icon={User}
//                   value={String(formValues.full_name ?? "")}
//                   onChange={(e) =>
//                     setFormValues((s: any) => ({
//                       ...s,
//                       full_name: e.target.value,
//                     }))
//                   }
//                   rtl
//                   error={
//                     serverErrors.full_name ??
//                     personalSchema.shape.full_name.safeParse(
//                       formValues.full_name ?? ""
//                     ).error?.issues[0]?.message
//                   }
//                 />

//                 <FormInput
//                   label="البريد الإلكتروني"
//                   type="email"
//                   icon={Mail}
//                   value={String(formValues.email ?? "")}
//                   onChange={(e) =>
//                     setFormValues((s: any) => ({ ...s, email: e.target.value }))
//                   }
//                   rtl
//                 />

//                 <FormPhoneInput
//                   label="الهاتف"
//                   placeholder="0000 0000"
//                   icon={Phone}
//                   iconPosition="right"
//                   rtl
//                   countryCodeValue={countryCode}
//                   onCountryCodeChange={(c) => setCountryCode(c)}
//                   value={String(formValues.phone ?? "")}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                     setFormValues((s: any) => ({ ...s, phone: e.target.value }))
//                   }
//                 />

//                 <FormInput
//                   label="تاريخ الميلاد"
//                   type="date"
//                   value={String(formValues.birth_date ?? "")}
//                   onChange={(e) =>
//                     setFormValues((s: any) => ({
//                       ...s,
//                       birth_date: e.target.value,
//                     }))
//                   }
//                   rtl
//                 />

//                 <FormSelect
//                   label="الجنس"
//                   options={[
//                     { value: "male", label: "ذكر" },
//                     { value: "female", label: "أنثى" },
//                   ]}
//                   value={String(formValues.gender ?? "")}
//                   onValueChange={(val) =>
//                     setFormValues((s: any) => ({ ...s, gender: val }))
//                   }
//                   rtl
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }
