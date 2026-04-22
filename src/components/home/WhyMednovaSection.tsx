import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";

const reasons = [
  {
    title: "حجز سريع",
    description: "اختر مختصك ووقتك المناسب بخطوات قليلة وواجهة بسيطة.",
  },
  {
    title: "استشارات فورية",
    description: "جلسات نصية أو فيديو بسرعة استجابة عالية للحالات العاجلة.",
  },
  {
    title: "ملف صحي ذكي",
    description: "متابعة خطة التأهيل والتقدم العلاجي في ملف رقمي موحد.",
  },
];

const badges = [
  { label: "معتمد طبياً", icon: BadgeCheck },
  { label: "خصوصية تامة", icon: ShieldCheck },
  { label: "24/7", icon: Clock3 },
];

export default function WhyMednovaSection() {
  return (
    <section className="bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 px-4 py-16 md:px-10" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-right">
          <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">لماذا MedNova؟</h2>
          <p className="max-w-3xl text-gray-600">نجمع بين الخبرة الطبية والسهولة الرقمية لتسريع رحلة التعافي بثقة.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex items-center justify-center gap-2 rounded-xl border border-[#32A88D]/20 bg-white px-4 py-3 text-[#2a8a7a]">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
