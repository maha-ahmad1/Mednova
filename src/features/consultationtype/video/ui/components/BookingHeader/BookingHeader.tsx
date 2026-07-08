"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  consultantType?: string;
}

export default function BookingHeader({ consultantType }: Props) {
  const t = useTranslations("booking");
  return (
    <div className="text-center mb-6 sm:mb-8 md:mb-10 px-2">
      <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-4 sm:px-6 py-2 rounded-full mb-3 sm:mb-4">
        <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
        <span className="text-xs sm:text-sm font-medium text-[#32A88D]">{t("headerBadge")}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
        {t("headerTitle")}
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
        {t("headerSubtitle", { type: consultantType === "therapist" ? t("specialistWord") : t("centerWord") })}
      </p>
    </div>
  );
}
