// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import {
//   Star,
//   Clock,
//   Calendar,
//   Users,
//   ChevronRight,
//   BookOpen,
//   Target,
//   CheckCircle,
//   Award,
//   Heart,
//   Share2,
//   PlayCircle,
//   FileText,
//   Download,
//   MessageCircle,
//   MapPin,
//   UserCheck,
//   Shield,
//   ChevronLeft,
//   Video,
//   Play,
//   FileVideo,
//   BarChart,
//   Activity,
//   Zap,
//   Brain,
//   RefreshCw,
//   Target as TargetIcon
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import Navbar from "@/shared/ui/components/Navbar/Navbar";
// import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";

// type Program = {
//   id: number;
//   title: string;
//   description: string;
//   cover_image: string;
//   videos: any[];
//   price: number;
//   status: string;
//   is_approved: number;
//   enrollments_count: number | null;
//   ratings_avg_rating: number | null;
//   ratings_count: number | null;
//   detailed_description?: string;
//   category?: string;
//   difficulty?: "مبتدئ" | "متوسط" | "متقدم";
//   duration?: string;
//   sessions?: number;
//   tags?: string[];
//   objectives?: string[];
//   target_audience?: string[];
//   content?: {
//     week: number;
//     title: string;
//     description: string;
//     duration: string;
//     type: "فيديو" | "نص" | "اختبار";
//   }[];
//   instructor?: {
//     name: string;
//     avatar: string;
//     bio: string;
//     specialization: string;
//     experience: string;
//     rating: number;
//   };
//   requirements?: string[];
//   learning_outcomes?: string[];
//   reviews?: {
//     id: number;
//     user_name: string;
//     user_avatar: string;
//     rating: number;
//     comment: string;
//     date: string;
//   }[];
//   related_programs?: Program[];
// };

// export default function ProgramDetailsPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [isLiked, setIsLiked] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [showAllObjectives, setShowAllObjectives] = useState(false);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["program", id],
//     queryFn: async () => {
//       try {
//         const token = session?.accessToken;
//         const res = await axios.get(
//           `https://mednovacare.com/api/programs/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         return res.data;
//       } catch (err) {
//         console.error("Error fetching program details:", err);
//         throw err;
//       }
//     },
//     enabled: status === "authenticated" && !!id,
//   });

//   const program: Program = data?.data;

//   // Generate placeholder data for missing fields
//   const getProgramWithPlaceholders = (program: Program) => {
//     const defaultCategory = "إعادة تأهيل رياضية";
//     const defaultDifficulty = "متوسط" as const;
//     const defaultDuration = "4 أسابيع";
//     const defaultSessions = 12;
//     const defaultTags = ["تأهيل", "علاج طبيعي", "تمارين", "صحة"];
//     const defaultObjectives = [
//       "تحسين صحة الجهاز اللمفاوي",
//       "تعزيز الدورة الدموية",
//       "تقليل التورم والاحتقان",
//       "زيادة المرونة والحركة",
//       "تحسين جودة الحياة اليومية"
//     ];
//     const defaultTargetAudience = [
//       "مرضى بعد العمليات الجراحية",
//       "الأشخاص الذين يعانون من تورم الأطراف",
//       "كبار السن",
//       "الرياضيون",
//       "الأشخاص الذين يعانون من قلة الحركة"
//     ];
//     const defaultContent = [
//       {
//         week: 1,
//         title: "مقدمة عن الجهاز اللمفاوي",
//         description: "تعلم أساسيات الجهاز اللمفاوي وأهميته للصحة العامة",
//         duration: "45 دقيقة",
//         type: "فيديو" as const
//       },
//       {
//         week: 2,
//         title: "تمارين التنفس العميق",
//         description: "تمارين التنفس التي تساعد على تحسين تدفق الليمف",
//         duration: "60 دقيقة",
//         type: "فيديو" as const
//       },
//       {
//         week: 3,
//         title: "تمارين الذراعين والكتفين",
//         description: "تمارين متخصصة لتحسين تدفق الليمف في المنطقة العلوية",
//         duration: "50 دقيقة",
//         type: "فيديو" as const
//       },
//       {
//         week: 4,
//         title: "تمارين الساقين والقدمين",
//         description: "تمارين لتحسين التدفق الليمفاوي في الأطراف السفلية",
//         duration: "55 دقيقة",
//         type: "فيديو" as const
//       }
//     ];
//     const defaultInstructor = {
//       name: "د. أحمد محمد",
//       avatar: "/images/instructors/default.jpg",
//       bio: "أخصائي علاج طبيعي وتأهيل رياضي مع أكثر من 15 عاماً من الخبرة في مجال إعادة التأهيل والعلاج الطبيعي. متخصص في تأهيل الجهاز اللمفاوي وما بعد العمليات الجراحية.",
//       specialization: "أخصائي علاج طبيعي وتأهيل لمفاوي",
//       experience: "15+ سنة",
//       rating: 4.8
//     };
//     const defaultRequirements = [
//       "ملابس رياضية مريحة",
//       "مكان هادئ لممارسة التمارين",
//       "حصيرة يوغا أو سجادة",
//       "شريط مطاطي (كما موضح في البرنامج)",
//       "جهاز دعم ثابت (كرسي أو حائط)"
//     ];
//     const defaultLearningOutcomes = [
//       "فهم أساسيات الجهاز اللمفاوي ووظائفه",
//       "إتقان تمارين التنفس العميق المحفزة للجهاز اللمفاوي",
//       "القدرة على أداء تمارين الذراعين والكتفين بشكل صحيح",
//       "إتقان تمارين الساقين والقدمين لتحسين التدفق الليمفاوي",
//       "معرفة كيفية دمج هذه التمارين في الروتين اليومي"
//     ];

