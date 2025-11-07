// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import {
//   Loader2,
//   Clock,
//   Video,
//   MessageCircle,
//   Check,
//   X,
//   Calendar,
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   Star,
//   AlertCircle,
//   Search,
//   Menu,
//   ChevronLeft,
//   AlertTriangle,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// // أنواع البيانات
// type ConsultationRequest = {
//   id: number;
//   patient: {
//     id: number;
//     full_name: string;
//     email: string;
//     phone: string;
//     location: string;
//   };
//   type: "video" | "chat";
//   status: "pending" | "accepted" | "rejected" | "completed" | "waiting";
//   scheduled_time?: string;
//   created_at: string;
//   symptoms: string;
//   duration: number;
//   price: number;
//   priority?: "low" | "medium" | "high";
//   rejection_reason?: string;
// };

// export default function TherapistConsultation() {
//   const { data: session } = useSession();
//   const [requests, setRequests] = useState<ConsultationRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
//   const [activeTab, setActiveTab] = useState<"all" | "video" | "chat">("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMobile, setIsMobile] = useState(false);
//   const [showRequestList, setShowRequestList] = useState(true);
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [requestToReject, setRequestToReject] = useState<number | null>(null);
//   const [rejecting, setRejecting] = useState(false);

//   // بيانات وهمية محسنة
//   const mockRequests: ConsultationRequest[] = [
//     {
//       id: 1,
//       patient: {
//         id: 1,
//         full_name: "أحمد محمد",
//         email: "ahmed@example.com",
//         phone: "+966500000001",
//         location: "الرياض، السعودية",
//       },
//       type: "chat",
//       status: "pending",
//       created_at: new Date().toISOString(),
//       symptoms: "آلام في الظهر ومشاكل في الحركة",
//       duration: 30,
//       price: 150,
//       priority: "high",
//     },
//     {
//       id: 2,
//       patient: {
//         id: 2,
//         full_name: "فاطمة عبدالله",
//         email: "fatima@example.com",
//         phone: "+966500000002",
//         location: "جدة، السعودية",
//       },
//       type: "video",
//       status: "pending",
//       scheduled_time: "2024-01-15T14:00:00Z",
//       created_at: new Date().toISOString(),
//       symptoms: "إعادة تأهيل بعد عملية جراحية",
//       duration: 45,
//       price: 250,
//       priority: "medium",
//     },
//     {
//       id: 3,
//       patient: {
//         id: 3,
//         full_name: "خالد سعيد",
//         email: "khaled@example.com",
//         phone: "+966500000003",
//         location: "الدمام، السعودية",
//       },
//       type: "chat",
//       status: "accepted",
//       created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//       symptoms: "تمارين علاج طبيعي للركبة",
//       duration: 25,
//       price: 120,
//       priority: "low",
//     },
//     {
//       id: 4,
//       patient: {
//         id: 4,
//         full_name: "نورة الرشيد",
//         email: "nora@example.com",
//         phone: "+966500000004",
//         location: "الرياض، السعودية",
//       },
//       type: "video",
//       status: "waiting",
//       scheduled_time: "2024-01-16T10:00:00Z",
//       created_at: new Date().toISOString(),
//       symptoms: "متابعة حالة علاج طبيعي",
//       duration: 60,
//       price: 300,
//       priority: "medium",
//     },
//   ];

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         setRequests(mockRequests);
//       } catch (error) {
//         toast.error("حدث خطأ في جلب طلبات الاستشارة");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

//   // كشف حجم الشاشة
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 1024);
//       if (window.innerWidth >= 1024) {
//         setShowRequestList(true);
//       }
//     };

//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
    
//     return () => {
//       window.removeEventListener('resize', checkScreenSize);
//     };
//   }, []);

//   const filteredRequests = requests.filter((request) => {
//     if (activeTab === "all") return true;
//     return request.type === activeTab;
//   });

//   const searchedRequests = filteredRequests.filter(
//     (request) =>
//       request.patient.full_name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       request.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       request.patient.location.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleAccept = async (requestId: number) => {
//     try {
//       setRequests((prev) =>
//         prev.map((req) =>
//           req.id === requestId ? { ...req, status: "accepted" } : req
//         )
//       );

//       if (selectedRequest?.id === requestId) {
//         setSelectedRequest((prev) =>
//           prev ? { ...prev, status: "accepted" } : null
//         );
//       }

