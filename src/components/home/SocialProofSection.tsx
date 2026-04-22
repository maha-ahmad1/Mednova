import Image from "next/image";
import { Star } from "lucide-react";

const therapists = [
  {
    id: 1,
    name: "د. سارة الحارثية",
    specialty: "إعادة تأهيل الإصابات الرياضية",
    rating: 4.9,
    sessions: "+1,200 جلسة",
    image: "/images/home/therapist.jpg",
  },
  {
    id: 2,
    name: "أ. محمد البلوشي",
    specialty: "علاج آلام الرقبة والظهر",
    rating: 4.8,
    sessions: "+980 جلسة",
    image: "/images/home/therapist.jpg",
  },
  {
    id: 3,
    name: "د. مريم الرواحية",
    specialty: "التأهيل العصبي والوظيفي",
    rating: 4.95,
    sessions: "+1,450 جلسة",
    image: "/images/home/therapist.jpg",
  },
];

const reviews = [
  "تجربة ممتازة، حصلت على خطة واضحة وتحسن ملحوظ خلال أسبوعين.",
  "الحجز سريع جدًا والمختصة كانت دقيقة في التشخيص والمتابعة.",
  "أكثر شيء أعجبني هو سرعة الرد والدعم المستمر بعد الجلسة.",
  "المنصة سهلة جدًا واختيار المعالج كان مناسب لحالتي من أول مرة.",
];

export default function SocialProofSection() {
  return (
    <section className="bg-white px-4 py-16 md:px-10" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-right">
          <h2 className="mb-3 text-3xl font-bold text-gray-800 md:text-4xl">مختصون موثوقون وتجارب حقيقية</h2>
          <p className="text-gray-600">اختر من مختصين مع تقييمات موثقة وجلسات فعلية على المنصة.</p>
          {/* TODO: replace hardcoded therapists and reviews with CMS/API-driven data. */}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {therapists.map((therapist) => (
            <article key={therapist.id} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Image src={therapist.image} alt={therapist.name} width={72} height={72} className="h-16 w-16 rounded-full object-cover" />
                <div className="text-right">
                  <h3 className="font-bold text-gray-800">{therapist.name}</h3>
                  <p className="text-sm text-gray-600">{therapist.specialty}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{therapist.rating}</span>
                </div>
                <span>{therapist.sessions}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-3">
          {reviews.map((review, idx) => (
            <div key={idx} className="min-w-[260px] rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:min-w-[320px]">
              <div className="mb-3 flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-7 text-gray-600">«{review}»</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
