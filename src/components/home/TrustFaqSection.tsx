"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const partners = ["شريك علاجي 1", "شريك علاجي 2", "شريك علاجي 3", "شريك علاجي 4"];

const faqs = [
  {
    question: "كيف أحجز جلسة مع مختص؟",
    answer: "ابحث عن التخصص أو اسم المعالج، ثم اختر الوقت المناسب وأكمل الحجز خلال دقائق.",
  },
  {
    question: "هل المختصون في MedNova معتمدون؟",
    answer: "نعم، يتم التحقق من تراخيص وخبرات المختصين قبل ظهورهم على المنصة.",
  },
  {
    question: "هل يمكنني متابعة الخطة العلاجية من المنزل؟",
    answer: "بالتأكيد، يمكنك الوصول للتمارين والتقارير والمتابعة المستمرة عبر ملفك الصحي الذكي.",
  },
  {
    question: "هل بياناتي الطبية آمنة؟",
    answer: "نلتزم بمعايير حماية البيانات الطبية ونطبق آليات تشفير وحوكمة وصول للبيانات.",
  },
];

export default function TrustFaqSection() {
  return (
    <section className="bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 px-4 py-16 md:px-10" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-right">
          <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">الثقة أولاً</h2>
          <p className="text-gray-600">معتمد من وزارة الصحة (عند التطبيق) وشراكات داعمة لمسار علاجي آمن.</p>
          {/* TODO: replace placeholder partners/certifications with approved legal and partner assets. */}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {partners.map((partner) => (
            <div key={partner} className="rounded-xl border border-dashed border-[#32A88D]/30 bg-white px-3 py-5 text-center text-sm text-gray-600">
              {partner}
            </div>
          ))}
        </div>

        <Accordion type="single" collapsible className="rounded-2xl border border-gray-100 bg-white px-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-right hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-right text-gray-600">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