//       toast.success("تم قبول طلب الاستشارة بنجاح");
//     } catch (error) {
//       toast.error("حدث خطأ في قبول الطلب");
//     }
//   };

//   const openRejectDialog = (requestId: number) => {
//     setRequestToReject(requestId);
//     setRejectionReason("");
//     setRejectDialogOpen(true);
//   };

//   const handleReject = async () => {
//     if (!requestToReject) return;
    
//     if (!rejectionReason.trim()) {
//       toast.error("يرجى إدخال سبب الرفض");
//       return;
//     }

//     setRejecting(true);
//     try {
//       // محاكاة طلب API
//       await new Promise((resolve) => setTimeout(resolve, 1000));
      
//       setRequests((prev) =>
//         prev.map((req) =>
//           req.id === requestToReject ? { 
//             ...req, 
//             status: "rejected",
//             rejection_reason: rejectionReason 
//           } : req
//         )
//       );

//       if (selectedRequest?.id === requestToReject) {
//         setSelectedRequest((prev) =>
//           prev ? { 
//             ...prev, 
//             status: "rejected",
//             rejection_reason: rejectionReason 
//           } : null
//         );
//       }

//       toast.success("تم رفض طلب الاستشارة بنجاح");
//       setRejectDialogOpen(false);
//       setRejectionReason("");
//       setRequestToReject(null);
//     } catch (error) {
//       toast.error("حدث خطأ في رفض الطلب");
//     } finally {
//       setRejecting(false);
//     }
//   };

//   const handleStartConsultation = async (requestId: number) => {
//     try {
//       setRequests((prev) =>
//         prev.map((req) =>
//           req.id === requestId ? { ...req, status: "completed" } : req
//         )
//       );

//       if (selectedRequest?.id === requestId) {
//         setSelectedRequest((prev) =>
//           prev ? { ...prev, status: "completed" } : null
//         );
//       }

//       toast.success("تم بدء الاستشارة بنجاح");
//     } catch (error) {
//       toast.error("حدث خطأ في بدء الاستشارة");
//     }
//   };

//   const handleSelectRequest = (request: ConsultationRequest) => {
//     setSelectedRequest(request);
//     if (isMobile) {
//       setShowRequestList(false);
//     }
//   };

