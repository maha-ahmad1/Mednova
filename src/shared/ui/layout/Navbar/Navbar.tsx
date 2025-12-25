"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/shared/ui/components/Logo";
import { ChevronDown, Menu,
  HelpCircle,
  User,
  LogOut,
  Settings,
  Bell, } from "lucide-react";
import { NavLinks } from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { useSession, signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { NotificationDropdown } from "@/features/notifications/components/NotificationDropdown";


export default function Navbar() {
    const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between  px-4  lg:px-16">
        {/* الشعار */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* روابط التنقل - شاشات كبيرة */}
        <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
          {NavLinks.map((link) => (
            <div key={link.id} className="relative group">
              {link.dropdown ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D]  px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                    >
                      {link.title}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl p-2"
                  >
                    {link.dropdown.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-3 rounded-xl  hover:text-[#32A88D] cursor-pointer transition-all duration-200 text-right"
                        asChild
                      >
                        <Link href={item.link}>
                          <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href={link.link}
                  className="flex items-center gap-1 text-gray-700 hover:text-[#32A88D]  px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

       
             {session?.user ? (
               <div className="flex items-center gap-2">
               <NotificationDropdown/>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <button className="flex items-center gap-2 group">
                       {session.user.image ? (
                         <Image
                           src={session.user.image}
                           width={38}
                           height={38}
                           alt="User Image"
                           className="mb-1 rounded-full border-2 border-gray-300 object-cover !w-10 !h-10  cursor-pointer"
                         />
                       ) : (
                         <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold cursor-pointer">
                           {session.user.name?.[0] || "U"}
                         </div>
                       )}
                     </button>
                   </DropdownMenuTrigger>
       
                   <DropdownMenuContent
                     align="end"
                     sideOffset={0}
                     className=" text-right w-37 bg-white/80 backdrop-blur-lg 
                      border-gray-200/60 rounded-md shadow-md p-1"
                   >
                     <DropdownMenuItem
                       className="flex items-center gap-2 px-3 py-2 rounded-md 
                        hover:bg-gray-100/60 text-gray-700 transition "
                     >
                       <Link href="/profile" className="text-sm w-full text-right">
                         {session.user.full_name}
                       </Link>
                       <User className="w-4 h-4 text-gray-900" />
                     </DropdownMenuItem>
                     <DropdownMenuItem
                       className="flex items-center gap-2 px-3 py-2 rounded-md 
                      hover:bg-gray-100/60 text-gray-700 transition "
                     >
                       <Link href="/settings" className="text-sm w-full text-right">
                         الإعدادات
                       </Link>
                       <Settings className="w-4 h-4 text-gray-900" />
                     </DropdownMenuItem>
                     <DropdownMenuItem
                       className="flex items-center gap-2 px-3 py-2 rounded-md
                      hover:bg-gray-100/60 text-gray-700 transition"
                     >
                       <Link href="/help" className="text-sm w-full text-right">
                         المساعدة
                       </Link>
                       <HelpCircle className="w-4 h-4 text-gray-900" />
                     </DropdownMenuItem>
                     <div className="h-px bg-gray-200 my-1"></div>
                     <DropdownMenuItem
                       className="pl-5.5 flex items-center gap-2  py-2 rounded-md
                      bg-gray-100/60 text-gray-700 transition"
                       onClick={() => signOut()}
                     >
                       <span className="text-sm text-gray-700">تسجيل الخروج</span>
                       <LogOut className="w-4 h-4 text-gray-900" />
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </div>
             ) : (
            <Button
              variant="outline"
              className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
              asChild
            >
              <Link href="/login">تسجيل دخول</Link>
            </Button>
          )}

        {/* زر القائمة - شاشات صغيرة */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* القائمة المتنقلة */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}