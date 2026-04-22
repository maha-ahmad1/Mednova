"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  { value: "500+", label: "مختص معتمد في 5 تخصصات" },
  { value: "10K+", label: "جلسة علاجية ناجحة" },
  { value: "98%", label: "رضا المرضى خلال 2025" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 px-4 py-12 md:px-10 lg:py-20" dir="rtl">
      <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#32A88D]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="text-right lg:col-span-7">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#32A88D]/10 px-4 py-2 text-sm font-medium text-[#32A88D]">
            <span className="h-2 w-2 rounded-full bg-[#32A88D]" />
            نبدأ من ألمك... ونوصلك للتعافي بخطة واضحة
          </p>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight text-gray-800 md:text-5xl lg:text-6xl">
            ألمك مستمر؟
            <span className="block bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] bg-clip-text text-transparent">
              احجز مختص العلاج الطبيعي المناسب خلال دقائق
            </span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-8 text-gray-600">
            منصة MedNova تربطك مباشرةً بمختصين معتمدين في عُمان للاستشارات الفورية
            وبرامج إعادة التأهيل أونلاين بطريقة آمنة وسريعة.
          </p>

          <div className="mb-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-[#32A88D]/20 bg-white p-2 shadow-sm">
            <Search className="mr-2 h-5 w-5 text-[#32A88D]" />
            <Input
              type="search"
              placeholder="ابحث بالتخصص أو اسم المعالج..."
              className="border-0 text-right shadow-none focus-visible:ring-0"
              aria-label="ابحث بالتخصص أو اسم المعالج"
            />
            {/* TODO: wire this search input to live specialist search API and route results page. */}
          </div>

          <div className="mb-3">
            <Button
              asChild
              size="lg"
              className="w-full rounded-xl bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] px-8 py-4 text-lg text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-[#2a8a7a] hover:to-[#32A88D] md:w-auto"
            >
              <Link href="/specialists">
                احجز جلستك الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <p className="mb-8 text-sm text-gray-500">
            متاح 24/7 · رد خلال دقائق · مختصون معتمدون
          </p>

          <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-gray-100 bg-white/80 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#32A88D]">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -z-10 scale-110 rounded-2xl bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 blur-xl" />
            <Image
              src="/images/home/herosection.png"
              alt="مريضة تتلقى استشارة علاج طبيعي"
              width={520}
              height={560}
              className="h-auto w-full rounded-2xl object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