//   const handleBackToList = () => {
//     setShowRequestList(true);
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: {
//         label: "في انتظار الموافقة",
//         variant: "secondary" as const,
//         className: "bg-amber-100 text-amber-800 border-amber-200",
//       },
//       accepted: {
//         label: "مقبول",
//         variant: "default" as const,
//         className: "bg-green-100 text-green-800 border-green-200",
//       },
//       rejected: {
//         label: "مرفوض",
//         variant: "destructive" as const,
//         className: "bg-red-100 text-red-800 border-red-200",
//       },
//       waiting: {
//         label: "في انتظار البدء",
//         variant: "outline" as const,
//         className: "bg-blue-100 text-blue-800 border-blue-200",
//       },
//       completed: {
//         label: "مكتمل",
//         variant: "default" as const,
//         className: "bg-gray-100 text-gray-800 border-gray-200",
//       },
//     };

//     const config =
//       statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

//     return (
//       <Badge
//         variant={config.variant}
//         className={`text-xs border ${config.className}`}
//       >
//         {config.label}
//       </Badge>
//     );
//   };

//   const getTypeIcon = (type: string) => {
//     return type === "video" ? (
//       <Video className="w-4 h-4 text-blue-600" />
//     ) : (
//       <MessageCircle className="w-4 h-4 text-green-600" />
//     );
//   };

//   const getRemainingTime = (createdAt: string) => {
//     const created = new Date(createdAt);
//     const now = new Date();
//     const diffHours = Math.floor(
//       (now.getTime() - created.getTime()) / (1000 * 60 * 60)
//     );
//     const remaining = 24 - diffHours;

//     return remaining > 0 ? `${remaining} ساعة` : "منتهي";
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-[#32A88D] mx-auto mb-4" />
//           <span className="text-gray-600 text-lg">
//             جاري تحميل طلبات الاستشارة...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container max-w-7xl mx-auto sm:px-4  sm:py-6 md:ml-10 flex-1 bg-gray-50 py-6 px-4" dir="rtl">
//       {/* العنوان الرئيسي */}
//       {/* <div className="mb-6 sm:mb-8 text-center">
//         <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//           <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#32A88D] rounded-full animate-pulse"></div>
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] bg-clip-text">
//             طلبات الاستشارة
//           </h1>
//           <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#32A88D] rounded-full animate-pulse"></div>
//         </div>
//         <p className="text-gray-600 text-sm sm:text-base md:text-lg">
//           إدارة طلبات الاستشارات الواردة من المرضى
//         </p>
//       </div> */}

//       <div className="grid grid-cols-1 mx-auto max-w-5xl w-full space-y-6 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
//         {/* القائمة الجانبية - تظهر حسب حالة الجوال */}
//         {(showRequestList || !isMobile) && (
//           <div className={`lg:col-span-1 ${isMobile && !showRequestList ? 'hidden' : 'block'}`}>
//             <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg">
//               <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
//                     <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#32A88D]" />
//                     طلبات الاستشارة
//                     <Badge
//                       variant="outline"
//                       className="bg-[#32A88D]/10 text-[#32A88D] border-[#32A88D]/20 text-xs"
//                     >
//                       {filteredRequests.length}
//                     </Badge>
//                   </CardTitle>
//                   {isMobile && selectedRequest && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={handleBackToList}
//                       className="lg:hidden"
//                     >
//                       <ChevronLeft className="w-4 h-4 ml-1" />
//                       العودة
//                     </Button>
//                   )}
//                 </div>

//                 {/* شريط البحث */}
//                 <div className="relative mt-3 sm:mt-4">
//                   <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <Input
//                     type="text"
//                     placeholder="ابحث باسم المريض أو الأعراض..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pr-10 bg-gray-50 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#32A88D] focus:ring-[#32A88D] text-sm sm:text-base"
//                   />
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0" dir="rtl">
//                 <Tabs
//                   value={activeTab}
//                   onValueChange={(value) => setActiveTab(value as any)}
//                   className="w-full"
//                 >
//                   <TabsList className="grid w-full grid-cols-3 p-1 sm:p-2 bg-gray-50 rounded-t-xl sm:rounded-t-2xl border-b border-gray-100">
//                     <TabsTrigger
//                       value="video"
//                       className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
//                     >
//                       فيديو
//                     </TabsTrigger>
//                     <TabsTrigger
//                       value="chat"
//                       className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
//                     >
//                       محادثة
//                     </TabsTrigger>
//                     <TabsTrigger
//                       value="all"
//                       className="text-xs sm:text-sm data-[state=active]:bg-[#32A88D] data-[state=active]:text-white transition-all duration-200 rounded-lg sm:rounded-xl py-2"
//                     >
//                       الكل
//                     </TabsTrigger>
//                   </TabsList>

//                   <TabsContent value={activeTab} className="m-0">
//                     <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
//                       {searchedRequests.length === 0 ? (
//                         <div className="text-center py-8 sm:py-12">
//                           <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
//                           <p className="text-gray-500 text-sm sm:text-base">
//                             {searchQuery
//                               ? "لا توجد نتائج للبحث"
//                               : "لا توجد طلبات استشارة"}
//                           </p>
//                           <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
//                             {searchQuery
//                               ? "جرب البحث بكلمات أخرى"
//                               : "سيظهر هنا الطلبات الجديدة عند وصولها"}
//                           </p>
//                         </div>
//                       ) : (
//                         searchedRequests.map((request) => (
//                           <div
//                             key={request.id}
//                             className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-md group ${
//                               selectedRequest?.id === request.id
//                                 ? "bg-gradient-to-r from-[#32A88D]/5 to-white border-r-2 sm:border-r-4 border-r-[#32A88D] shadow-md"
//                                 : ""
//                             }`}
//                             onClick={() => handleSelectRequest(request)}
//                           >
//                             <div className="flex flex-row-reverse items-start gap-2 sm:gap-3">
//                               <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-200 group-hover:border-[#32A88D]/30 transition-colors duration-300">
//                                 <AvatarFallback className="bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 text-[#32A88D] font-semibold text-xs sm:text-sm">
//                                   {request.patient.full_name
//                                     .split(" ")
//                                     .map((n) => n[0])
//                                     .join("")}
//                                 </AvatarFallback>
//                               </Avatar>

//                               <div className="flex-1 min-w-0">
//                                 <div className="flex flex-row-reverse items-center justify-between mb-1 sm:mb-2">
//                                   <div className="flex flex-row-reverse items-center gap-1 sm:gap-2">
//                                     <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate group-hover:text-[#32A88D] transition-colors duration-200 text-right">
//                                       {request.patient.full_name}
//                                     </h3>
//                                   </div>
//                                   <div className="flex flex-row-reverse items-center gap-1">
//                                     {getTypeIcon(request.type)}
//                                     <div className="scale-75 sm:scale-100 origin-right">
//                                       {getStatusBadge(request.status)}
//                                     </div>
//                                   </div>
//                                 </div>

//                                 <p className="text-xs text-gray-600 line-clamp-2 mb-2 sm:mb-3 leading-relaxed text-right">
//                                   {request.symptoms}
//                                 </p>

//                                 <div className="flex flex-row-reverse items-center justify-between">
//                                   <div className="flex flex-row-reverse items-center gap-2 sm:gap-4 text-xs text-gray-500">
//                                     <span className="flex flex-row-reverse items-center gap-1 text-xs">
//                                       <Clock className="w-3 h-3" />
//                                       {request.duration} د
//                                     </span>
//                                     {request.type === "chat" && (
//                                       <span
//                                         className={`flex flex-row-reverse items-center gap-1 text-xs ${
//                                           getRemainingTime(request.created_at) ===
//                                           "منتهي"
//                                             ? "text-red-500"
//                                             : ""
//                                         }`}
//                                       >
//                                         <AlertCircle className="w-3 h-3" />
//                                         {getRemainingTime(request.created_at)}
//                                       </span>
//                                     )}
//                                   </div>
//                                   <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] bg-clip-text text-transparent">
//                                     {request.price} $
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* تفاصيل الطلب - تظهر حسب حالة الجوال */}
//         {((!showRequestList && isMobile) || !isMobile) && selectedRequest && (
//           <div className={`lg:col-span-2 ${isMobile && showRequestList ? 'hidden' : 'block'}`}>
//             <Card className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg h-full">
//               <CardHeader className="pb-3 sm:pb-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl sm:rounded-t-2xl">
//                 <div className="flex items-center justify-between">
//                   {isMobile && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={handleBackToList}
//                       className="lg:hidden"
//                     >
//                       <ChevronLeft className="w-4 h-4 ml-1" />
//                       رجوع
//                     </Button>
//                   )}
//                   <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3 flex-1 ">
//                     <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#32A88D]" />
//                     تفاصيل الاستشارة
//                   </CardTitle>
//                   <div className="flex items-center gap-1 sm:gap-2">
//                     {getTypeIcon(selectedRequest.type)}
//                     <div className="scale-75 sm:scale-100 origin-right">
//                       {getStatusBadge(selectedRequest.status)}
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="p-4 sm:p-6">
//                 {/* معلومات المريض */}
//                 <div className="mb-6 sm:mb-8">
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
//                     البيانات الأساسية
//                   </h3>
//                   <div className="grid grid-cols-1 gap-3 sm:gap-4">
//                     <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
//                       <div className="p-1 sm:p-2 bg-[#32A88D]/10 rounded-lg">
//                         <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                           الاسم الكامل
//                         </p>
//                         <p className="font-semibold text-gray-800 text-sm sm:text-base">
//                           {selectedRequest.patient.full_name}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
//                       <div className="p-1 sm:p-2 bg-[#32A88D]/10 rounded-lg">
//                         <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                           البريد الإلكتروني
//                         </p>
//                         <p className="font-semibold text-gray-800 text-sm sm:text-base break-all">
//                           {selectedRequest.patient.email}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
//                       <div className="p-1 sm:p-2 bg-[#32A88D]/10 rounded-lg">
//                         <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs sm:text-sm text-gray-600 mb-1">رقم الهاتف</p>
//                         <p className="font-semibold text-gray-800 text-sm sm:text-base">
//                           {selectedRequest.patient.phone}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
//                       <div className="p-1 sm:p-2 bg-[#32A88D]/10 rounded-lg">
//                         <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs sm:text-sm text-gray-600 mb-1">العنوان</p>
//                         <p className="font-semibold text-gray-800 text-sm sm:text-base">
//                           {selectedRequest.patient.location}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* معلومات إضافية */}
//                 <div className="mb-6 sm:mb-8">
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
//                     <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
//                     معلومات إضافية
//                   </h3>
//                   <div className="space-y-3 sm:space-y-4">
//                     <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
//                       <p className="text-xs sm:text-sm text-gray-600 mb-2 flex items-center gap-2">
//                         <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
//                         الأعراض والشكوى
//                       </p>
//                       <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
//                         {selectedRequest.symptoms}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
//                         <p className="text-xs sm:text-sm text-gray-600 mb-2">
//                           مدة الاستشارة
//                         </p>
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#32A88D]" />
//                           <p className="font-semibold text-gray-800 text-base sm:text-lg">
//                             {selectedRequest.duration} دقيقة
//                           </p>
//                         </div>
//                       </div>

