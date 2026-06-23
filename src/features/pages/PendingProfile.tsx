"use client";

import { AlertTriangle, Bell, Clock, FileCheck, Shield } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function PendingProfilePage() {
  const t = useTranslations("accountPending");
  const searchParams = useSearchParams();
  const isRestrictedRedirect = searchParams.get("restricted") === "1";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-l from-white to-white/90 rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <FileCheck className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -end-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            {t("title")}
          </h1>

          {isRestrictedRedirect && (
            <div className="flex items-start gap-2 text-start bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{t("restrictedAccess")}</p>
            </div>
          )}

          <p className="text-gray-600 mb-6 leading-relaxed">
            {t("description")}
          </p>

          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">{t("whyReviewTitle")}</span>
            </div>
            <p className="text-sm text-blue-600">{t("whyReviewDescription")}</p>
          </div>

          <div className="bg-[#32A88D]/5 border border-[#32A88D]/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-[#2a8a7a]">
              <Bell className="w-4 h-4 shrink-0" />
              <p className="text-sm">{t("notification")}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="flex-1 bg-[#32A88D] hover:bg-[#2a8a7a] text-white rounded-xl py-3 h-auto transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Link href="/specialists">{t("goToSpecialists")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl py-3 h-auto transition-all duration-200"
            >
              <Link href="/">{t("backToHome")}</Link>
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">{t("thanks")}</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="flex justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{t("reviewDuration")}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileCheck className="w-3 h-3" />
              <span>{t("qualityCheck")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
