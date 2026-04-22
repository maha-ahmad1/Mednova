"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type ServiceTab = {
  value: string;
  label: string;
  title: string;
  cta: { label: string; href: string };
  services: string[];
};

const serviceTabs: ServiceTab[] = [
  {
    value: "patients",
    label: "للمرضى",
    title: "خدمات مصممة لرحلة المريض",
    cta: { label: "ابدأ كمريض", href: "/specialists" },
    services: ["جلسات علاج طبيعي أونلاين", "خطة تأهيل منزلية", "متابعة التقدم والتقارير"],
  },
  {
    value: "specialists",
    label: "للمختصين",
    title: "أدوات تساعد المختص على إدارة الحالات",
    cta: { label: "انضم كمختص", href: "/login" },
    services: ["إدارة المواعيد والملفات", "جلسات فيديو ونص داخل المنصة", "لوحة متابعة للنتائج"],
  },
  {
    value: "centers",
    label: "للمراكز",
    title: "حلول رقمية للمراكز العلاجية",
    cta: { label: "اكتشف حلول المراكز", href: "/specialists" },
    services: ["إدارة فرق المعالجين", "تقارير تشغيل وأداء", "قنوات حجز رقمية موحدة"],
  },
];

export default function ServicesTabsSection() {
  return (
    <section className="bg-white px-4 py-16 md:px-10" dir="rtl" id="services">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-right">
          <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">خدماتنا حسب نوع المستخدم</h2>
          <p className="text-gray-600">اختر المسار المناسب لك لتصل إلى الخدمة الأسرع والأقرب لاحتياجك.</p>
          {/* TODO: replace tab services and CTA targets with backend-configured content. */}
        </div>

        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl bg-[#32A88D]/10 p-1">
            {serviceTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-lg py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-[#2a8a7a]">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {serviceTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/60 p-6">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">{tab.title}</h3>
                <ul className="mb-6 grid gap-2 text-gray-600">
                  {tab.services.map((service) => (
                    <li key={service} className="rounded-lg bg-white px-4 py-3">• {service}</li>
                  ))}
                </ul>
                <Button asChild className="rounded-xl bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white hover:from-[#2a8a7a] hover:to-[#32A88D]">
                  <Link href={tab.cta.href}>{tab.cta.label}</Link>
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
