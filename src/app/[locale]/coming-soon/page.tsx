// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Hourglass, Mail, Bell, Sparkles } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import Navbar from "@/shared/ui/components/Navbar/Navbar";
// import { Twitter, Linkedin, Instagram, Phone } from "lucide-react";

// export default function ComingSoon() {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // هنا يمكن إضافة منطق الاشتراك في القائمة البريدية
//     console.log("Email submitted:", email);
//     setEmail("");
//     // يمكن إضافة إشعار نجاح
//   };

//   return (
//     <>
//       <Navbar variant="landing" />

//       <section className="relative  py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden flex items-center">
//         {/* أشكال خلفية دائرية */}
//         <div className="absolute top-0 left-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
//         <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>
//         <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-200/10 rounded-full blur-3xl"></div>

//         <div className="relative z-10 max-w-7xl mx-auto w-full">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
//             {/* الجانب الأيمن - النص والتفاعل */}
//             <div className="lg:col-span-7 text-center lg:text-right order-2 lg:order-1">
//               {/* شارة "قريباً" */}
//               <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
//                 <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
//                 <span>قريباً</span>
//               </div>

//               {/* العنوان الرئيسي */}
//               <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
//                 شيء{" "}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]">
//                   مذهل
//                 </span>{" "}
//                 قادم إليك!
//               </h2>

//               {/* الخط الفاصل */}
//               <div className="w-20 h-1.5 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full mb-8 mx-auto lg:mx-0"></div>

//               {/* الوصف */}
//               <p className="text-lg text-gray-600 leading-8 mb-8 max-w-2xl mx-auto lg:mx-0">
//                 نحن نعمل على تطوير منصة متكاملة تجمع بين أفضل أخصائيي العلاج
//                 الطبيعي والتأهيلي في مكان واحد. استعد لتجربة صحية ذكية وسهلة تضع
//                 راحتك في المقدمة.
//               </p>

//               {/* العد التنازلي البسيط (يمكن إضافته لاحقاً) أو نموذج الاشتراك */}
//               <div className="max-w-md mx-auto lg:mx-0 mb-8">
//                 {/* <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
//                 <div className="flex-1 relative">
//                   <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <Input
//                     type="email"
//                     placeholder="أدخل بريدك الإلكتروني"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="w-full pr-10 py-6 text-right bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-[#32A88D] focus:border-transparent"
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-6 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   <Bell className="ml-2 w-5 h-5" />
//                   نبهني عند الإطلاق
//                 </Button>
//               </form> */}
//                 <p className="text-sm text-gray-500 mt-3 text-right">
//                   سنخبرك فور إطلاق المنصة. لا تقلق، لن نرسل لك أي بريد مزعج.
//                 </p>
//               </div>

//               {/* روابط التواصل الاجتماعي (اختياري) */}
//               <div className="flex items-center gap-4 justify-center lg:justify-start">
//                 <span className="text-gray-600 text-sm">تابعنا على:</span>
//                 <div className="flex gap-3 mb-6">
//                   {/* واتساب */}
//                   {/* واتساب */}
//                   <a
//                     href="https://wa.me/96892349692"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 bg-[#25D366] hover:bg-[#1ebe57] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
//                   >
//                     <Phone className="h-5 w-5 text-white" />
//                   </a>

//                   {/* X / تويتر */}
//                   <a
//                     href="https://x.com/mednova_om?s=11"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 bg-[#1DA1F2] hover:bg-[#0d8ddb] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
//                   >
//                     <Twitter className="h-5 w-5 text-white" />
//                   </a>

//                   {/* لينكدإن */}
//                   <a
//                     href="https://www.linkedin.com/in/mednova-oman-1242a937b/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 bg-[#0077B5] hover:bg-[#005983] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
//                   >
//                     <Linkedin className="h-5 w-5 text-white" />
//                   </a>

//                   {/* إنستجرام */}
//                   <a
//                     href="https://www.instagram.com/mednova.om/?hl=en"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-10 h-10 bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1"
//                   >
//                     <Instagram className="h-5 w-5 text-white" />
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* الجانب الأيسر - الصورة أو الأيقونة */}
//             <div className="lg:col-span-5 relative order-1 lg:order-2">
//               <div className="relative w-full max-w-md mx-auto">
//                 {/* شكل خلفي متحرك */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 rounded-full blur-3xl -z-10 transform scale-150"></div>

//                 {/* العنصر المرئي الرئيسي - أيقونة الساعة الرملية بشكل دائري كبير */}
//                 <div className="relative bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
//                   <div className="flex flex-col items-center">
//                     <div className="w-40 h-40 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center mb-6 shadow-xl animate-float">
//                       <Hourglass className="w-20 h-20 text-white" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                       قيد الإعداد
//                     </h3>
//                     <p className="text-gray-600 text-center">
//                       فريقنا يعمل بكل شغف لتقديم الأفضل لك
//                     </p>

//                     {/* نقاط متحركة للدلالة على العمل */}
//                     <div className="flex gap-2 mt-6">
//                       <div className="w-3 h-3 bg-[#32A88D] rounded-full animate-pulse"></div>
//                       <div
//                         className="w-3 h-3 bg-[#32A88D] rounded-full animate-pulse"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                       <div
//                         className="w-3 h-3 bg-[#32A88D] rounded-full animate-pulse"
//                         style={{ animationDelay: "0.4s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* عناصر عائمة صغيرة */}
//                 <div className="absolute -top-4 -right-4 z-20">
//                   <div className="bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-float">
//                     <Sparkles className="w-5 h-5 text-[#32A88D]" />
//                     <span className="text-sm font-medium">تجربة فريدة</span>
//                   </div>
//                 </div>
//                 <div className="absolute -bottom-4 -left-4 z-20">
//                   <div
//                     className="bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-float"
//                     style={{ animationDelay: "1s" }}
//                   >
//                     <Bell className="w-5 h-5 text-[#32A88D]" />
//                     <span className="text-sm font-medium">إشعارات ذكية</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* شريط العلامات التجارية أو شركاء (اختياري) */}
//           {/* <div className="mt-20 text-center">
//           <p className="text-sm text-gray-500 mb-4">شركاء النجاح</p>
//           <div className="flex flex-wrap justify-center gap-8 opacity-50">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="w-16 h-16 bg-gray-200 rounded-full"></div>
//             ))}
//           </div>
//         </div> */}
//         </div>

//         {/* أنيميشن للعناصر العائمة */}
//         <style jsx>{`
//           @keyframes float {
//             0%,
//             100% {
//               transform: translateY(0px);
//             }
//             50% {
//               transform: translateY(-10px);
//             }
//           }
//           .animate-float {
//             animation: float 3s ease-in-out infinite;
//           }
//         `}</style>
//       </section>
//     </>
//   );
// }



import React from 'react'
import ComingSoon from '@/features/pages/ComingSoon';
export default function Page() {
  return <ComingSoon />;
}