//                       <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
//                         <p className="text-xs sm:text-sm text-gray-600 mb-2">
//                           سعر الاستشارة
//                         </p>
//                         <p className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] bg-clip-text text-transparent">
//                           {selectedRequest.price} $
//                         </p>
//                       </div>
//                     </div>

//                     {selectedRequest.type === "video" &&
//                       selectedRequest.scheduled_time && (
//                         <div className="p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
//                           <div className="flex items-center gap-2 sm:gap-3 mb-2">
//                             <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
//                             <p className="text-xs sm:text-sm text-blue-800 font-medium">
//                               موعد الاستشارة
//                             </p>
//                           </div>
//                           <p className="font-semibold text-blue-900 text-sm sm:text-base md:text-lg">
//                             {new Date(
//                               selectedRequest.scheduled_time
//                             ).toLocaleString("ar-SA", {
//                               weekday: "long",
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                               hour: "numeric",
//                               minute: "numeric",
//                             })}
//                           </p>
//                         </div>
//                       )}

//                     {selectedRequest.type === "chat" && (
//                       <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg sm:rounded-xl border border-amber-200">
//                         <div className="flex items-center gap-2 sm:gap-3 mb-2">
//                           <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
//                           <p className="text-xs sm:text-sm text-amber-800 font-medium">
//                             الوقت المتبقي
//                           </p>
//                         </div>
//                         <p
//                           className={`font-semibold text-base sm:text-lg ${
//                             getRemainingTime(selectedRequest.created_at) ===
//                             "منتهي"
//                               ? "text-red-600"
//                               : "text-amber-700"
//                           }`}
//                         >
//                           {getRemainingTime(selectedRequest.created_at)}
//                         </p>
//                         <p className="text-xs text-amber-600 mt-2">
//                           ⚡ طلبات المحادثة النصية متاحة فقط خلال 24 ساعة من
//                           تقديم الطلب
//                         </p>
//                       </div>
//                     )}

