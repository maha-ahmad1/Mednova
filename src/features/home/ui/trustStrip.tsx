"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Lock, Zap, Headset } from "lucide-react";

const TRUST_ICONS = [ShieldCheck, Lock, Zap, Headset] as const;

export default function TrustStrip() {
  const t = useTranslations("trustStrip");

  return (
    <section className="relative py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ICONS.map((Icon, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 bg-[#32A88D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#32A88D]" />
              </div>
              <div className="text-start">
                <h4 className="font-bold text-gray-800 mb-1">
                  {t(`items.${index}.title`)}
                </h4>
                <p className="text-sm text-gray-600">
                  {t(`items.${index}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