//     return {
//       ...program,
//       category: program.category || defaultCategory,
//       difficulty: program.difficulty || defaultDifficulty,
//       duration: program.duration || defaultDuration,
//       sessions: program.sessions || defaultSessions,
//       tags: program.tags || defaultTags,
//       objectives: program.objectives || defaultObjectives,
//       target_audience: program.target_audience || defaultTargetAudience,
//       content: program.content || defaultContent,
//       instructor: program.instructor || defaultInstructor,
//       requirements: program.requirements || defaultRequirements,
//       learning_outcomes: program.learning_outcomes || defaultLearningOutcomes,
//       ratings_avg_rating: program.ratings_avg_rating || 0,
//       ratings_count: program.ratings_count || 0,
//       enrollments_count: program.enrollments_count || 0,
//       detailed_description: program.detailed_description || program.description
//     };
//   };

//   const programWithData = program ? getProgramWithPlaceholders(program) : null;

//   if (isLoading) {
//     return <ProgramDetailsSkeleton />;
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-800">
//               حدث خطأ في جلب بيانات البرنامج
//             </h1>
//             <p className="text-gray-600 mt-2">
//               يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.
//             </p>
//             <Button
//               onClick={() => router.push("/programs")}
//               className="mt-6 bg-[#32A88D] hover:bg-[#2a8a7a]"
//             >
//               العودة إلى البرامج
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!programWithData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-800">البرنامج غير موجود</h1>
//             <Button
//               onClick={() => router.push("/programs")}
//               className="mt-6 bg-[#32A88D] hover:bg-[#2a8a7a]"
//             >
//               استعراض جميع البرامج
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar variant="landing" />
//       <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
//         {/* Hero Header with Gradient */}
//         <div className="relative bg-gradient-to-r from-[#32A88D] via-[#2a8a7a] to-[#1f6d5a] text-white overflow-hidden">
//           {/* Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
//             <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
//           </div>

//           <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             {/* Back Button */}
//             <Button
//               onClick={() => router.back()}
//               variant="ghost"
//               className="mb-6 text-white hover:bg-white/10"
//             >
//               <ChevronLeft className="ml-2 w-4 h-4" />
//               العودة
//             </Button>

