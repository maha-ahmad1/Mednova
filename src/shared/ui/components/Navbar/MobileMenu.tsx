"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/shared/ui/components/Logo";
import { X, ChevronDown } from "lucide-react";
import { NavLinks, NavLink } from "./NavLinks";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "@/shared/ui/components/LanguageSwitcher";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('navbar');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    const timeout = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-80 max-w-[85vw] h-full shadow-2xl relative transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : "rtl:translate-x-full ltr:-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* الهيدر */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Logo />
          <div className="flex items-center gap-1">
            <LanguageSwitcher className="text-gray-600 hover:text-[#32A88D] rounded-xl" />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-600 hover:text-[#32A88D] rounded-xl"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
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
                    <span className="font-medium text-start">{t(link.titleKey)}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openDropdown === link.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === link.id && (
                    <div className="ps-4 pb-2 space-y-1">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.id}
                          href={item.link}
                          className="block p-3 text-sm text-gray-600 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200 text-start"
                          onClick={onClose}
                        >
                          {t(item.titleKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.link}
                  className="flex items-center p-4 text-gray-700 hover:text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl transition-all duration-200 font-medium text-start"
                  onClick={onClose}
                >
                  {t(link.titleKey)}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* زر تسجيل الدخول (لغير المسجلين) */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <Button
            className="w-full bg-[#32A88D] hover:bg-[#2a8a7a] text-white rounded-xl py-3"
            asChild
          >
            <Link href="/login" onClick={onClose}>
              تسجيل دخول
            </Link>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