//                     {/* عرض سبب الرفض إذا كان الطلب مرفوضاً */}
//                     {selectedRequest.status === "rejected" && selectedRequest.rejection_reason && (
//                       <div className="p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl border border-red-200">
//                         <div className="flex items-center gap-2 sm:gap-3 mb-2">
//                           <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
//                           <p className="text-xs sm:text-sm text-red-800 font-medium">
//                             سبب الرفض
//                           </p>
//                         </div>
//                         <p className="text-red-700 text-sm sm:text-base">
//                           {selectedRequest.rejection_reason}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* أزرار الإجراءات */}
//                 <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
//                   {selectedRequest.status === "pending" && (
//                     <>
//                       <Button
//                         onClick={() => handleAccept(selectedRequest.id)}
//                         className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
//                       >
//                         <Check className="w-4 h-4 sm:w-5 sm:h-5" />
//                         قبول الطلب
//                       </Button>

//                       <Button
//                         onClick={() => openRejectDialog(selectedRequest.id)}
//                         variant="outline"
//                         className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-initial"
//                       >
//                         <X className="w-4 h-4 sm:w-5 sm:h-5" />
//                         رفض الطلب
//                       </Button>
//                     </>
//                   )}

//                   {selectedRequest.status === "accepted" && (
//                     <Button
//                       onClick={() =>
//                         handleStartConsultation(selectedRequest.id)
//                       }
//                       className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
//                     >
//                       <Video className="w-4 h-4 sm:w-5 sm:h-5" />
//                       بدء الاستشارة الآن
//                     </Button>
//                   )}

