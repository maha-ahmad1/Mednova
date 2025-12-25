"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/shared/ui/components/Logo";
import { X, ChevronDown } from "lucide-react";
import { NavLinks, NavLink } from "./NavLinks";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden">
      <div className="bg-white w-80 h-full rtl:right-0 ltr:left-0 shadow-2xl relative">
        {/* الهيدر */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 hover:text-[#32A88D] rounded-xl"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* قائمة الروابط */}
        <nav className="flex flex-col gap-1 p-4 h-[calc(100%-140px)] overflow-y-auto">
          {NavLinks.map((link: NavLink) => (
            <div
              key={link.id}
              className="border-b border-gray-100 last:border-b-0"
            >
              {link.dropdown ? (
                <div className="group">
                  <button
                    onClick={() => toggleDropdown(link.id)}
                    className="flex items-center justify-between w-full p-4 text-gray-700 hover:text-[#32A88D] cursor-pointer"
                  >
                    <span className="font-medium text-right">{link.title}</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openDropdown === link.id ? "rotate-180" : ""
                      }`} 
                    />
                  </button>
                  
                  {openDropdown === link.id && (
                    <div className="pr-4 pb-2 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.id}
                          href={item.link}
                          className="block p-3 text-sm text-gray-600 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200 text-right"
                          onClick={onClose}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.link}
                  className="flex items-center p-4 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200 font-medium text-right"
                  onClick={onClose}
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* زر تسجيل الدخول */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <Button
            className="w-full bg-[#32A88D] hover:bg-[#2a8a7a] text-white rounded-xl py-3 transition-all duration-200"
            asChild
          >
            <Link href="/login" onClick={onClose}>
              تسجيل دخول
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}