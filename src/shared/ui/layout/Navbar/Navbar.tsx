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
import { ChevronDown, Menu } from "lucide-react";
import { NavLinks } from "./NavLinks";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
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

        <div className="hidden lg:flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-6 py-2 transition-all duration-200"
            asChild
          >
            <Link href="/login">تسجيل دخول</Link>
          </Button>
        </div>

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