//             <div className="flex flex-col lg:flex-row lg:items-start gap-8">
//               {/* Program Image */}
//               <div className="lg:w-2/5">
//                 <div className="relative rounded-2xl overflow-hidden shadow-2xl">
//                   <Image
//                     src={programWithData.cover_image || "/images/home/Sports-rehabilitation.jpg"}
//                     alt={programWithData.title}
//                     width={600}
//                     height={400}
//                     className="w-full h-64 lg:h-96 object-cover"
//                   />
//                   <div className="absolute top-4 right-4 flex flex-col gap-2">
//                     {programWithData.status === "published" && programWithData.is_approved === 1 && (
//                       <Badge className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
//                         نشط ومتوفر
//                       </Badge>
//                     )}
//                     <Badge className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
//                       programWithData.difficulty === "مبتدئ" ? "bg-green-500" :
//                       programWithData.difficulty === "متوسط" ? "bg-yellow-500" :
//                       "bg-red-500"
//                     }`}>
//                       {programWithData.difficulty}
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="grid grid-cols-2 gap-4 mt-6">
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
//                     <div className="text-2xl font-bold">{programWithData.sessions}</div>
//                     <div className="text-sm opacity-90">جلسة</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
//                     <div className="text-2xl font-bold">{programWithData.duration}</div>
//                     <div className="text-sm opacity-90">المدة</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
//                     <div className="text-2xl font-bold">{programWithData.enrollments_count}</div>
//                     <div className="text-sm opacity-90">مشترك</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
//                     <div className="flex items-center justify-center gap-1">
//                       <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                       <span className="text-2xl font-bold">
//                         {typeof programWithData.ratings_avg_rating === 'number' 
//                           ? programWithData.ratings_avg_rating.toFixed(1)
//                           : "0.0"}
//                       </span>
//                     </div>
//                     <div className="text-sm opacity-90">التقييم</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Program Info */}
//               <div className="lg:w-3/5">
//                 <div className="mb-6">
//                   <BreadcrumbNav
//                     items={[
//                       { label: "الرئيسية", href: "/" },
//                       { label: "البرامج التأهيلية", href: "/programs" },
//                       { label: programWithData.category, href: `/programs?category=${programWithData.category}` },
//                       { label: programWithData.title, href: `#` },
//                     ]}
//                     className="text-white/80"
//                   />
//                 </div>

//                 <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
//                   {programWithData.title}
//                 </h1>

//                 <p className="text-lg opacity-90 mb-6 leading-relaxed">
//                   {programWithData.description}
//                 </p>

//                 {/* Category and Tags */}
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   <Badge className="bg-white/20 text-white border-0 px-4 py-2">
//                     {programWithData.category}
//                   </Badge>
//                   {programWithData.tags?.slice(0, 3).map((tag, index) => (
//                     <Badge key={index} variant="outline" className="text-white border-white/30">
//                       #{tag}
//                     </Badge>
//                   ))}
//                 </div>

//                 {/* Instructor Info */}
//                 {programWithData.instructor && (
//                   <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm mb-6">
//                     <Avatar className="w-16 h-16 border-2 border-white">
//                       <AvatarImage src={programWithData.instructor.avatar} />
//                       <AvatarFallback className="bg-[#32A88D] text-white">
//                         {programWithData.instructor.name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h4 className="font-bold text-lg">{programWithData.instructor.name}</h4>
//                           <p className="text-sm opacity-90">{programWithData.instructor.specialization}</p>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                           <span className="font-bold">{programWithData.instructor.rating}</span>
//                         </div>
//                       </div>
//                       <p className="text-sm opacity-80 mt-2">{programWithData.instructor.experience} خبرة</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap gap-4">
//                   <Button className="flex-1 min-w-[200px] bg-white text-[#32A88D] hover:bg-gray-100 text-lg h-14 rounded-xl shadow-lg">
//                     <UserCheck className="ml-2 w-5 h-5" />
//                     سجل الآن - ${programWithData.price}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="border-2 border-white text-white hover:bg-white/10 h-14 rounded-xl"
//                     onClick={() => setIsLiked(!isLiked)}
//                   >
//                     <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
//                     {isLiked ? "تم الإعجاب" : "أعجبني"}
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="border-2 border-white text-white hover:bg-white/10 h-14 rounded-xl"
//                   >
//                     <Share2 className="w-5 h-5" />
//                     مشاركة
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Left Column - Main Content */}
//             <div className="lg:w-2/3">
//               {/* Tabs Navigation */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                   <TabsList className="grid grid-cols-5 h-16 bg-gray-50/50">
//                     <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#32A88D] data-[state=active]:shadow-md h-full">
//                       <BookOpen className="w-5 h-5 ml-2" />
//                       نظرة عامة
//                     </TabsTrigger>
//                     <TabsTrigger value="curriculum" className="data-[state=active]:bg-white data-[state=active]:text-[#32A88D] data-[state=active]:shadow-md h-full">
//                       <FileText className="w-5 h-5 ml-2" />
//                       المحتوى التعليمي
//                     </TabsTrigger>
//                     <TabsTrigger value="instructor" className="data-[state=active]:bg-white data-[state=active]:text-[#32A88D] data-[state=active]:shadow-md h-full">
//                       <UserCheck className="w-5 h-5 ml-2" />
//                       المدرب
//                     </TabsTrigger>
//                     <TabsTrigger value="benefits" className="data-[state=active]:bg-white data-[state=active]:text-[#32A88D] data-[state=active]:shadow-md h-full">
//                       <TargetIcon className="w-5 h-5 ml-2" />
//                       الفوائد
//                     </TabsTrigger>
//                     <TabsTrigger value="faq" className="data-[state=active]:bg-white data-[state=active]:text-[#32A88D] data-[state=active]:shadow-md h-full">
//                       <MessageCircle className="w-5 h-5 ml-2" />
//                       الأسئلة الشائعة
//                     </TabsTrigger>
//                   </TabsList>

