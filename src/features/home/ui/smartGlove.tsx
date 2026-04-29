'use client';

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function SmartGlove() {
  const t = useTranslations("smartGlove");
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden">
      {/* أشكال خلفية دائرية */}
      <div className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 ${isAr ? 'translate-x-1/2' : '-translate-x-1/2'} blur-3xl`}></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* الصورة */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
              <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100">
                <Image
                  src={"/images/home/smartGloves.png"}
                  alt={t("title")}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* بطاقة عائمة 1 */}
              <div className={`absolute -bottom-6 ${isAr ? '-right-6' : '-left-6'} z-20`}>
                <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float">
                  <div className="text-start">
                    <div className="text-sm font-bold text-gray-800">{t("features.0.title")}</div>
                    <div className="text-xs text-gray-600">{t("features.0.desc")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* النص والمحتوى */}
          <div className="lg:col-span-7 text-start">
            <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
              <span>{t("badge")}</span>
            </div>

            {/* ✅ التعديل هنا فقط */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
              {t("title")}
            </h2>

            <p className="text-lg text-gray-600 leading-8 mb-8 max-w-2xl">
              {t("desc")}
            </p>

            {/* نقاط مميزة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                  <div className="text-start">
                    <h4 className="font-bold text-gray-800 mb-1">{t(`features.${index}.title`)}</h4>
                    <p className="text-sm text-gray-600">{t(`features.${index}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex mt-8 ${isAr ? "justify-start" : "justify-end"}`}>
              <Link href="/smartgloves">
                <button className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white rounded-xl px-8 py-4 text-lg shadow-lg font-medium">
                  {t("cta")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}