//                   {selectedRequest.status === "waiting" && (
//                     <div className="w-full">
//                       <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
//                         <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
//                         <div className="flex-1">
//                           <p className="font-semibold text-blue-800 text-sm sm:text-base">
//                             في انتظار موعد الاستشارة
//                           </p>
//                           <p className="text-xs sm:text-sm text-blue-600">
//                             سيتم بدء الاستشارة في الموعد المحدد:{" "}
//                             {new Date(
//                               selectedRequest.scheduled_time!
//                             ).toLocaleString("ar-SA")}
//                           </p>
//                         </div>
//                       </div>

//                       <Button
//                         onClick={() =>
//                           handleStartConsultation(selectedRequest.id)
//                         }
//                         className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl px-4 sm:px-8 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full"
//                       >
//                         <Video className="w-4 h-4 sm:w-5 sm:h-5" />
//                         بدء الاستشارة مبكراً
//                       </Button>
//                     </div>
//                   )}

//                   {selectedRequest.status === "completed" && (
//                     <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl">
//                       <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
//                       <p className="font-semibold text-green-800 text-sm sm:text-lg">
//                         تم إكمال الاستشارة بنجاح
//                       </p>
//                       <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">
//                         شكراً لك على تقديم خدمة مميزة للمريض
//                       </p>
//                     </div>
//                   )}

//                   {selectedRequest.status === "rejected" && (
//                     <div className="w-full text-center p-4 sm:p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg sm:rounded-xl">
//                       <X className="w-8 h-8 sm:w-12 sm:h-12 text-red-600 mx-auto mb-2 sm:mb-3" />
//                       <p className="font-semibold text-red-800 text-sm sm:text-lg">
//                         تم رفض طلب الاستشارة
//                       </p>
//                       <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2">
//                         سيتم إعلام المريض بقرار الرفض
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* حالة عدم اختيار طلب */}
//         {!selectedRequest && (!isMobile || (isMobile && showRequestList)) && (
//           <div className="lg:col-span-2 hidden lg:block">
//             <Card className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg h-full flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
//               <CardContent className="text-center py-8 sm:py-12 px-4 sm:px-6">
//                 <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#32A88D]/10 to-[#32A88D]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
//                   <User className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#32A88D]" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
//                   اختر طلب استشارة
//                 </h3>
//                 <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
//                   اختر طلب استشارة من القائمة على اليمين لعرض التفاصيل الكاملة
//                   واتخاذ الإجراء المناسب
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>

//       {/* ديلوج تأكيد الرفض */}
//       <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
//         <DialogContent className="sm:max-w-md" dir="rtl">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-600">
//               <AlertTriangle className="w-5 h-5" />
//               تأكيد رفض الاستشارة
//             </DialogTitle>
//             <DialogDescription className="text-right">
//               هل أنت متأكد من رفض طلب الاستشارة؟ يرجى إدخال سبب الرفض وسيتم إعلام المريض به.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="rejectionReason" className="text-right block">
//                 سبب الرفض <span className="text-red-500">*</span>
//               </Label>
//               <Textarea
//                 id="rejectionReason"
//                 placeholder="أدخل سبب رفض الاستشارة..."
//                 value={rejectionReason}
//                 onChange={(e) => setRejectionReason(e.target.value)}
//                 className="min-h-[100px] resize-none text-right"
//                 dir="rtl"
//               />
//               <p className="text-xs text-gray-500 text-right">
//                 هذا السبب سيتم إرساله للمريض
//               </p>
//             </div>
//           </div>
          
//           <DialogFooter className="flex flex-col sm:flex-row gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setRejectDialogOpen(false)}
//               className="flex-1"
//               disabled={rejecting}
//             >
//               إلغاء
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleReject}
//               disabled={rejecting || !rejectionReason.trim()}
//               className="flex-1"
//             >
//               {rejecting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin ml-2" />
//                   جاري الرفض...
//                 </>
//               ) : (
//                 <>
//                   <X className="w-4 h-4 ml-2" />
//                   تأكيد الرفض
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
        
//         @media (max-width: 640px) {
//           .container {
//             padding-left: 0.75rem;
//             padding-right: 0.75rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }