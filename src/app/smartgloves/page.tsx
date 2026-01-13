"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  BarChart3,
  Users,
  Clock,
  Calendar,
  Smartphone,
  Home,
  Settings,
  FileText,
  Star,
  Shield,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Brain,
  Activity,
  Award,
  Globe,
  Download,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import { Footer } from "@/shared/ui/components/Footer";

export default function SmartGlovePage() {
  const [activeTab, setActiveTab] = useState("features");

  // بيانات الأسئلة الشائعة
  const faqItems = [
    {
      question: "ما هو القفاز الذكي من مدنوفا؟",
      answer:
        "جهاز تأهيلي متطور يعمل على إعادة تأهيل حركة اليد للمرضى الذين يعانون من ضعف أو شلل في اليد بسبب الجلطات الدماغية، الشلل النصفي، ضمور العضلات، أو كبار السن.",
    },
    {
      question: "هل يمكن استخدام القفاز في المنزل؟",
      answer:
        "نعم، تم تصميم القفاز خصيصاً للاستخدام المنزلي مع إمكانية المتابعة عن بعد من خلال منصة مدنوفا الرقمية.",
    },
    {
      question: "كيف يتم تخصيص برنامج العلاج؟",
      answer:
        "يتم ضبط البرامج التأهيلية من قبل المختص عبر المنصة الرقمية، حيث يمكن تحديد زوايا الحركة، قوة التمرين، ومدة الجلسات حسب حالة كل مريض.",
    },
    {
      question: "ما مدى فعالية القفاز؟",
      answer:
        "أظهرت الدراسات تحسناً ملحوظاً في حركة اليد عند الاستخدام المنتظم، حيث يتم تتبع التقدم بشكل لحظي وتحليل النتائج باستخدام الذكاء الاصطناعي.",
    },
    {
      question: "هل القفاز مناسب للأطفال؟",
      answer:
        "نعم، القفاز مصمم بمقاسات مختلفة تناسب جميع الأعمار، مع برامج علاجية مخصصة للأطفال.",
    },
  ];

  // بيانات الفوائد
  const benefits = [
    {
      title: "للمريض",
      icon: <Heart className="w-6 h-6" />,
      color: "from-red-100 to-red-50",
      items: [
        "إعادة تأهيل تدريجي ومبرمج",
        "إمكانية العلاج المنزلي",
        "توفير الوقت والجهد",
        "متابعة مستمرة مع المختص",
        "نتائج ملموسة وقابلة للقياس",
      ],
    },
    {
      title: "للمعالج",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-100 to-blue-50",
      items: [
        "مراقبة وتعديل العلاج عن بعد",
        "تقارير دقيقة ومفصلة",
        "توفير وقت الجلسات",
        "متابعة عدة مرضى في آن واحد",
        "تحليل بيانات باستخدام الذكاء الاصطناعي",
      ],
    },
    {
      title: "للمراكز الطبية",
      icon: <Shield className="w-6 h-6" />,
      color: "from-emerald-100 to-emerald-50",
      items: [
        "تحسين جودة الخدمات التأهيلية",
        "زيادة عدد المستفيدين",
        "تقليل التكاليف التشغيلية",
        "تميز تكنولوجي وتنافسية",
        "نظام متكامل للتتبع والتقييم",
      ],
    },
  ];

  // بيانات كيف يعمل
  const howItWorks = [
    {
      step: 1,
      title: "التقييم الأولي",
      description: "تقييم حالة المريض وتحديد خطة العلاج المناسبة",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      step: 2,
      title: "ضبط القفاز",
      description: "برمجة القفاز حسب احتياجات المريض عبر المنصة الرقمية",
      icon: <Settings className="w-6 h-6" />,
    },
    {
      step: 3,
      title: "جلسات العلاج",
      description: "تنفيذ تمارين مخصصة بتحكم دقيق في كل إصبع",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      step: 4,
      title: "المتابعة والتعديل",
      description: "تتبع التقدم وتعديل البرنامج حسب الاستجابة للعلاج",
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  // إحصائيات
  const stats = [
    { value: "95%", label: "رضا العملاء", icon: <Star className="w-5 h-5" /> },
    {
      value: "+500",
      label: "مريض تم تأهيلهم",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "+85%",
      label: "تحسن في الحركة",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    { value: "24/7", label: "دعم فني", icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <>
      <Navbar variant="landing" />
      <BreadcrumbNav currentPage="القفاز الذكي" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
        {/* Hero Section */}
    {/* Hero Section */}
<section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/20 py-12">
  <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
  <div className="container mx-auto px-4 relative">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* النص - يبقى كما هو */}
      <div className="text-right">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200">
          <Sparkles className="w-4 h-4" />
          <span>تكنولوجيا طبية متطورة</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          القفاز الطبي الذكي من{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            مدنوفا
          </span>
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          جهاز تأهيلي متقدم مصمم لإعادة تأهيل حركة اليد بطريقة عملية،
          ذكية، وقابلة للتخصيص. يستهدف مرضى الجلطات الدماغية، الشلل
          النصفي، ضمور العضلات، كبار السن، والأطفال، سواء داخل المراكز
          أو من المنزل.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            <Zap className="ml-2 w-5 h-5" />
            احجز عرض تجريبي
          </Button>
          <Button
            variant="outline"
            className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl px-8 py-6 text-lg font-medium transition-all duration-300"
          >
            <Play className="ml-2 w-5 h-5" />
            مشاهدة الفيديو
          </Button>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>ضمان 12 شهر</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>تدريب مجاني</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>دعم فني 24/7</span>
          </div>
        </div>
      </div>

      {/* الصورة - تعديلات هنا */}
      <div className="relative">
        <div className="relative w-full max-w-lg mx-auto">
          {/* شكل خلفي */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
          
          {/* الصورة الرئيسية */}
          <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100">
            <div className="relative w-full h-[400px] md:h-[450px]">
              <Image
                src={"/images/home/smartGloves.png"}
                alt="القفاز الذكي من مدنوفا"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* تأثير زاوية */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#32A88D] to-transparent rounded-tl-2xl"></div>
          </div>

          {/* بطاقة عائمة */}
          <div className="absolute -bottom-4 -right-4 z-20">
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float">
              <div className="w-12 h-12 bg-[#32A88D] rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-md"></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">ذكي</div>
                <div className="text-xs text-gray-600">تكنولوجيا متطورة</div>
              </div>
            </div>
          </div>

          {/* بطاقة عائمة ثانية */}
          <div className="absolute -top-4 -left-4 z-20">
            <div 
              className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="w-12 h-12 bg-[#2a8a7a] rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-md"></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">منزلي</div>
                <div className="text-xs text-gray-600">استخدام سهل</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-emerald-600">{stat.icon}</div>
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

        {/* كيف يعمل */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                آلية العمل
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                كيف يعمل القفاز الذكي؟
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                نظام متكامل يجمع بين الأجهزة الذكية والمنصة الرقمية للعلاج
                التأهيلي
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {howItWorks.map((item, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl"></div>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="text-emerald-600">{item.icon}</div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
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

            {/* Process Visualization */}
            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                {howItWorks.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* المنصة الرقمية */}
        <section className="py-16 bg-gradient-to-r from-emerald-50/50 to-teal-50/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-right">
                <Badge
                  variant="outline"
                  className="mb-4 border-blue-200 text-blue-700 bg-blue-50"
                >
                  التقنية الذكية
                </Badge>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  منصة <span className="text-emerald-600">مدنوفا</span> الرقمية
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  نظام متكامل يربط القفاز الذكي بالمريض والمعالج، يوفر تحليلات
                  ذكية وتقارير مفصلة
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: "ضبط البرامج العلاجية",
                      desc: "يتم ضبط البرامج من قبل المختص حسب حالة المريض",
                      icon: <Settings className="w-6 h-6" />,
                    },
                    {
                      title: "تتبع التقدم الحركي",
                      desc: "مراقبة وتحليل التقدم بشكل لحظي ومفصل",
                      icon: <TrendingUp className="w-6 h-6" />,
                    },
                    {
                      title: "تقارير الذكاء الاصطناعي",
                      desc: "تحليل البيانات وتقديم توصيات ذكية للعلاج",
                      icon: <Brain className="w-6 h-6" />,
                    },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="text-emerald-600">{feature.icon}</div>
                      </div>
                      <div className="text-right flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
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
                        لوحة تحكم المريض
                      </h3>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        نشط
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          label: "تقدم العلاج الأسبوعي",
                          value: "75%",
                          width: "75%",
                          color: "from-emerald-500 to-teal-500",
                        },
                        {
                          label: "قوة القبضة",
                          value: "+40%",
                          width: "60%",
                          color: "from-blue-500 to-cyan-500",
                        },
                        {
                          label: "مرونة الأصابع",
                          value: "+65%",
                          width: "65%",
                          color: "from-purple-500 to-pink-500",
                        },
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {item.label}
                            </span>
                            <span className="text-sm font-bold text-emerald-600">
                              {item.value}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                              style={{ width: item.width }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        value: "12",
                        label: "جلسات مكتملة",
                        color: "text-emerald-600",
                      },
                      {
                        value: "24",
                        label: "ساعة علاج",
                        color: "text-blue-600",
                      },
                      {
                        value: "85%",
                        label: "رضا العملاء",
                        color: "text-purple-600",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition"
                      >
                        <div className={`text-lg font-bold ${stat.color}`}>
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

        {/* الفوائد */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                الفوائد والمميزات
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                فوائد القفاز الذكي
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                نظام متكامل يفيد جميع الأطراف في العملية العلاجية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b ${benefit.color}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <div className="text-emerald-600">{benefit.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {benefit.title}
                      </h3>
                    </div>
                    <ul className="space-y-3 text-right">
                      {benefit.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-end gap-2"
                        >
                          <span className="text-gray-700 text-sm">{item}</span>
                          <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* الأسئلة الشائعة */}
        <section className="py-16 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                الدعم والمساعدة
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                الأسئلة الشائعة
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                أجوبة على أكثر الأسئلة التي تردنا حول القفاز الذكي
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
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 text-right">
                      <span className="font-semibold text-gray-800 flex-1">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed text-right">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                ابدأ رحلة التعافي اليوم
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                استعد لحركة يدك الطبيعية مع القفاز الذكي المتطور
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { 
                    step: "1", 
                    title: "اتصل بنا", 
                    desc: "احجز استشارة مجانية مع أحد مختصينا" 
                  },
                  { 
                    step: "2", 
                    title: "تقييم مجاني", 
                    desc: "تقييم حالة المريض وتحديد الخطة المناسبة" 
                  },
                  { 
                    step: "3", 
                    title: "بدء العلاج", 
                    desc: "تسليم القفاز وبدء جلسات العلاج المنزلية" 
                  }
                ].map((step, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition">
                    <div className="text-3xl font-bold mb-4">{step.step}</div>
                    <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                    <p className="opacity-90 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 rounded-xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition">
                  <Award className="ml-2 w-5 h-5" />
                  اطلب القفاز الذكي الآن
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-xl px-8 py-6 text-lg font-semibold transition">
                  <Phone className="ml-2 w-5 h-5" />
                  تواصل مع مستشار طبي
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>٠٥٠١٢٣٤٥٦٧</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@mednovacare.com</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </>
  );
}
