"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import { Footer } from "@/shared/ui/components/Footer";
import { devices } from "../data/devices.data";
import { CategoryFilter, type CategoryFilterValue } from "./CategoryFilter";
import { DeviceGrid } from "./DeviceGrid";
import { WhatsAppCTAButton } from "./WhatsAppCTAButton";

export function SmartDevicesPage() {
  const t = useTranslations("smartDevices");
  const [category, setCategory] = useState<CategoryFilterValue>("all");

  const filteredDevices = useMemo(
    () =>
      category === "all"
        ? devices
        : devices.filter((device) => device.category === category),
    [category],
  );

  return (
    <>
      <Navbar variant="landing" />
      <BreadcrumbNav currentPage={t("breadcrumb")} />

      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/20 py-14">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              {t("pageTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 leading-relaxed">
              {t("pageSubtitle")}
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <CategoryFilter value={category} onChange={setCategory} />
            <div className="mt-8">
              <DeviceGrid devices={filteredDevices} />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#32A88D] to-[#1F6069] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("ctaBannerTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/90">
              {t("ctaBannerSubtitle")}
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppCTAButton
                productName={t("pageTitle")}
                label={t("ctaBannerButton")}
                size="lg"
                className="bg-white text-[#1F6069] hover:bg-white/90"
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