//                   {/* Overview Tab */}
//                   <TabsContent value="overview" className="p-8">
//                     <div className="space-y-8">
//                       {/* Detailed Description */}
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-800 mb-4">وصف البرنامج</h3>
//                         <div className="bg-gradient-to-r from-[#32A88D]/5 to-transparent p-6 rounded-2xl mb-6">
//                           <p className="text-gray-600 leading-relaxed text-lg">
//                             {programWithData.detailed_description}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Objectives */}
//                       {programWithData.objectives && programWithData.objectives.length > 0 && (
//                         <div>
//                           <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                             <Target className="w-6 h-6 text-[#32A88D]" />
//                             أهداف البرنامج
//                           </h3>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {programWithData.objectives.slice(0, showAllObjectives ? undefined : 4).map((objective, index) => (
//                               <div
//                                 key={index}
//                                 className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-[#32A88D]/5 transition-colors group"
//                               >
//                                 <div className="w-10 h-10 bg-[#32A88D] rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
//                                   {index + 1}
//                                 </div>
//                                 <span className="text-gray-700 font-medium">{objective}</span>
//                               </div>
//                             ))}
//                           </div>
//                           {programWithData.objectives.length > 4 && (
//                             <Button
//                               onClick={() => setShowAllObjectives(!showAllObjectives)}
//                               variant="ghost"
//                               className="mt-4 text-[#32A88D] hover:text-[#2a8a7a]"
//                             >
//                               {showAllObjectives ? "عرض أقل" : `عرض ${programWithData.objectives.length - 4} هدف إضافي`}
//                               <ChevronRight className="w-4 h-4 mr-2 transform rotate-180" />
//                             </Button>
//                           )}
//                         </div>
//                       )}

//                       {/* Target Audience */}
//                       {programWithData.target_audience && programWithData.target_audience.length > 0 && (
//                         <div>
//                           <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                             <Users className="w-6 h-6 text-[#32A88D]" />
//                             الفئة المستهدفة
//                           </h3>
//                           <div className="flex flex-wrap gap-3">
//                             {programWithData.target_audience.map((audience, index) => (
//                               <Badge
//                                 key={index}
//                                 variant="secondary"
//                                 className="rounded-xl px-4 py-3 text-base bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-[#32A88D] hover:to-[#2a8a7a] hover:text-white transition-all duration-300 shadow-sm"
//                               >
//                                 {audience}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>

//                   {/* Curriculum Tab */}
//                   <TabsContent value="curriculum" className="p-8">
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-2xl font-bold text-gray-800">المحتوى التعليمي</h3>
//                         <div className="flex gap-3">
//                           <Button variant="outline" className="gap-2">
//                             <Video className="w-4 h-4" />
//                             {programWithData.videos?.length || 0} فيديو
//                           </Button>
//                           <Button variant="outline" className="gap-2">
//                             <Clock className="w-4 h-4" />
//                             {programWithData.duration}
//                           </Button>
//                         </div>
//                       </div>

