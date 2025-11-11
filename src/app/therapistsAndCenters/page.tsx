// "use client";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { 
//   MessageSquare, 
//   Video, 
//   Star, 
//   ArrowRight,
//   HomeIcon,
//   SearchIcon,
//   MapPinIcon,
//   BuildingIcon,
//   UserIcon,
//   FilterIcon,
//   GraduationCap,
//   Award,
//   Loader2
// } from "lucide-react";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { Input } from "@/components/ui/input";
// import LandingNavbar from "@/components/ui/LandingNavbar";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import Link from "next/link";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { useConsultationRequestStore } from "@/features/home/hooks/useConsultationRequestStore";


// type MedicalSpecialties = {
//   id: number;
//   name: string;
//   description: string;
// };

// type TherapistDetails = {
//   id: number;
//   medical_specialties: MedicalSpecialties;
//   university_name: string;
//   countries_certified: string;
// };

// type TypeItem = {
//   id: number;
//   full_name: string;
//   image: string;
//   therapist_details: TherapistDetails;
//   total_reviews: number;
//   average_rating: number;
// };

// type SearchFilters = {
//   country: string;
//   city: string;
//   specialty: string;
// };

// interface ConsultationRequestPayload {
//   patient_id: string | number;
//   consultant_id: number;
//   consultant_type: string;
//   consultant_nature: "chat" | "video";
//   requested_day?: string;
//   requested_time?: string;
//   type_appointment?: string;
// }

// export default function TherapistsAndCenters() {
//   const [selectedTab, setSelectedTab] = useState<"all" | "therapist" | "center">("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [filters, setFilters] = useState<SearchFilters>({
//     country: "",
//     city: "",
//     specialty: ""
//   });

//   const { data: session } = useSession();
//   const { storeConsultationRequest, Loading: isSubmitting } = useConsultationRequestStore();

//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["serviceProviders", selectedTab, debouncedSearch, filters],
//     queryFn: async () => {
//       try {
//         const token = session?.accessToken;
//         const params: any = {};

//         if (selectedTab !== "all") {
//           params.type = selectedTab;
//         }
//         if (debouncedSearch) {
//           params.full_name = debouncedSearch;
//         }
//         if (filters.country) {
//           params.country = filters.country;
//         }
//         if (filters.city) {
//           params.city = filters.city;
//         }
//         if (filters.specialty) {
//           params.specialty = filters.specialty;
//         }

//         const res = await axios.get(
//           `https://demoapplication.jawebhom.com/api/customer/service-provider/search`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             params,
//           }
//         );

//         console.log("✅ API Response:", res.data);
//         return res.data;
//       } catch (err) {
//         if (axios.isAxiosError(err)) {
//           console.error("API Error:", err.response?.data || err.message);
//         } else {
//           console.error("Unexpected Error:", err);
//         }
//         throw err;
//       }
//     },
//     enabled: !!session?.accessToken,
//   });

//   const handleFilterChange = (key: keyof SearchFilters, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       country: "",
//       city: "",
//       specialty: ""
//     });
//     setSearchQuery("");
//   };

//   const handleRequest = async (
//     consultantId: number,
//     type: "chat" | "video",
//     consultantType: string = "therapist"
//   ) => {
//     if (!session?.user?.id) {
//       toast.error("يجب تسجيل الدخول أولاً");
//       return;
//     }

//     try {
//       const payload: ConsultationRequestPayload = {
//         patient_id: session.user.id, 
//         consultant_id: consultantId,
//         consultant_type: consultantType,
//         consultant_nature: type,
//       };

//       if (type === "video") {
//         payload.requested_day = "Thursday";
//         payload.requested_time = "2025-10-30 14:00";
//         payload.type_appointment = "online";
//       }

//       const response = await storeConsultationRequest(payload);
//       toast.success("تم إرسال طلبك بنجاح، الرجاء انتظار موافقة المختص");
//     } catch (error) {
//       toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى");
//       console.error("❌ Error sending consultation request:", error);
//     }
//   };

