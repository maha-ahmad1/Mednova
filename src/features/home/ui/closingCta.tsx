"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function ClosingCta() {
  const t = useTranslations("closingCta");

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
          <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
          <span>{t("badge")}</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight mb-4">
          {t("title")}
        </h2>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {t("description")}
        </p>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r w-full sm:w-auto from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            asChild
          >
            <Link href="/specialists">
              {t("cta")}
              <ArrowLeft className="mr-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
