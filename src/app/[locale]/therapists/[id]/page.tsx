// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Star,
//   MapPin,
//   ArrowRight,
//   Award,
//   Clock,
//   Calendar,
//   Users,
//   Phone,
//   HomeIcon,
//   ArrowLeft,
//   CheckCircle,
//   MessageSquare,
//   Edit,
//   BookOpen,
//   University,
// } from "lucide-react";
// import Image from "next/image";
// import { ConsultationDialog } from "@/features/service-provider/ui/ConsultationDialog";
// import { useFetcher } from "@/hooks/useFetcher";
// // import { ReviewDialog } from "@/components/ReviewDialog";
// // import {LandingNavar} from "@/shared/ui/layout/LandingNavbar";
// import LandingNavbar from "@/shared/ui/layout/LandingNavbar";
// import Link from "next/link";
// // أنواع البيانات
// interface ServiceProvider {
//   id: number;
//   full_name: string;
//   email: string;
//   phone: string;
//   image: string;
//   bio: string;
//   experience_years: number;
//   average_rating: number;
//   total_reviews: number;
//   therapist_details: {
//     bio: string;
//     experience_years: number;
//     university_name: string;
//     graduation_year: string;
//     countries_certified: string;
//     medical_specialties: {
//       id: number;
//       name: string;
//       description: string;
//     };
//   };
//   location_details?: {
//     country: string;
//     city: string;
//     formatted_address: string;
//   };
//   schedules?: Array<{
//     id: number;
//     day_of_week: string[];
//     start_time_morning: string;
//     end_time_morning: string;
//     is_have_evening_time: boolean;
//     start_time_evening: string;
//     end_time_evening: string;
//     type_time: string;
//   }>;
//   services?: Array<{
//     id: number;
//     name: string;
//     description: string;
//     price: number;
//     duration: string;
//   }>;
//   specialties?: Array<{
//     id: number;
//     name: string;
//   }>;
//   type_account?: string;
// }

// // دالة لتحويل أيام الأسبوع من الإنجليزية إلى العربية
// const translateDay = (day: string): string => {
//   const daysMap: { [key: string]: string } = {
//     Saturday: "السبت",
//     Sunday: "الأحد",
//     Monday: "الاثنين",
//     Tuesday: "الثلاثاء",
//     Wednesday: "الأربعاء",
//     Thursday: "الخميس",
//     Friday: "الجمعة",
//   };
//   return daysMap[day] || day;
// };

// // دالة لتنسيق الوقت من 24 ساعة إلى 12 ساعة مع AM/PM
// const formatTime = (time24: string): string => {
//   if (!time24) return "غير محدد";