//   const resultsCount = data?.data?.length || 0;

//   return (
//     <>
//       <LandingNavbar />
      
//       {/* Header Section with Breadcrumb */}
//       <section className="bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 py-6 px-5 md:px-16 lg:px-28">
//         <div className="max-w-7xl mx-auto">
//           {/* Breadcrumb */}
//           <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
//             <Link href="/" className="flex items-center gap-2 hover:text-[#32A88D] transition-colors">
//               <HomeIcon className="w-4 h-4" />
//               الرئيسية
//             </Link>
//             <ArrowRight className="w-4 h-4 rotate-180" />
//             <span className="text-[#32A88D] font-medium">المختصين والمراكز</span>
//           </div>

//           {/* Main Header */}
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 المختصين والمراكز
//               </h1>
//               <p className="text-lg text-gray-600">
//                 عرض {resultsCount} {selectedTab === "therapist" ? "مختص" : selectedTab === "center" ? "مركز" : "نتيجة"} لك
//               </p>
//             </div>
            
//             {/* Quick Stats */}
//             <div className="flex items-center gap-6 mt-4 lg:mt-0">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-[#32A88D]">450+</div>
//                 <div className="text-sm text-gray-600">متخصص معتمد</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-[#32A88D]">50+</div>
//                 <div className="text-sm text-gray-600">مركز تأهيلي</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Content Section */}
//       <section className="bg-[#F8F7F7] py-8 px-5 md:px-16 lg:px-28">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
//             {/* Left Sidebar - Filters */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                
//                 {/* Filter Header */}
//                 <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
//                   <FilterIcon className="w-5 h-5 text-[#32A88D]" />
//                   <h3 className="text-lg font-semibold text-gray-800">الفلاتر</h3>
//                 </div>

//                 {/* Type Filter */}
//                 <div className="mb-6">
//                   <h4 className="text-sm font-medium text-gray-700 mb-3">النوع</h4>
//                   <div className="space-y-2">
//                     <button
//                       onClick={() => setSelectedTab("all")}
//                       className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 ${
//                         selectedTab === "all"
//                           ? "bg-[#32A88D] text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       الكل
//                     </button>
//                     <button
//                       onClick={() => setSelectedTab("therapist")}
//                       className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 ${
//                         selectedTab === "therapist"
//                           ? "bg-[#32A88D] text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       المختصون
//                     </button>
//                     <button
//                       onClick={() => setSelectedTab("center")}
//                       className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 ${
//                         selectedTab === "center"
//                           ? "bg-[#32A88D] text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       المراكز التأهيلية
//                     </button>
//                   </div>
//                 </div>

//                 {/* Specialties Filter */}
//                 <div className="mb-6">
//                   <h4 className="text-sm font-medium text-gray-700 mb-3">التخصصات</h4>
//                   <Select
//                     value={filters.specialty}
//                     onValueChange={(value) => handleFilterChange("specialty", value)}
//                   >
//                     <SelectTrigger className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]">
//                       <SelectValue placeholder="اختر التخصص" />
//                     </SelectTrigger>
//                     <SelectContent className="rounded-lg">
//                       <SelectItem value="physiotherapy">العلاج الطبيعي</SelectItem>
//                       <SelectItem value="rehabilitation">التأهيل</SelectItem>
//                       <SelectItem value="sports">الطب الرياضي</SelectItem>
//                       <SelectItem value="neurological">العلاج العصبي</SelectItem>
//                       <SelectItem value="pediatric">علاج الأطفال</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Location Filters */}
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">الدولة</h4>
//                     <div className="relative">
//                       <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         value={filters.country}
//                         onChange={(e) => handleFilterChange("country", e.target.value)}
//                         placeholder="ابحث بالدولة"
//                         className="w-full pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">المدينة</h4>
//                     <div className="relative">
//                       <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         value={filters.city}
//                         onChange={(e) => handleFilterChange("city", e.target.value)}
//                         placeholder="ابحث بالمدينة"
//                         className="w-full pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#32A88D]"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Clear Filters */}
//                 <Button
//                   variant="outline"
//                   onClick={clearFilters}
//                   className="w-full mt-6 border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-lg"
//                 >
//                   مسح الكل
//                 </Button>
//               </div>

