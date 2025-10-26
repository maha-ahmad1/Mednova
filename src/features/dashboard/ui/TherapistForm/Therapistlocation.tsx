// "use client";

// import dynamic from "next/dynamic";
// import { FormStepCard } from "@/shared/ui/forms/components/FormStepCard";
// import { FormSubmitButton } from "@/shared/ui/forms/components/FormSubmitButton";
// import { Controller, FormProvider, useForm } from "react-hook-form";
// import { showErrorToast, showSuccessToast } from "@/lib/toastUtils";

// const MapPicker = dynamic(() => import("./MapPicker").then((mod) => mod.MapPicker), {
//   ssr: false,
// });

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// interface TherapistFormStep4Props {
//   onNext: () => void;
//   onBack: () => void;
//   formData: Record<string, unknown>;
//   updateFormData: (data: Partial<Record<string, unknown>>) => void;
// }

// export function TherapistFormStep4({ onNext, onBack, formData, updateFormData }: TherapistFormStep4Props) {
//   const methods = useForm<{ location: Location | null }>({
//     defaultValues: {
//       location:
//         typeof (formData.latitude as unknown) === "number" && typeof (formData.longitude as unknown) === "number"
//           ? { latitude: formData.latitude as number, longitude: formData.longitude as number }
//           : null,
//     },
//   });

//   const { handleSubmit, control } = methods;

//   const onSubmit = async (data: { location: Location | null }) => {
//     if (!data.location) {
//       showErrorToast("يرجى تحديد موقعك على الخريطة قبل المتابعة");
//       return;
//     }

//     // POST the coordinates to the API
//     try {
//       const resp = await fetch("/api/location/store", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           latitude: data.location.latitude,
//           longitude: data.location.longitude,
//         }),
//       });

//       if (!resp.ok) {
//         const text = await resp.text();
//         throw new Error(text || "خطأ في حفظ الموقع");
//       }

//       const json = await resp.json();

//       // expected shape: { success: true, data: { id, latitude, longitude, ... } }
//       const locationData = json?.data;
//       if (!locationData || !locationData.id) {
//         throw new Error("استجابة غير صالحة من الخادم");
//       }

//       // store returned id and coordinates in the form data
//       updateFormData({
//         location_id: locationData.id,
//         latitude: locationData.latitude,
//         longitude: locationData.longitude,
//       });

//       showSuccessToast("تم حفظ الموقع بنجاح");
//       onNext();
//     } catch (err) {
//       const error = err as Error | { message?: string } | undefined;
//       console.error("Failed to store location:", error);
//       showErrorToast(error?.message || "فشل في حفظ الموقع");
//     }
//   };

//   return (
//     <FormStepCard title="حدد موقعك" description="انقر على الخريطة لتحديد موقعك الحالي">
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <Controller
//             name="location"
//             control={control}
//             render={({ field }) => <MapPicker value={field.value ?? null} onChange={field.onChange} />}
//           />

//           <div className="flex justify-between mt-4">
//             <FormSubmitButton type="button" onClick={onBack}>
//               رجوع
//             </FormSubmitButton>
//             <FormSubmitButton type="submit">التالي</FormSubmitButton>
//           </div>
//         </form>
//       </FormProvider>
//     </FormStepCard>
//   );
// }
