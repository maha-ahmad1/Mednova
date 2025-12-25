// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Logo } from "@/shared/ui/Logo";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, Menu, X } from "lucide-react";
// import Link from "next/link";

// const NavLink = [
//   {
//     id: 1,
//     title: "الرئيسية",
//     link: "/",
//   },
//   {
//     id: 2,
//     title: "خدماتنا",
//     link: "#",
//     dropdown: [
//       { id: 1, title: "حجز موعد", link: "#" },
//       { id: 2, title: "استشارات", link: "#" },
//       { id: 3, title: "برنامج رحلة التعافي", link: "#" },
//     ],
//   },
//   {
//     id: 3,
//     title: "التخصصات",
//     link: "#",
//     dropdown: [
//       { id: 1, title: "العلاج العضلي الهيكلي", link: "#" },
//       { id: 2, title: "العلاج العصبي", link: "#" },
//       { id: 3, title: "علاج الأطفال", link: "#" },
//       { id: 4, title: "العلاج بعد العمليات", link: "#" },
//       { id: 5, title: "العلاج اليدوي", link: "#" },
//       { id: 6, title: "العلاج بالأجهزة", link: "#" },
//       { id: 7, title: "إعادة التأهيل الوظيفي", link: "#" },
//       { id: 8, title: "العلاج القلبي التنفسي", link: "#" },
//     ],
//   },
//   {
//     id: 4,
//     title: "الأجهزة",
//     link: "#",
//     dropdown: [{ id: 1, title: "جهاز القفاز الذكي", link: "#" }],
//   },
//   {
//     id: 5,
//     title: "المختصين",
//     link: "/therapistsAndCenters",
//   },
// ];

// export default function LandingNavbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       {/* Navbar — Large Screens */}
//       <header className="flex items-center justify-between py-6">
//         {/* الشعار */}
//         <div className="flex items-center">
//           <Logo />
//         </div>

//         {/* روابط التنقل */}
//         <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
//           {NavLink.map((link) => (
//             <div key={link.id} className="relative group">
//               {link.dropdown ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
//                     >
//                       {link.title}
//                       <ChevronDown className="w-4 h-4 transition-transform duration-200" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     align="end"
//                     className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-2"
//                   >
//                     {link.dropdown.map((item) => (
//                       <DropdownMenuItem
//                         key={item.id}
//                         className="flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-[#32A88D]/10 hover:text-[#32A88D] cursor-pointer transition-all duration-200"
//                       >
//                         <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
//                         <span className="text-sm font-medium">
//                           {item.title}
//                         </span>
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link
//                   href={link.link}
//                   className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
//                 >
//                   {link.title}
//                 </Link>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* أزرار تسجيل الدخول */}
//         <div className="hidden lg:flex items-center gap-3">
//           <Button
//             variant="outline"
//             className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
//             asChild
//           >
//             <Link href="/login">تسجيل دخول</Link>
//           </Button>
//         </div>

//         {/* زر القائمة للموبايل */}
//         <div className="lg:hidden">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsOpen(!isOpen)}
//             className="text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl"
//           >
//             {isOpen ? (
//               <X className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </Button>
//         </div>
//       </header>

//       {/* القائمة الجانبية - موبايل */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden">
//           <div className="bg-white w-80 h-full rtl:right-0 ltr:left-0 shadow-2xl relative">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <Logo />
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsOpen(false)}
//                 className="text-gray-600 hover:text-[#32A88D] rounded-xl"
//               >
//                 <X className="w-6 h-6" />
//               </Button>
//             </div>

//             <nav className="flex flex-col gap-1 p-4">
//               {NavLink.map((link) => (
//                 <div
//                   key={link.id}
//                   className="border-b border-gray-100 last:border-b-0"
//                 >
//                   {link.dropdown ? (
//                     <details className="group">
//                       <summary className="flex items-center justify-between p-4 text-gray-700 hover:text-[#32A88D] cursor-pointer list-none">
//                         <span className="font-medium">{link.title}</span>
//                         <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
//                       </summary>
//                       <div className="pr-4 pb-2 space-y-1">
//                         {link.dropdown.map((item) => (
//                           <Link
//                             key={item.id}
//                             href={item.link}
//                             className="block p-3 text-sm text-gray-600 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200"
//                             onClick={() => setIsOpen(false)}
//                           >
//                             {item.title}
//                           </Link>
//                         ))}
//                       </div>
//                     </details>
//                   ) : (
//                     <Link
//                       href={link.link}
//                       className="flex items-center p-4 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200 font-medium"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       {link.title}
//                     </Link>
//                   )}
//                 </div>
//               ))}
//             </nav>

//             <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
//               <Button
//                 className="w-full bg-[#32A88D] hover:bg-[#2a8a7a] text-white rounded-xl py-3 transition-all duration-200"
//                 asChild
//               >
//                 <Link href="/login" onClick={() => setIsOpen(false)}>
//                   تسجيل دخول
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
