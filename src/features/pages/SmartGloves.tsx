"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Play,
  CheckCircle,
  BarChart3,
  Users,
  Clock,
  Settings,
  FileText,
  Star,
  Shield,
  Heart,
  Zap,
  TrendingUp,
  Sparkles,
  Brain,
  Activity,
} from "lucide-react";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import { Footer } from "@/shared/ui/components/Footer";
import { useLocale, useTranslations } from "next-intl";

type FaqItem = { question: string; answer: string };
type StatItem = { value: string; label: string };
type StepItem = { title: string; description: string };
type BenefitBlock = { title: string; items: string[] };
type PlatformFeature = { title: string; description: string };
type ProgressRow = { label: string; value: string; width: string };
type MiniStat = { value: string; label: string };

const howItWorksIcons = [
  <FileText key="f" className="w-6 h-6" />,
  <Settings key="s" className="w-6 h-6" />,
  <Clock key="c" className="w-6 h-6" />,
  <BarChart3 key="b" className="w-6 h-6" />,
];

const benefitIcons = [
  <Heart key="h" className="w-6 h-6" />,
  <Users key="u" className="w-6 h-6" />,
  <Shield key="sh" className="w-6 h-6" />,
];

const statIcons = [
  <Star key="st" className="w-5 h-5" />,
  <Users key="us" className="w-5 h-5" />,
  <TrendingUp key="tr" className="w-5 h-5" />,
  <Activity key="ac" className="w-5 h-5" />,
];

const progressBarColors = [
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
];

const miniStatColors = ["text-emerald-600", "text-blue-600", "text-purple-600"];

