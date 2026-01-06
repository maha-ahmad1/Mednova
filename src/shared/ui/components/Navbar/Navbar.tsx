"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/shared/ui/components/Logo";
import { AuthActions } from "./AuthActions";
import MobileMenu from "./MobileMenu";
import { DesktopNavLinks } from "./DesktopNavLinks";

export interface NavbarProps {
  variant?: "landing" | "dashboard";
  className?: string;
}

export default function Navbar({
  variant = "landing",
  className = "",
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`
          sticky top-0 z-50
    flex items-center justify-between
    px-4 lg:px-16
    bg-white
          ${className}
        `}
      >
        <div className="flex items-center gap-4 flex-1" dir="rtl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>

          <Logo />

          {variant === "landing" && (
            <div className="hidden lg:flex flex-1 justify-center">
              <nav className="flex items-center space-x-1 rtl:space-x-reverse">
                <DesktopNavLinks />
              </nav>
            </div>
          )}

          {variant === "dashboard" && (
            <div className="relative w-full max-w-md">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="ابحث عن مستخدم، موعد، أو تقرير..."
                className="w-full pr-10 text-right"
              />
            </div>
          )}
        </div>

        <AuthActions />
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        variant={variant}
      />
    </>
  );
}
