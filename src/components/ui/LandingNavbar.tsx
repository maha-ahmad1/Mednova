// src/components/LandingNavbar.jsx
"use client";
import { useState } from "react";
import { Logo } from "@/shared/ui/Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Menu, X } from "lucide-react";
import Link from "next/link";

const NavLink = [
  {
    id: 1,
    title: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    title: "خدماتنا",
    link: "#",
    dropdown: [
      { id: 1, title: "حجز موعد", link: "#" },
      {
        id: 2,
        title: "استشارات",
        link: "#",
      },
      {
        id: 3,
        title: "برنامج رحلة التعافي",
        link: "#",
      },
    ],
  },
  {
    id: 3,
    title: "التخصصات",
    link: "#",
    dropdown: [
      { id: 1, title: "العلاج العضلي الهيكلي", link: "#" },
      {
        id: 2,
        title: "العلاج العصبي",
        link: "#",
      },
      {
        id: 3,
        title: "علاج الأطفال (الاضطرابات الحركية)",
        link: "#",
      },
      {
        id: 4,
        title: "العلاج بعد العمليات والجراحة",
        link: "#",
      },
      {
        id: 5,
        title: "العلاج اليدوي (Manual Therapy)",
        link: "#",
      },
      {
        id: 6,
        title: "العلاج باستخدام الأجهزة (الكهربائي، الموجات، الليزر)",
        link: "#",
      },
      {
        id: 7,
        title: "إعادة التأهيل الوظيفي",
        link: "#",
      },
      {
        id: 8,
        title: "العلاج القلبي التنفسي",
        link: "#",
      },
    ],
  },
  {
    id: 4,
    title: "الأجهزة",
    link: "#",
    dropdown: [
      {
        id: 1,
        title: "جهاز القفاز الذكي",
        link: "#",
      },
    ],
  },
  {
    id: 5,
    title: "المختصين",
    link: "/therapistsAndCenters",
  },
];

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 ">
      <div className="text-lg font-bold">
        <Logo />
      </div>

      <div>
        <ul className="hidden md:flex">
          {NavLink.map((link) => {
            return (
              <li key={link.id}>
                {link.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="mx-2   hover:border-b-2 hover:border-b-secondary  mt-1  flex items-center gap-0.5 "
                    >
                      <Link
                        href={link.link}
                        className=" font-medium text-[#424952]"
                      >
                        {link.title}
                        <ChevronDownIcon className="w-4 h-4 mt-1  " />
                      </Link>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {link.dropdown.map((item) => {
                        return (
                          <DropdownMenuItem key={item.id}>
                            {item.title}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={link.link}
                    className=" font-medium text-[#4B5563] mx-2   hover:border-b-2 hover:border-b-secondary  mt-1 flex items-center"
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="hidden md:flex gap-6 items-center">
        <button className="text-secondary rounded-lg border border-secondary px-4 py-2 ">
          <Link href="/login">تسجيل دخول</Link>
        </button>
      </div>
      <div className="md:hidden p-4 flex justify-between items-center">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/20">
            <div className="bg-white w-64 h-full p-4 shadow-md relative">
              <div className="flex items-center justify-between border-b-2">
                <div className="">
                  <Logo />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className=" text-gray-600 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <ul className="flex flex-col gap-2 mt-12">
                {NavLink.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.link}
                      className="p-2 hover:bg-gray-100 rounded flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                      {link.dropdown && (
                        <span className="ml-2">
                          <ChevronDownIcon />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>

    // <nav className="bg-white shadow-md fixed w-full z-50 ">
    //   <div className="container mx-auto px-4 flex items-center justify-between ">
    //     <div className="flex  items-center justify-center gap-1">
    //       <div className="">
    //         <Logo />
    //       </div>
    //       <div>
    //         <ul className="hidden lg:flex">
    //           {NavLink.map((link) => {
    //             return (
    //               <li key={link.id}>
    //                 {link.dropdown ? (
    //                   <DropdownMenu>
    //                     <DropdownMenuTrigger
    //                       asChild
    //                       className="mx-2   hover:border-b-2 hover:border-b-secondary  mt-1  flex items-center gap-0.5 "
    //                     >
    //                       <Link href={link.link} className=" font-medium text-[#424952]">
    //                         {link.title}
    //                         <ChevronDownIcon className="w-4 h-4 mt-1  " />
    //                       </Link>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent>
    //                       {link.dropdown.map((item) => {
    //                         return (
    //                           <DropdownMenuItem key={item.id}>
    //                             {item.title}
    //                           </DropdownMenuItem>
    //                         );
    //                       })}
    //                     </DropdownMenuContent>
    //                   </DropdownMenu>
    //                 ) : (
    //                   <Link
    //                     href={link.link}
    //                     className=" font-medium text-[#4B5563] mx-2   hover:border-b-2 hover:border-b-secondary  mt-1 flex items-center"
    //                   >
    //                     {link.title}
    //                   </Link>
    //                 )}
    //               </li>
    //             );
    //           })}
    //         </ul>
    //       </div>
    //     </div>
    //     <div className="hidden md:flex gap-6 items-center">
    //       <button className="text-secondary rounded-lg border border-secondary px-4 py-2 ">
    //         <Link href="/auth/login">تسجيل دخول</Link>
    //       </button>
    //       <button className="bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-lg hover:brightness-90 transition">
    //         <Link href="/auth/register">إنشاء حساب</Link>
    //       </button>
    //     </div>
    //     <div className="lg:hidden p-4 flex justify-between items-center">
    //       <button onClick={() => setIsOpen(!isOpen)}>
    //         {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    //       </button>
    //       {isOpen && (
    //         <div className="fixed inset-0 z-50 bg-black/20">
    //           <div className="bg-white w-64 h-full p-4 shadow-md relative">
    //             <div className="flex items-center justify-between border-b-2">
    //               <div className="">
    //                 <Logo />
    //               </div>
    //               <button
    //                 onClick={() => setIsOpen(false)}
    //                 className=" text-gray-600 hover:text-black"
    //               >
    //                 <X className="w-6 h-6" />
    //               </button>
    //             </div>

    //             <ul className="flex flex-col gap-2 mt-12">
    //               {NavLink.map((link) => (
    //                 <li key={link.id}>
    //                   <Link
    //                     href={link.link}
    //                     className="p-2 hover:bg-gray-100 rounded flex items-center justify-between"
    //                     onClick={() => setIsOpen(false)}
    //                   >
    //                     {link.title}
    //                     {link.dropdown && (
    //                       <span className="ml-2">
    //                         <ChevronDownIcon />
    //                       </span>
    //                     )}
    //                   </Link>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </nav>
  );
}