//   const [hours, minutes] = time24.split(":");
//   const hour = parseInt(hours);
//   const ampm = hour >= 12 ? "م" : "ص";
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:${minutes} ${ampm}`;
// };

// export default function SpecialistProfile() {
//   const params = useParams();
//   const router = useRouter();
//   const [showReviewDialog, setShowReviewDialog] = useState(false);

//   // استخدام useFetcher لجلب البيانات
//   const {
//     data: therapist,
//     isLoading,
//     error,
//   } = useFetcher<ServiceProvider | null>(
//     ["providerProfile", params.id],
//     params.id ? `/api/customer/${params.id}` : null
//   );

//   // معالجة حالة التحميل
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="mb-8"
//           >
//             <ArrowLeft className="w-4 h-4 ml-2" />
//             العودة
//           </Button>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <Skeleton className="h-96 w-full rounded-2xl mb-6" />
//               <Skeleton className="h-8 w-1/2 mb-4" />
//               <Skeleton className="h-4 w-full mb-2" />
//               <Skeleton className="h-4 w-3/4 mb-6" />
//             </div>
//             <div>
//               <Skeleton className="h-80 w-full rounded-2xl" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // معالجة حالة الخطأ
//   if (error || !therapist) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Award className="w-10 h-10 text-red-500" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">حدث خطأ</h3>
//           <p className="text-gray-600 mb-4">
//             {error?.message || "لم يتم العثور على المختص"}
//           </p>
//           <Button onClick={() => router.back()}>العودة للخلف</Button>
//         </div>
//       </div>
//     );
//   }

//   // دالة لعرض النجوم
//   const renderStars = (rating: number) => {
//     return [...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         className={`w-5 h-5 ${
//           i < Math.floor(rating)
//             ? "fill-yellow-400 text-yellow-400"
//             : "fill-gray-200 text-gray-200"
//         }`}
//       />
//     ));
//   };

//   // الحصول على الجدول الزمني الأول (يفترض أن هناك جدول واحد)
//   const schedule = therapist?.schedules?.[0];

//   return (
//     <>
    
//           <LandingNavbar />
//     <section className="bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 py-6 px-5 md:px-16 lg:px-28">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-center gap-2 text-sm text-gray-600 py-6">
//             <Link
//               href="/"
//               className="flex items-center gap-2 hover:text-[#32A88D] transition-colors"
//             >
//               <HomeIcon className="w-4 h-4" />
//               الرئيسية
//             </Link>
//             <ArrowRight className="w-4 h-4 rotate-180" />
//             <span className="text-[#32A88D] font-medium">
// الملف الشخصي            </span>
//           </div>
//         </div>
//       </section>
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* زر العودة */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="mb-8 hover:bg-gray-100 rounded-xl"
//         >
//           <ArrowLeft className="w-4 h-4 ml-2" />
//           العودة للخلف
//         </Button> */}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* المحتوى الرئيسي */}
//           <div className="lg:col-span-2">
//             {/* البطاقة الرئيسية */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
//               {/* Header Section */}
//               <div className="p-6 border-b border-gray-100">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start gap-6">
//                     {/* Profile Image */}
//                     <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-gray-100">
//                       <Image
//                         src={therapist.image || "/images/home/therapist.jpg"}
//                         alt={therapist.full_name}
//                         fill
//                         className="object-cover"
//                         sizes="(max-width: 128px) 100vw, 128px"
//                       />
//                     </div>

//                     {/* Profile Info */}
//                     <div>
//                       <div className="flex items-center gap-3 mb-2">
//                         <h1 className="xl:text-3xl text-lg font-bold text-gray-800">
//                           {therapist.full_name}
//                         </h1>
//                       </div>

//                       {/* Rating */}
//                       <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
//                         <div className="flex items-center">
//                           {renderStars(therapist.average_rating || 0)}
//                         </div>
//                         <span className="text-gray-600">
//                           ({therapist.total_reviews || 0} تقييم)
//                         </span>
//                       </div>

//                       {/* Specialties */}
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {therapist.specialties?.map((specialty) => (
//                           <Badge
//                             key={specialty.id}
//                             variant="outline"
//                             className="bg-gray-50 border-gray-200 px-3 py-1"
//                           >
//                             {specialty.name}
//                           </Badge>
//                         )) || (
//                           <Badge className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1">
//                             {therapist.therapist_details?.medical_specialties
//                               ?.name || "غير محدد"}
//                           </Badge>
//                         )}
//                       </div>

//                       {/* Stats */}
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <MapPin className="w-4 h-4" />
//                           <span>
//                             {therapist.location_details?.city ||
//                               therapist.location_details?.country ||
//                               "غير محدد"}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <University className="w-4 h-4" />
//                           <span>
//                             {therapist.therapist_details?.university_name ||
//                               "غير محدد"}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4" />
//                           <span>
//                             {therapist.therapist_details?.experience_years || 0}{" "}
//                             سنوات خبرة
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Details Section */}
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   {/* Left Column */}
//                   <div className="space-y-6">
//                     {/* Specialties */}
//                     <div className="flex items-start gap-3">
//                       <h3 className="text-gray-500 text-sm mb-2">التخصصات:</h3>
//                       <div className="flex flex-wrap gap-2">
//                         {therapist.specialties?.map((specialty) => (
//                           <Badge
//                             key={specialty.id}
//                             className="bg-gray-100 text-gray-700 hover:bg-gray-100 px-3 py-1"
//                           >
//                             {specialty.name}
//                           </Badge>
//                         )) || (
//                           <Badge className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1">
//                             {therapist.therapist_details?.medical_specialties
//                               ?.name || "غير محدد"}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>

//                     {/* University */}
//                     <div className="flex items-start gap-3">
//                       <h3 className="text-gray-500 text-sm mb-2">الجامعة:</h3>
//                       <p className="text-gray-800">
//                         {therapist.therapist_details?.university_name ||
//                           "غير محدد"}
//                       </p>
//                     </div>

//                     {/* Graduation Year */}
//                     <div className="flex items-start gap-3">
//                       <h3 className="text-gray-500 text-sm mb-2">
//                         سنة التخرج:
//                       </h3>
//                       <p className="text-gray-800">
//                         {therapist.therapist_details?.graduation_year ||
//                           "غير محدد"}
//                       </p>
//                     </div>

//                     {/* Experience */}
//                     <div className="flex items-start gap-3">
//                       <h3 className="text-gray-500 text-sm mb-2">
//                         سنوات الخبرة:
//                       </h3>
//                       <p className="text-gray-800">
//                         {therapist.therapist_details?.experience_years || 0}{" "}
//                         سنوات
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right Column - Pricing */}
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-gray-500 text-sm mb-4">
//                         أسعار الجلسات:
//                       </h3>
//                       <div className="space-y-4">
//                         {therapist.services && therapist.services.length > 0 ? (
//                           therapist.services.map((service) => (
//                             <div
//                               key={service.id}
//                               className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
//                             >
//                               <div>
//                                 <div className="font-semibold text-gray-800">
//                                   {service.name}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   {service.description}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-2xl font-bold text-[#32A88D]">
//                                   ${service.price}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   {service.duration}
//                                 </div>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <>
//                             {/* الخدمات الافتراضية */}
//                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                               <div>
//                                 <div className="font-semibold text-gray-800">
//                                   جلسة 30 دقيقة
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   استشارة سريعة
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-2xl font-bold text-[#32A88D]">
//                                   $30
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   شامل الضريبة
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//                               <div>
//                                 <div className="font-semibold text-gray-800">
//                                   جلسة 60 دقيقة
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   استشارة متكاملة
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-2xl font-bold text-[#32A88D]">
//                                   $50
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   شامل الضريبة
//                                 </div>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* VAT Notice */}
//                     <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
//                       <p className="text-sm text-blue-700 text-center">
//                         جميع الأسعار تشمل ضريبة القيمة المضافة ورسوم الخدمة
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* التبويبات */}
//             <Tabs
//               defaultValue="bio"
//               className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
//             >
//               <TabsList className="grid w-full grid-cols-2 mb-8">
//                 <TabsTrigger
//                   value="reviews"
//                   className="text-lg flex items-center gap-2"
//                 >
//                   <Star className="w-5 h-5" />
//                   التقييمات
//                 </TabsTrigger>

//                 <TabsTrigger
//                   value="bio"
//                   className="text-lg flex items-center gap-2"
//                 >
//                   <BookOpen className="w-5 h-5" />
//                   السيرة الذاتية
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="bio" className="mt-0 text-right">
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
//                       نبذة عن المختص
//                     </h3>
//                     <p className="text-gray-600 leading-relaxed text-lg">
//                       {therapist.therapist_details?.bio ||
//                         "لا توجد معلومات متاحة حالياً."}
//                     </p>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="reviews" className="mt-0 text-right">
//                 <div className="space-y-6">
//                   {/* Reviews List */}
//                   <div>
//                     <h4 className="text-xl font-semibold text-gray-800 mb-4">
//                       آخر التقييمات
//                     </h4>
//                     {therapist.total_reviews > 0 ? (
//                       <div className="space-y-4">
//                         <div className="text-center py-8">
//                           <p className="text-gray-600">
//                             لا توجد تقييمات لعرضها بعد
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-center py-12">
//                         <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
//                         <h4 className="text-lg font-semibold text-gray-800 mb-2">
//                           لا توجد تقييمات بعد
//                         </h4>
//                         <p className="text-gray-600 mb-6">
//                           كن أول من يشارك تجربته مع هذا المختص
//                         </p>
//                         <Button
//                           onClick={() => setShowReviewDialog(true)}
//                           className="bg-[#32A88D] hover:bg-[#2D977F]"
//                         >
//                           <Edit className="w-5 h-5 ml-2" />
//                           اكتب تقييم
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>

//           {/* الشريط الجانبي */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-8 space-y-6">
//               {/* Booking & Schedule Card */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
//                     اختر موعد الجلسة
//                   </h3>

//                   {/* جدول العمل والأيام المتاحة */}
//                   <div className="mt-8 space-y-6">
//                     {/* جدول العمل */}
//                     {schedule && (
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between">
//                           <h4 className="font-semibold text-gray-800 flex items-center gap-2">
//                             <Clock className="w-5 h-5 text-[#32A88D]" />
//                             جدول العمل
//                           </h4>
//                           <Badge className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1">
//                             {schedule.type_time === "online"
//                               ? "جلسات أونلاين"
//                               : "جلسات حضور"}
//                           </Badge>
//                         </div>

//                         {/* أوقات الصباح */}
//                         <div className="bg-gray-50 rounded-xl p-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-gray-600 text-sm">
//                               الصباح:
//                             </span>
//                             <span className="font-semibold text-gray-800">
//                               {formatTime(schedule.start_time_morning)} -{" "}
//                               {formatTime(schedule.end_time_morning)}
//                             </span>
//                           </div>

//                           {/* أوقات المساء إذا كانت متاحة */}
//                           {schedule.is_have_evening_time && (
//                             <div className="flex items-center justify-between">
//                               <span className="text-gray-600 text-sm">
//                                 المساء:
//                               </span>
//                               <span className="font-semibold text-gray-800">
//                                 {formatTime(schedule.start_time_evening)} -{" "}
//                                 {formatTime(schedule.end_time_evening)}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* الأيام المتاحة */}
//                     <div className="space-y-4">
//                       <h4 className="font-semibold text-gray-800 flex items-center gap-2">
//                         <Calendar className="w-5 h-5 text-[#32A88D]" />
//                         الأيام المتاحة
//                       </h4>
//                       <div className="flex flex-wrap gap-2">
//                         {schedule &&
//                         schedule.day_of_week &&
//                         schedule.day_of_week.length > 0
//                           ? schedule.day_of_week.map((day, index) => (
//                               <Badge
//                                 key={index}
//                                 variant="outline"
//                                 className="bg-gray-50 border-gray-200 px-3 py-1.5"
//                               >
//                                 {translateDay(day)}
//                               </Badge>
//                             ))
//                           : [
//                               "السبت",
//                               "الأحد",
//                               "الاثنين",
//                               "الثلاثاء",
//                               "الأربعاء",
//                               "الخميس",
//                             ].map((day) => (
//                               <Badge
//                                 key={day}
//                                 variant="outline"
//                                 className="bg-gray-50 border-gray-200 px-3 py-1.5"
//                               >
//                                 {day}
//                               </Badge>
//                             ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* زر اكتب تقييم */}

//                   <div className="my-6">
//                     <ConsultationDialog
//                       showProfileButton={false}
//                       buttonClassName="px-8"
//                       provider={{
//                         id: therapist.id,
//                         full_name: therapist.full_name,
//                         type_account: therapist.type_account || "therapist",
//                         image: therapist.image,
//                         average_rating: String(therapist.average_rating || 0),
//                         total_reviews: therapist.total_reviews || 0,
//                         therapist_details: therapist.therapist_details,
//                       }}
//                     />

//                     <div className="mt-2">
//                       <Button
//                         onClick={() => setShowReviewDialog(true)}
//                         variant="outline"
//                         className="cursor-pointer w-full bg-white/90 backdrop-blur-sm text-[#32A88D] hover:bg-white border border-[#32A88D]/30 hover:border-[#32A88D] rounded-xl py-6 transition-all duration-300"
//                       >
//                         <Edit className="w-5 h-5 ml-2" />
//                         اكتب تقييم
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Certifications */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//                 <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <Award className="w-5 h-5 text-[#32A88D]" />
//                   الشهادات والتراخيص
//                 </h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                     <span>
//                       {therapist.therapist_details?.countries_certified ||
//                         "غير محدد"}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                     <span>مختص معتمد</span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                     <span>عضو جمعية الأطباء النفسيين</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }
// app/specialists/[id]/page.tsx
import { SpecialistProfile } from "@/features/service-provider/public-profile/ui";

export default function SpecialistProfilePage() {
  return <SpecialistProfile />;
}