//                       <Accordion type="single" collapsible className="space-y-3">
//                         {programWithData.content?.map((item, index) => (
//                           <AccordionItem
//                             key={index}
//                             value={`item-${index}`}
//                             className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#32A88D] transition-colors group"
//                           >
//                             <AccordionTrigger className="px-6 py-4 hover:no-underline group-hover:bg-gray-50/50">
//                               <div className="flex items-center gap-4 flex-1 text-right">
//                                 <div className="relative">
//                                   <div className="w-12 h-12 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-xl flex items-center justify-center text-white font-bold">
//                                     {item.week}
//                                   </div>
//                                   {item.type === "فيديو" && (
//                                     <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
//                                       <Play className="w-3 h-3 text-white" />
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div className="flex-1">
//                                   <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
//                                   <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
//                                     <span className="flex items-center gap-1">
//                                       <Clock className="w-4 h-4" />
//                                       {item.duration}
//                                     </span>
//                                     <Badge
//                                       variant="outline"
//                                       className={
//                                         item.type === "فيديو" ? "border-red-500 text-red-500 bg-red-50" :
//                                         item.type === "اختبار" ? "border-yellow-500 text-yellow-500 bg-yellow-50" :
//                                         "border-blue-500 text-blue-500 bg-blue-50"
//                                       }
//                                     >
//                                       {item.type}
//                                     </Badge>
//                                   </div>
//                                 </div>
//                               </div>
//                             </AccordionTrigger>
//                             <AccordionContent className="px-6 pb-4">
//                               <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                                 <p className="text-gray-600">{item.description}</p>
//                               </div>
//                               <div className="flex gap-3">
//                                 <Button className="gap-2 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D]">
//                                   <PlayCircle className="w-4 h-4" />
//                                   مشاهدة الفيديو
//                                 </Button>
//                                 <Button variant="outline" className="gap-2">
//                                   <FileText className="w-4 h-4" />
//                                   عرض الملاحظات
//                                 </Button>
//                               </div>
//                             </AccordionContent>
//                           </AccordionItem>
//                         ))}
//                       </Accordion>
//                     </div>
//                   </TabsContent>

//                   {/* Instructor Tab */}
//                   <TabsContent value="instructor" className="p-8">
//                     {programWithData.instructor && (
//                       <div className="space-y-8">
//                         <div className="flex flex-col md:flex-row gap-8 items-start">
//                           <div className="md:w-1/3">
//                             <div className="relative">
//                               <Avatar className="w-48 h-48 border-4 border-[#32A88D]/20 shadow-xl">
//                                 <AvatarImage src={programWithData.instructor.avatar} />
//                                 <AvatarFallback className="bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] text-white text-6xl">
//                                   {programWithData.instructor.name.charAt(0)}
//                                 </AvatarFallback>
//                               </Avatar>
//                               <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white px-4 py-2 rounded-full shadow-lg">
//                                 <span className="font-bold">مدرب معتمد</span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="md:w-2/3">
//                             <div className="flex items-start justify-between mb-4">
//                               <div>
//                                 <h3 className="text-3xl font-bold text-gray-800 mb-2">
//                                   {programWithData.instructor.name}
//                                 </h3>
//                                 <p className="text-xl text-[#32A88D] font-medium mb-4">
//                                   {programWithData.instructor.specialization}
//                                 </p>
//                               </div>
//                               <div className="flex flex-col items-center bg-gradient-to-r from-[#32A88D]/10 to-[#2a8a7a]/10 px-4 py-3 rounded-xl">
//                                 <div className="flex items-center gap-1">
//                                   <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
//                                   <span className="font-bold text-xl">{programWithData.instructor.rating}</span>
//                                 </div>
//                                 <div className="text-sm text-gray-600">التقييم</div>
//                               </div>
//                             </div>
//                             <div className="bg-gray-50 rounded-2xl p-6 mb-6">
//                               <p className="text-gray-600 leading-relaxed text-lg">
//                                 {programWithData.instructor.bio}
//                               </p>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4 mb-6">
//                               <div className="bg-gradient-to-r from-[#32A88D]/5 to-transparent p-4 rounded-xl">
//                                 <div className="text-sm text-gray-500">سنوات الخبرة</div>
//                                 <div className="text-2xl font-bold text-[#32A88D]">
//                                   {programWithData.instructor.experience}
//                                 </div>
//                               </div>
//                               <div className="bg-gradient-to-r from-[#32A88D]/5 to-transparent p-4 rounded-xl">
//                                 <div className="text-sm text-gray-500">البرامج التعليمية</div>
//                                 <div className="text-2xl font-bold text-[#32A88D]">15+</div>
//                               </div>
//                             </div>
//                             <Button className="gap-2 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D]">
//                               <MessageCircle className="w-5 h-5" />
//                               تواصل مع المدرب
//                             </Button>
//                           </div>
//                         </div>

