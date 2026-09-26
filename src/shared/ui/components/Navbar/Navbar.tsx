"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/shared/ui/components/Logo";
import { AuthActions } from "./AuthActions";
import MobileMenu from "./MobileMenu";
import { DesktopNavLinks } from "./DesktopNavLinks";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export interface NavbarProps {
  variant?: "landing" | "dashboard";
  className?: string;
}

export default function Navbar({
  variant = "landing",
  className = "",
}: NavbarProps) {
  const t = useTranslations("navbar");
  const tCommon = useTranslations("common");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      <header
        className={`
          sticky top-0 z-50
    flex items-center justify-between
    px-4 lg:px-20
    bg-white
          ${className}
        `}
      >
        {variant === "dashboard" && isMobileSearchOpen ? (
          <div className="flex items-center gap-2 w-full lg:hidden">
            <div className="relative flex-1">
              <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                autoFocus
                placeholder={t("searchPlaceholder")}
                className="w-full pe-10 text-start"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSearchOpen(false)}
              aria-label={tCommon("close")}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {variant === "landing" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              )}

              <Logo />

              {variant === "landing" && (
                <div className="hidden lg:flex flex-1 justify-center">
                  <nav className="flex items-center space-x-1 rtl:space-x-reverse">
                    <DesktopNavLinks />
                  </nav>
                </div>
              )}

              {variant === "dashboard" && (
                <div className="hidden lg:block relative w-full max-w-md">
                  <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    type="search"
                    placeholder={t("searchPlaceholder")}
                    className="w-full pe-10 text-start"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {variant === "dashboard" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="lg:hidden"
                  aria-label={t("searchButtonLabel")}
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
              {variant === "landing" && (
                <div className="hidden lg:block">
                  <LanguageSwitcher />
                </div>
              )}
              {variant === "dashboard" && (
                <div className="hidden min-[360px]:block">
                  <LanguageSwitcher />
                </div>
              )}
              <AuthActions variant={variant} />
            </div>
          </>
        )}
      </header>

      {variant === "landing" && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
