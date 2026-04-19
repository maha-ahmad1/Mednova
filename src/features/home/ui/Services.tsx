"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

const SERVICE_ICONS = [
  "/images/home/icons/reservation.svg",
  "/images/home/icons/consultation.svg",
  "/images/home/icons/video.svg",
  "/images/home/icons/file.svg",
  "/images/home/icons/follow-up.svg",
  "/images/home/icons/there-are-close.svg",
] as const;

type ServiceCard = { title: string; details: string };

export default function Services() {
  const t = useTranslations("homeServices");
  const cards = t.raw("cards") as ServiceCard[];

  return (
    <section
      id="services"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
            <span>{t("badge")}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
            {t("titleBefore")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]">
              {t("titleHighlight")}
            </span>
          </h2>

          <div className="w-20 h-1.5 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full mb-8 mx-auto"></div>

          <p className="text-lg text-gray-600 leading-8 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((service, index) => (
            <Card
              key={index}
              className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Image
                        src={SERVICE_ICONS[index]}
                        alt={`${service.title} ${t("iconAltSuffix")}`}
                        width={24}
                        height={24}
                        className="filter brightness-0 invert"
                      />
                    </div>
                  </div>
                </div>

                <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center pt-0">
                <CardDescription className="text-gray-600 leading-7 text-base">
                  {service.details}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
