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
import { Logo } from "@/shared/ui/Logo";
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
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-[10px]">
                  3
                </Badge>
              </Button>
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
                  dir="rtl"
                  className="w-36 bg-white/80 backdrop-blur-lg 
                           border-gray-200/60 rounded-md shadow-md p-1"
                >
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 rounded-md 
                             hover:bg-gray-100/60 text-gray-700 transition "
                  >
                    <User className="w-4 h-4 text-gray-900" />
                    <Link href="/profile" className="text-sm w-full text-right">
                      {session.user.full_name}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 rounded-md 
                           hover:bg-gray-100/60 text-gray-700 transition "
                  >
                    <Settings className="w-4 h-4 text-gray-900" />
                    <Link
                      href="/settings"
                      className="text-sm w-full text-right"
                    >
                      الإعدادات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 rounded-md
                           hover:bg-gray-100/60 text-gray-700 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-900" />
                    <Link href="/help" className="text-sm w-full text-right">
                      المساعدة
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-gray-200 my-1"></div>
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 rounded-md 
                            hover:bg-red-50  transition "
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 text-gray-900" />
                    <span className="text-sm text-gray-700">تسجيل الخروج</span>
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