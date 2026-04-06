"use client";

import { useState } from "react";
import { ChevronLeft, FileText, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import { Footer } from "@/shared/ui/components/Footer";
export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = [
    { id: "intro", title: "التمهيد" },
    { id: "definitions", title: "التعريفات" },
    { id: "scope", title: "نطاق التطبيق" },
    { id: "acceptance", title: "القبول القانوني" },
    { id: "registration", title: "التسجيل وإنشاء الحساب" },
    { id: "services", title: "طبيعة الخدمات الصحية" },
    // { id: "glove", title: "القفاز الطبي الذكي" },
    // { id: "subscriptions", title: "الاشتراكات والرسوم" },
    // { id: "cancellation", title: "الإلغاء والاسترجاع" },
    // { id: "intellectual", title: "الملكية الفكرية" },
    // { id: "privacy", title: "الخصوصية وحماية البيانات" },
    // { id: "liability", title: "حدود المسؤولية" },
    // { id: "prohibited", title: "السلوك المحظور" },
    // { id: "suspension", title: "تعليق أو إنهاء الخدمة" },
    // { id: "governance", title: "القانون الحاكم والاختصاص القضائي" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar variant="landing" />

      <section className="relative bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 min-h-screen ">
        {/* محتوى الصفحة */}
        {/* أشكال خلفية دائرية */}
        {/* <div className="absolute top-0 right-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div> */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* زر العودة */}
          {/* <div className="mb-8">
            <Link href="/">
              <button className="flex items-center gap-2 text-[#32A88D] hover:text-[#2a8a7a] transition-colors duration-300">
                <ChevronLeft className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </button>
            </Link>
          </div> */}

          {/* العنوان الرئيسي */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-6 py-3 rounded-full text-base font-medium mb-6">
              <FileText className="w-5 h-5" />
              <span>الوثائق القانونية</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
              الشروط والأحكام{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]">
                العامة
              </span>
            </h1>

            <div className="w-24 h-2 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full mb-6 mx-auto"></div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#32A88D]" />
                <span>آخر تحديث: 2026</span>{" "}
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>يُرجى القراءة بعناية</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* شريط التنقل الجانبي */}
            <div className="lg:w-1/4">
              <div className="sticky top-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 h-[calc(100vh-5rem)] lg:h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#32A88D] scrollbar-track-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#32A88D]" />
                  فهرس المحتويات
                </h3>
                <nav className="space-y-1 lg:space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`cursor-pointer w-full text-right px-3 py-2 lg:px-4 lg:py-3 rounded-xl transition-all duration-300 text-sm lg:text-base ${
                        activeSection === section.id
                          ? "bg-[#32A88D] text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* محتوى الشروط والأحكام */}
            <div className="lg:w-3/4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
                {/* قسم التمهيد */}
                <div id="intro" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-12 bg-gradient-to-b from-[#32A88D] to-[#2a8a7a] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      أولًا: التمهيد
                    </h2>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-700 leading-8 text-lg">
                      تُعد منصة MedNova منصة رقمية متخصصة في تقديم حلول التأهيل
                      الذكي والخدمات الصحية الرقمية، والمملوكة والمُشغلة من قبل
                      شركة MedNova (مد نوفا). ويُعد هذا المستند اتفاقًا قانونيًا
                      ملزمًا ينظم العلاقة بين الشركة وكافة مستخدمي المنصة، ويحدد
                      الحقوق والالتزامات المتبادلة.
                    </p>
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-amber-800 flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>
                          باستخدام المنصة أو أي من خدماتها، يقر المستخدم صراحةً
                          بموافقته الكاملة وغير المشروطة على هذه الشروط
                          والأحكام.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* قسم التعريفات */}
                <div id="definitions" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-12 bg-gradient-to-b from-[#32A88D] to-[#2a8a7a] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      ثانيًا: التعريفات
                    </h2>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-700 mb-6">
                      لأغراض هذه الشروط، يكون للكلمات والعبارات التالية المعاني
                      المبينة أدناه، ما لم يقتضِ السياق غير ذلك:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          term: "الشركة",
                          definition: "شركة MedNova المالكة والمشغلة للمنصة.",
                        },
                        {
                          term: "المنصة",
                          definition:
                            "منصة MedNova الرقمية بكافة تطبيقاتها وأنظمتها ومواقعها.",
                        },
                        {
                          term: "المستخدم",
                          definition:
                            "كل شخص طبيعي أو اعتباري يستخدم المنصة أو أي من خدماتها.",
                        },
                        {
                          term: "المريض",
                          definition:
                            "المستخدم المستفيد من الخدمات التأهيلية أو الصحية.",
                        },
                        {
                          term: "المختص",
                          definition:
                            "طبيب أو أخصائي علاج طبيعي أو تأهيل مرخص ومعتمد على المنصة.",
                        },
                        {
                          term: "المركز",
                          definition:
                            "جهة صحية أو تأهيلية مرخصة ومسجلة لدى الجهات المختصة.",
                        },
                        {
                          term: "الخدمات",
                          definition:
                            "كافة الخدمات الرقمية، التأهيلية، الاستشارية، والتقنية المقدمة عبر المنصة.",
                        },
                        {
                          term: "القفاز الطبي الذكي",
                          definition:
                            "جهاز طبي ذكي مملوك للشركة ومتكامل مع المنصة.",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#32A88D]/30 transition-colors duration-300"
                        >
                          <h4 className="font-bold text-[#32A88D] mb-2">
                            {item.term}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {item.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* قسم نطاق التطبيق */}
                <div id="scope" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-12 bg-gradient-to-b from-[#32A88D] to-[#2a8a7a] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      ثالثًا: نطاق التطبيق
                    </h2>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-700 mb-4">تسري هذه الشروط على:</p>
                    <div className="space-y-3">
                      {[
                        "جميع مستخدمي المنصة داخل وخارج سلطنة عمان.",
                        "جميع الخدمات الحالية أو المستقبلية.",
                        "أي تحديثات أو إضافات أو تطويرات يتم إدخالها على المنصة أو منتجاتها.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
                          </div>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* قسم القبول القانوني */}
                <div id="acceptance" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-12 bg-gradient-to-b from-[#32A88D] to-[#2a8a7a] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      رابعًا: القبول القانوني
                    </h2>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <div className="space-y-4">
                      {[
                        "يُعد استخدام المنصة قبولًا صريحًا ونهائيًا بهذه الشروط.",
                        "في حال عدم الموافقة، يجب الامتناع فورًا عن استخدام المنصة.",
                        "تحتفظ الشركة بحق تعديل هذه الشروط في أي وقت، ويُعد استمرار الاستخدام موافقة ضمنية على التعديلات.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-sm font-bold text-[#32A88D]">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* قسم التسجيل وإنشاء الحساب */}
                <div id="registration" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-12 bg-gradient-to-b from-[#32A88D] to-[#2a8a7a] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      خامسًا: التسجيل وإنشاء الحساب
                    </h2>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <div className="space-y-4">
                      {[
                        "يلتزم المستخدم بتقديم بيانات صحيحة ودقيقة ومحدثة.",
                        "يتحمل المستخدم المسؤولية الكاملة عن أي معلومات غير صحيحة.",
                        "يُحظر إنشاء أكثر من حساب لنفس المستخدم دون موافقة مكتوبة من الشركة.",
                        "يحق للشركة تعليق أو إلغاء الحساب في حال تقديم بيانات مضللة، أو مخالفة هذه الشروط، أو إساءة استخدام المنصة أو خدماتها.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-sm font-bold text-[#32A88D]">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* قسم طبيعة الخدمات الصحية */}
                <div id="services" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-12 bg-gradient-to-b from-[#32A88D] to-[#2a8a7a] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      سادسًا: طبيعة الخدمات الصحية
                    </h2>
                  </div>
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <div className="space-y-4">
                      {[
                        "لا تُعد المنصة بديلًا عن الفحص الطبي الحضوري أو التشخيص السريري المباشر.",
                        "البرامج والتمارين والتوصيات ذات طابع تأهيلي وإرشادي وتعتمد على البيانات المدخلة من المستخدم أو المختص.",
                        "يتحمل المستخدم المسؤولية الكاملة عن الالتزام بتعليمات المختص والتوقف الفوري عن أي نشاط عند ظهور أعراض غير طبيعية.",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#32A88D]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-sm font-bold text-[#32A88D]">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ملاحظة هامة */}
                <div className="bg-gradient-to-r from-[#32A88D]/10 to-blue-500/10 rounded-2xl p-8 border border-[#32A88D]/20 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#32A88D] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        ملاحظة هامة
                      </h3>
                      <p className="text-gray-700">
                        هذه الصفحة تحتوي على ملخص لأهم البنود. يُرجى قراءة
                        النسخة الكاملة من الشروط والأحكام العامة لمنصة MedNova
                        لفهم كافة التفاصيل والالتزامات القانونية.
                      </p>
                    </div>
                  </div>
                </div>

                {/* تذييل الصفحة */}
                {/* <div className="text-center pt-8 border-t border-gray-200">
                  <p className="text-gray-600 mb-4">
                    للاطلاع على النسخة الكاملة من الشروط والأحكام أو للحصول على
                    نسخة PDF، يُرجى التواصل معنا.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white rounded-xl hover:shadow-lg transition-all duration-300">
                      تحميل النسخة الكاملة (PDF)
                    </button>
                    <button className="px-6 py-3 border border-[#32A88D] text-[#32A88D] rounded-xl hover:bg-[#32A88D]/10 transition-all duration-300">
                      التواصل مع الدعم
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
