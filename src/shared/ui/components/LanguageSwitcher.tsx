"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("navbar");

  const switchLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t("language") || "Change language"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => switchLocale("en")}
          className={`cursor-pointer ${locale === "en" ? "bg-accent" : ""}`}
        >
        <span className="flex items-center gap-2">
          {t('en')}
        </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale("ar")}
          className={`cursor-pointer ${locale === "ar" ? "bg-accent" : ""}`}
        >
        <span className="flex items-center gap-2">
          {t('ar')}
        </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}