//               {/* Help Section */}
//               {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">مساعدة</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-[#32A88D]/10 transition-colors cursor-pointer">
//                     <span className="text-sm text-gray-700">التخصصات</span>
//                     <ArrowRight className="w-4 h-4 rotate-180 text-gray-400" />
//                   </div>
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-[#32A88D]/10 transition-colors cursor-pointer">
//                     <span className="text-sm text-gray-700">العيادات</span>
//                     <ArrowRight className="w-4 h-4 rotate-180 text-gray-400" />
//                   </div>
//                 </div>
//               </div> */}
//             </div>

//             {/* Right Content - Results */}
//             <div className="lg:col-span-3">
//               {/* Search Bar */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
//                 <div className="relative">
//                   <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="ابحث عن المختصين والمراكز التأهيلية..."
//                     className="w-full h-14 text-lg px-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D]"
//                   />
//                 </div>
//               </div>

//               {/* Results Grid */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//                 {isLoading ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {[...Array(6)].map((_, index) => (
//                       <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
//                         <Skeleton className="h-48 w-full rounded-xl mb-4" />
//                         <Skeleton className="h-6 w-3/4 mb-2" />
//                         <Skeleton className="h-4 w-full mb-1" />
//                         <Skeleton className="h-4 w-2/3 mb-4" />
//                         <Skeleton className="h-12 w-full rounded-xl" />
//                       </div>
//                     ))}
//                   </div>
//                 ) : error ? (
//                   <div className="text-center py-20">
//                     <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
//                       <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Award className="w-8 h-8 text-red-500" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-red-800 mb-2">حدث خطأ</h3>
//                       <p className="text-red-600">تعذر تحميل بيانات المختصين</p>
//                       <Button 
//                         variant="outline" 
//                         className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
//                         onClick={() => window.location.reload()}
//                       >
//                         إعادة المحاولة
//                       </Button>
//                     </div>
//                   </div>
//                 ) : data?.data?.length === 0 ? (
//                   <div className="text-center py-20">
//                     <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                       <SearchIcon className="w-12 h-12 text-gray-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد نتائج</h3>
//                     <p className="text-gray-600 mb-6">لم نتمكن من العثور على أي نتائج تطابق بحثك</p>
//                     <Button 
//                       onClick={clearFilters}
//                       className="bg-[#32A88D] hover:bg-[#2a8a7a]"
//                     >
//                       مسح الفلاتر
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {data?.data?.map((item: TypeItem) => (
//                       <div
//                         key={item.id}
//                         className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
//                       >
//                         {/* صورة المختص */}
//                         <div className="relative overflow-hidden">
//                           <Image
//                             src={item.image || "/images/home/therapist.jpg"}
//                             width={400}
//                             height={300}
//                             alt={item.full_name}
//                             className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
//                           />
//                           <div className="absolute top-4 left-4">
//                             <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
//                               <MapPinIcon className="w-3 h-3 mr-1" />
//                               متصل الآن
//                             </Badge>
//                           </div>
//                           <div className="absolute top-4 right-4">
//                             <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
//                               <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                               <span>{Number(item.average_rating).toFixed(1) || "0.0"}</span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* معلومات المختص */}
//                         <div className="p-6">
//                           <div className="flex items-start justify-between mb-3">
//                             <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
//                               {item.full_name}
//                             </h3>
//                           </div>

//                           <div className="space-y-2 mb-4">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                               <GraduationCap className="w-4 h-4 text-[#32A88D]" />
//                               <span className="line-clamp-1">{item.therapist_details?.university_name || "غير محدد"}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                               <Award className="w-4 h-4 text-[#32A88D]" />
//                               <span className="line-clamp-1">{item.therapist_details?.medical_specialties?.name || "تخصص عام"}</span>
//                             </div>
//                           </div>

//                           {/* التقييمات */}
//                           <div className="flex items-center justify-between mb-6">
//                             <div className="flex items-center gap-2">
//                               <div className="flex items-center gap-1">
//                                 {[...Array(5)].map((_, i) => (
//                                   <Star
//                                     key={i}
//                                     className={`w-4 h-4 ${
//                                       i < Math.floor(Number(item.average_rating))
//                                         ? "fill-yellow-400 text-yellow-400"
//                                         : "fill-gray-300 text-gray-300"
//                                     }`}
//                                   />
//                                 ))}
//                               </div>
//                               <span className="text-sm text-gray-500">
//                                 ({item.total_reviews || 0} تقييم)
//                               </span>
//                             </div>
//                             <span className="text-xs bg-[#32A88D]/10 text-[#32A88D] px-2 py-1 rounded-full">
//                               {selectedTab === "therapist" ? "مختص" : "مركز"}
//                             </span>
//                           </div>

//                           {/* زر طلب الاستشارة */}
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button 
//                                 size="lg" 
//                                 className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
//                               >
//                                 طلب استشارة
//                               </Button>
//                             </DialogTrigger>

//                             <DialogContent className="sm:max-w-md rounded-2xl">
//                               <DialogHeader>
//                                 <div className="text-center">
//                                   <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <MessageSquare className="w-8 h-8 text-[#32A88D]" />
//                                   </div>
//                                   <DialogTitle className="text-xl font-bold text-gray-800">
//                                     اختر نوع الاستشارة
//                                   </DialogTitle>
//                                   <p className="text-gray-600 mt-2">مع {item.full_name}</p>
//                                 </div>
//                               </DialogHeader>
                              
//                               <div className="py-6">
//                                 <div className="grid grid-cols-2 gap-4">
//                                   {/* استشارة نصية */}
//                                   <button
//                                     onClick={() => handleRequest(item.id, "chat", selectedTab === "center" ? "center" : "therapist")}
//                                     disabled={isSubmitting}
//                                     className="group flex flex-col items-center gap-3 p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-2xl transition-all duration-300 hover:scale-105"
//                                   >
//                                     <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
//                                       <MessageSquare className="w-6 h-6 text-white" />
//                                     </div>
//                                     <span className="font-medium text-blue-700">استشارة نصية</span>
//                                     <span className="text-xs text-blue-600 text-center">محادثة فورية عبر النص</span>
//                                   </button>

//                                   {/* استشارة فيديو */}
//                                   <button
//                                     onClick={() => handleRequest(item.id, "video", selectedTab === "center" ? "center" : "therapist")}
//                                     disabled={isSubmitting}
//                                     className="group flex flex-col items-center gap-3 p-6 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-2xl transition-all duration-300 hover:scale-105"
//                                   >
//                                     <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
//                                       <Video className="w-6 h-6 text-white" />
//                                     </div>
//                                     <span className="font-medium text-green-700">استشارة فيديو</span>
//                                     <span className="text-xs text-green-600 text-center">مكالمة فيديو مباشرة</span>
//                                   </button>
//                                 </div>

//                                 {isSubmitting && (
//                                   <div className="flex items-center justify-center gap-2 mt-6 p-4 bg-gray-50 rounded-xl">
//                                     <Loader2 className="w-5 h-5 text-[#32A88D] animate-spin" />
//                                     <span className="text-gray-600">جاري إرسال الطلب...</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </DialogContent>
//                           </Dialog>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Load More Button */}
//                 {data?.data?.length > 0 && (
//                   <div className="text-center mt-8">
//                     <Button 
//                       variant="outline" 
//                       className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-8 py-2"
//                     >
//                       تحميل المزيد
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import React from 'react'
import TherapistsAndCenters from '@/features/service-provider/ui/TherapistsAndCenters'

export default function Page() {
  return (
    <div>
      <TherapistsAndCenters />
    </div>
  )
}