//                         <Separator />

//                         <div>
//                           <h4 className="text-2xl font-bold text-gray-800 mb-6">شهادات المدرب</h4>
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             {[
//                               { title: "دكتوراه في العلاج الطبيعي", icon: Award },
//                               { title: "اختصاصي تأهيل رياضي", icon: Activity },
//                               { title: "مدرب معتمد دولياً", icon: Shield }
//                             ].map((cert, index) => (
//                               <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-[#32A88D]/5 hover:to-transparent transition-all group">
//                                 <div className="w-12 h-12 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
//                                   <cert.icon className="w-6 h-6" />
//                                 </div>
//                                 <span className="text-gray-700 font-medium">{cert.title}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </TabsContent>

//                   {/* Benefits Tab */}
//                   <TabsContent value="benefits" className="p-8">
//                     <div className="space-y-8">
//                       <h3 className="text-2xl font-bold text-gray-800 mb-6">فوائد البرنامج</h3>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {[
//                           { icon: RefreshCw, title: "تحسين الدورة الدموية", description: "تعزيز تدفق الدم والأكسجين إلى جميع أجزاء الجسم" },
//                           { icon: Brain, title: "تعزيز صحة الجهاز اللمفاوي", description: "تحسين وظائف الجهاز اللمفاوي والتخلص من السموم" },
//                           { icon: Zap, title: "زيادة مستويات الطاقة", description: "تقليل التعب وزيادة النشاط والحيوية اليومية" },
//                           { icon: Activity, title: "تقليل التورم والاحتقان", description: "تخفيف التورم في الأطراف وتحسين حركة المفاصل" },
//                           { icon: BarChart, title: "تحسين جودة النوم", description: "تقليل الألم وزيادة الراحة مما يؤدي لنوم أفضل" },
//                           { icon: Target, title: "تعزيز المناعة", description: "تحسين أداء الجهاز المناعي لمقاومة الأمراض" }
//                         ].map((benefit, index) => (
//                           <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
//                             <div className="flex items-start gap-4">
//                               <div className="w-14 h-14 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
//                                 <benefit.icon className="w-7 h-7" />
//                               </div>
//                               <div className="flex-1">
//                                 <h4 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h4>
//                                 <p className="text-gray-600">{benefit.description}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Learning Outcomes */}
//                       {programWithData.learning_outcomes && programWithData.learning_outcomes.length > 0 && (
//                         <div>
//                           <h3 className="text-2xl font-bold text-gray-800 mb-6 mt-8">مخرجات التعلم</h3>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {programWithData.learning_outcomes.map((outcome, index) => (
//                               <div
//                                 key={index}
//                                 className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#32A88D]/5 to-transparent rounded-xl group hover:from-[#32A88D]/10 transition-all"
//                               >
//                                 <div className="w-8 h-8 bg-[#32A88D] rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
//                                   {index + 1}
//                                 </div>
//                                 <span className="text-gray-700 font-medium">{outcome}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>

//                   {/* FAQ Tab */}
//                   <TabsContent value="faq" className="p-8">
//                     <div className="space-y-6">
//                       <h3 className="text-2xl font-bold text-gray-800 mb-6">الأسئلة الشائعة</h3>
//                       <Accordion type="single" collapsible className="space-y-3">
//                         {[
//                           {
//                             question: "كيف يمكنني التسجيل في البرنامج؟",
//                             answer: "يمكنك التسجيل من خلال الضغط على زر 'سجل الآن' وإكمال عملية الدفع. ستتلقى رسالة تأكيد بالبريد الإلكتروني مع تفاصيل الوصول للبرنامج."
//                           },
//                           {
//                             question: "هل يمكنني الحصول على استرداد كامل للمبلغ؟",
//                             answer: "نعم، لدينا سياسة استرداد كامل للمبلغ خلال 30 يوم من تاريخ التسجيل إذا لم تكن راضياً عن البرنامج."
//                           },
//                           {
//                             question: "كم مدة صلاحية الوصول لمحتوى البرنامج؟",
//                             answer: "الوصول للمحتوى مدى الحياة بعد التسجيل، بما في ذلك التحديثات المستقبلية."
//                           },
//                           {
//                             question: "هل البرنامج مناسب للمبتدئين؟",
//                             answer: "نعم، البرنامج مصمم ليتناسب مع جميع المستويات، ويبدأ من الأساسيات حتى المستوى المتقدم."
//                           },
//                           {
//                             question: "هل يمكنني الحصول على شهادة إتمام؟",
//                             answer: "نعم، ستتلقى شهادة إتمام معتمدة بعد إنهاء جميع متطلبات البرنامج بنجاح."
//                           },
//                           {
//                             question: "كم ساعة في الأسبوع أحتاج لمتابعة البرنامج؟",
//                             answer: "نوصي بمتابعة 2-3 ساعات أسبوعياً لمدة 4 أسابيع للحصول على أفضل النتائج."
//                           },
//                           {
//                             question: "هل أحتاج إلى معدات خاصة؟",
//                             answer: "كل ما تحتاجه هو شريط مطاطي وكرسي أو حائط للاستناد عليه، كما موضح في متطلبات البرنامج."
//                           }
//                         ].map((faq, index) => (
//                           <AccordionItem
//                             key={index}
//                             value={`faq-${index}`}
//                             className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#32A88D] transition-colors"
//                           >
//                             <AccordionTrigger className="px-6 py-4 hover:no-underline text-lg font-medium">
//                               {faq.question}
//                             </AccordionTrigger>
//                             <AccordionContent className="px-6 pb-4 text-gray-600">
//                               {faq.answer}
//                             </AccordionContent>
//                           </AccordionItem>
//                         ))}
//                       </Accordion>
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </div>

//               {/* Requirements Section */}
//               {programWithData.requirements && programWithData.requirements.length > 0 && (
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
//                   <h3 className="text-2xl font-bold text-gray-800 mb-6">المتطلبات الأساسية</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {programWithData.requirements.map((req, index) => (
//                       <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-[#32A88D]/5 hover:to-transparent transition-all">
//                         <div className="w-12 h-12 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-lg flex items-center justify-center text-white">
//                           <CheckCircle className="w-6 h-6" />
//                         </div>
//                         <span className="text-gray-700 font-medium">{req}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Column - Sidebar */}
//             <div className="lg:w-1/3">
//               <div className="sticky top-24 space-y-6">
//                 {/* Enrollment Card */}
//                 <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//                   <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] p-6 text-center relative overflow-hidden">
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
//                     <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
//                     <div className="relative z-10">
//                       <div className="text-5xl font-bold text-white mb-2">${programWithData.price}</div>
//                       <div className="text-white/90">للبرنامج كاملاً</div>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <Button className="w-full cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white py-6 text-lg font-bold rounded-xl mb-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
//                       <UserCheck className="ml-2 w-5 h-5" />
//                       سجل الآن
//                     </Button>

//                     <div className="space-y-4 mb-6">
//                       {[
//                         { icon: Shield, text: "ضمان استرداد 30 يوم", color: "text-green-600", bg: "bg-green-50" },
//                         { icon: Clock, text: "الوصول مدى الحياة", color: "text-blue-600", bg: "bg-blue-50" },
//                         { icon: Download, text: "تحميل المحتوى", color: "text-purple-600", bg: "bg-purple-50" },
//                         { icon: Award, text: "شهادة إتمام", color: "text-yellow-600", bg: "bg-yellow-50" },
//                         { icon: MessageCircle, text: "دعم فني متاح", color: "text-red-600", bg: "bg-red-50" }
//                       ].map((item, index) => (
//                         <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:shadow-sm transition-shadow">
//                           <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
//                             <item.icon className={`w-5 h-5 ${item.color}`} />
//                           </div>
//                           <span className="text-gray-700 font-medium">{item.text}</span>
//                         </div>
//                       ))}
//                     </div>

//                     <Separator className="my-6" />

//                     <div className="space-y-4">
//                       <h4 className="font-bold text-gray-800 mb-4">ماذا ستحصل عليه:</h4>
//                       {[
//                         `${programWithData.sessions} جلسة تعليمية`,
//                         "مشروع تطبيقي عملي",
//                         "تمارين وتطبيقات تفاعلية",
//                         "دعم مباشر من المدرب",
//                         "مجتمع تعليمي تفاعلي",
//                         "موارد إضافية قابلة للتحميل"
//                       ].map((item, index) => (
//                         <div key={index} className="flex items-center gap-3">
//                           <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
//                             <CheckCircle className="w-4 h-4 text-green-600" />
//                           </div>
//                           <span className="text-gray-600">{item}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Support Card */}
//                 <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                       <MessageCircle className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">هل تحتاج مساعدة؟</h3>
//                       <p className="opacity-90">فريق الدعم متاح 24/7</p>
//                     </div>
//                   </div>
//                   <Button
//                     variant="outline"
//                     className="w-full bg-white/20 hover:bg-white/30 text-white border-white rounded-xl py-6 backdrop-blur-sm"
//                   >
//                     تواصل مع الدعم
//                   </Button>
//                 </div>

//                 {/* Program Stats */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//                   <h3 className="font-bold text-gray-800 mb-4">إحصائيات البرنامج</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex justify-between text-sm text-gray-500 mb-1">
//                         <span>معدل الإكمال</span>
//                         <span>85%</span>
//                       </div>
//                       <Progress value={85} className="h-2 bg-gray-100">
//                         <div className="h-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full" style={{ width: '85%' }}></div>
//                       </Progress>
//                     </div>
//                     <div>
//                       <div className="flex justify-between text-sm text-gray-500 mb-1">
//                         <span>رضا العملاء</span>
//                         <span>94%</span>
//                       </div>
//                       <Progress value={94} className="h-2 bg-gray-100">
//                         <div className="h-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full" style={{ width: '94%' }}></div>
//                       </Progress>
//                     </div>
//                     <div>
//                       <div className="flex justify-between text-sm text-gray-500 mb-1">
//                         <span>تحقيق الأهداف</span>
//                         <span>89%</span>
//                       </div>
//                       <Progress value={89} className="h-2 bg-gray-100">
//                         <div className="h-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full" style={{ width: '89%' }}></div>
//                       </Progress>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // Skeleton Loading Component
// function ProgramDetailsSkeleton() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
//       <Navbar variant="landing" />
      
//       {/* Hero Skeleton */}
//       <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row lg:items-start gap-8">
//             {/* Image Skeleton */}
//             <div className="lg:w-2/5">
//               <Skeleton className="h-64 lg:h-96 w-full rounded-2xl bg-white/20" />
//               <div className="grid grid-cols-2 gap-4 mt-6">
//                 {[...Array(4)].map((_, i) => (
//                   <Skeleton key={i} className="h-20 rounded-xl bg-white/20" />
//                 ))}
//               </div>
//             </div>

//             {/* Content Skeleton */}
//             <div className="lg:w-3/5">
//               <Skeleton className="h-4 w-48 mb-6 bg-white/20" />
//               <Skeleton className="h-10 w-3/4 mb-4 bg-white/20" />
//               <Skeleton className="h-6 w-full mb-6 bg-white/20" />
//               <Skeleton className="h-6 w-64 mb-6 bg-white/20" />
              
//               {/* Instructor Skeleton */}
//               <Skeleton className="h-24 w-full rounded-xl bg-white/20 mb-6" />
              
//               {/* Buttons Skeleton */}
//               <div className="flex gap-4">
//                 <Skeleton className="h-14 flex-1 min-w-[200px] rounded-xl bg-white/20" />
//                 <Skeleton className="h-14 w-32 rounded-xl bg-white/20" />
//                 <Skeleton className="h-14 w-32 rounded-xl bg-white/20" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content Skeleton */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Main Content Skeleton */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
//               {/* Tabs Skeleton */}
//               <Skeleton className="h-16 w-full mb-8 rounded-xl" />
              
//               {/* Content Skeleton */}
//               <div className="space-y-8">
//                 <Skeleton className="h-6 w-48 mb-4" />
//                 <Skeleton className="h-4 w-full mb-2" />
//                 <Skeleton className="h-4 w-full mb-2" />
//                 <Skeleton className="h-4 w-2/3 mb-8" />
                
//                 <Skeleton className="h-6 w-64 mb-4" />
//                 <div className="grid grid-cols-2 gap-4">
//                   {[...Array(4)].map((_, i) => (
//                     <Skeleton key={i} className="h-24 rounded-xl" />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar Skeleton */}
//           <div className="lg:w-1/3">
//             <div className="sticky top-24 space-y-6">
//               <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//                 <Skeleton className="h-32 w-full" />
//                 <div className="p-6">
//                   <Skeleton className="h-14 w-full rounded-xl mb-4" />
//                   <div className="space-y-4 mb-6">
//                     {[...Array(5)].map((_, i) => (
//                       <Skeleton key={i} className="h-10 w-full" />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }