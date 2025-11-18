import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

const ServicesCard = [
  {
    id: 1,
    title: "حجز ذكي",
    details:
      "احجز موعدك بخطوات سهلة وسريعة، مع نظام حجز ذكي يتيح لك اختيار المختص المناسب والوقت الأنسب لك بكل مرونة.",
    icon: "/images/home/icons/reservation.svg",
  },
  {
    id: 2,
    title: "استشارة فورية",
    details:
      "احصل على استشارة علاج طبيعي مباشرة من مختصين مؤهلين، في أي وقت تحتاج فيه للدعم أو التوجيه السريع.",
    icon: "/images/home/icons/consultation.svg",
  },
  {
    id: 3,
    title: "فيديوهات تعليمية",
    details:
      "فيديوهات متخصصة في تمارين العلاج الطبيعي والتقنيات الصحيحة، تساعدك على التعافي ومتابعة حالتك من المنزل بسهولة.",
    icon: "/images/home/icons/video.svg",
  },
  {
    id: 4,
    title: "ملف صحي",
    details:
      "ملف صحي ذكي يُسجل حالتك وتطورك أولًا بأول، مع إمكانية المتابعة المستمرة من المختصين لتحسين نتائج العلاج.",
    icon: "/images/home/icons/file.svg",
  },
  {
    id: 5,
    title: "متابعة مستمرة",
    details:
      "تواصل دائم مع المختصين لمتابعة حالتك، وضمان التقدم في العلاج بخطة مرنة ومناسبة لحاجتك الفردية.",
    icon: "/images/home/icons/follow-up.svg",
  },
  {
    id: 6,
    title: "قريبون منك",
    details:
      "نوصلك بأقرب مراكز التأهيل وأخصائيي العلاج الطبيعي حسب موقعك، لتبدأ رحلة التعافي بسهولة وفي المكان الأنسب لك.",
    icon: "/images/home/icons/there-are-close.svg",
  },
];

export default function Services() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden">
      {/* أشكال خلفية دائرية */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-16">
          {/* شارة */}
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
            <span>خدمات متكاملة</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
            خدماتنا{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]">
              المميزة
            </span>
          </h2>

          {/* الخط الفاصل */}
          <div className="w-20 h-1.5 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full mb-8 mx-auto"></div>

          <p className="text-lg text-gray-600 leading-8 max-w-2xl mx-auto">
            نوفّر خدمات طبية متكاملة ومبتكرة لعلاج الفيزيائي، مصمّمة لتلبية
            احتياجاتك الصحية بدقة، باستخدام أحدث التقنيات وأفضل المختصين.
          </p>
        </div>

        {/* بطاقات الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ServicesCard.map((Service) => (
            <Card 
              key={Service.id}
              className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <CardHeader className="text-center pb-4">
                {/* أيقونة الخدمة */}
                <div className="mx-auto mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Image 
                        src={Service.icon} 
                        alt={`${Service.title} icon`} 
                        width={24} 
                        height={24} 
                        className="filter brightness-0 invert"
                      />
                    </div>
                  </div>
                </div>

                <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                  {Service.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center pt-0">
                <CardDescription className="text-gray-600 leading-7 text-base">
                  {Service.details}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium">
            اكتشف جميع خدماتنا
          </button>
        </div>
      </div>
    </section>
  );
}