export default function SmartGlove() {
  const t = useTranslations("smartGlovesPage");
  const tNav = useTranslations("navbar");
  const locale = useLocale();
  const isAr = locale === "ar";

  const textAlign = isAr ? "text-right" : "text-left";
  const flexRowReverse = isAr ? "flex-row-reverse" : "";

  const faqItems = t.raw("faq") as FaqItem[];
  const benefits = t.raw("benefits") as BenefitBlock[];
  const howSteps = t.raw("howItWorksSteps") as StepItem[];
  const statsData = t.raw("stats") as StatItem[];
  const howMeta = t.raw("howItWorks") as {
    badge: string;
    title: string;
    subtitle: string;
  };
  const platform = t.raw("platform") as {
    badge: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    description: string;
    features: PlatformFeature[];
  };
  const dashboard = t.raw("dashboard") as {
    title: string;
    activeBadge: string;
    progress: ProgressRow[];
    miniStats: MiniStat[];
  };
  const benefitsMeta = t.raw("benefitsSection") as {
    badge: string;
    title: string;
    subtitle: string;
  };
  const faqMeta = t.raw("faqSection") as {
    badge: string;
    title: string;
    subtitle: string;
  };

  const platformFeatureIcons = [
    <Settings key="a" className="w-6 h-6" />,
    <TrendingUp key="b" className="w-6 h-6" />,
    <Brain key="c" className="w-6 h-6" />,
  ];

  return (
    <>
      <Navbar variant="landing" />
      <BreadcrumbNav
        currentPage={t("breadcrumb")}
        homeText={tNav("home")}
        homeHref="/"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/20 py-12">
          <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={textAlign}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200">
                  <Sparkles className="w-4 h-4" />
                  <span>{t("hero.badge")}</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  {t("hero.title")}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    {t("hero.brand")}
                  </span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t("hero.description")}
                </p>

                <div className={`flex flex-col sm:flex-row gap-4 mb-8 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                  <Button
                    onClick={() => {
                      const section = document.getElementById("smart-glove");
                      section?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Zap className="me-2 w-5 h-5 inline" />
                    {t("hero.ctaLearn")}
                  </Button>
                  <a
                    href="https://www.youtube.com/watch?v=OMwPUOn-yAE"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="cursor-pointer border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl px-8 py-6 text-lg font-medium transition-all duration-300 w-full sm:w-auto"
                    >
                      <Play className="me-2 w-5 h-5 inline" />
                      {t("hero.ctaVideo")}
                    </Button>
                  </a>
                </div>

                <div className={`flex flex-wrap gap-6 text-sm text-gray-500 ${isAr ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-center gap-2 ${flexRowReverse}`}>
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{t("hero.trust1")}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${flexRowReverse}`}>
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{t("hero.trust2")}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${flexRowReverse}`}>
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{t("hero.trust3")}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>

                  <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100">
                    <div className="relative w-full h-[400px] md:h-[450px]">
                      <Image
                        src={"/images/home/smartGloves.png"}
                        alt={t("imageAlt")}
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="absolute top-0 start-0 w-32 h-32 bg-gradient-to-br from-[#32A88D] to-transparent rounded-ss-2xl"></div>
                  </div>

                  <div className="absolute -bottom-4 -end-4 z-20">
                    <div className={`bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float ${flexRowReverse}`}>
                      <div className="w-12 h-12 bg-[#32A88D] rounded-xl flex items-center justify-center shrink-0">
                        <div className="w-6 h-6 bg-white rounded-md"></div>
                      </div>
                      <div className={textAlign}>
                        <div className="text-sm font-bold text-gray-800">
                          {t("floatSmart")}
                        </div>
                        <div className="text-xs text-gray-600">
                          {t("floatSmartDesc")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -start-4 z-20">
                    <div
                      className={`bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float ${flexRowReverse}`}
                      style={{ animationDelay: "1.5s" }}
                    >
                      <div className="w-12 h-12 bg-[#2a8a7a] rounded-xl flex items-center justify-center shrink-0">
                        <div className="w-6 h-6 bg-white rounded-md"></div>
                      </div>
                      <div className={textAlign}>
                        <div className="text-sm font-bold text-gray-800">
                          {t("floatHome")}
                        </div>
                        <div className="text-xs text-gray-600">
                          {t("floatHomeDesc")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`flex items-center justify-center gap-2 mb-2 ${flexRowReverse}`}>
                    <div className="text-emerald-600">{statIcons[index]}</div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-800">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-white to-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {howMeta.badge}
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {howMeta.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {howMeta.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {howSteps.map((item, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl"></div>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="text-emerald-600">
                          {howItWorksIcons[index]}
                        </div>
                      </div>
                      <div className="absolute -top-2 -end-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 start-0 end-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                {howSteps.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="smart-glove"
          className="py-16 bg-gradient-to-r from-emerald-50/50 to-teal-50/30"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={textAlign}>
                <Badge
                  variant="outline"
                  className="mb-4 border-blue-200 text-blue-700 bg-blue-50"
                >
                  {platform.badge}
                </Badge>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {platform.titleBefore}
                  <span className="text-emerald-600">
                    {platform.titleHighlight}
                  </span>
                  {platform.titleAfter}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {platform.description}
                </p>

                <div className="space-y-6">
                  {platform.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 ${flexRowReverse}`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shrink-0 mt-1">
                        <div className="text-emerald-600">
                          {platformFeatureIcons[index]}
                        </div>
                      </div>
                      <div className={`flex-1 ${textAlign}`}>
                        <h4 className="font-bold text-gray-800 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800">
                        {dashboard.title}
                      </h3>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {dashboard.activeBadge}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {dashboard.progress.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-2 gap-2">
                            <span className="text-sm text-gray-600">
                              {item.label}
                            </span>
                            <span className="text-sm font-bold text-emerald-600 shrink-0">
                              {item.value}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${progressBarColors[index]}`}
                              style={{ width: item.width }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {dashboard.miniStats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition"
                      >
                        <div
                          className={`text-lg font-bold ${miniStatColors[index]}`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {benefitsMeta.badge}
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {benefitsMeta.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {benefitsMeta.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b ${
                    index === 0
                      ? "from-red-100 to-red-50"
                      : index === 1
                        ? "from-blue-100 to-blue-50"
                        : "from-emerald-100 to-emerald-50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className={`flex items-center gap-3 mb-6 ${flexRowReverse}`}>
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <div className="text-emerald-600">
                          {benefitIcons[index]}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {benefit.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {benefit.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex flex-row gap-2 items-start"
                        >
                          <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {faqMeta.badge}
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {faqMeta.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {faqMeta.subtitle}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-emerald-200 transition-colors"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 text-start">
                      <span className="font-semibold text-gray-800 flex-1">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed text-start">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
