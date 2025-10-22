import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
// import {consultation} from "../../../public/images/home/icons/consultation.svg"

const ServicesCard = [
  {
    id: 1,
    title: "حجز ذكي",
    details:
      "احجز موعدك بخطوات سهلة وسريعة، مع نظام حجز ذكي يتيح لك اختيار المختص المناسب والوقت الأنسب لك بكل مرونة.",
    icon: "",
  },
  {
    id: 2,
    title: "استشارة فورية",
    details:
      "احصل على استشارة علاج طبيعي مباشرة من مختصين مؤهلين، في أي وقت تحتاج فيه للدعم أو التوجيه السريع.",
    icon: "",
  },
  {
    id: 3,
    title: "فيديوهات تعليمية",
    details:
      "فيديوهات متخصصة في تمارين العلاج الطبيعي والتقنيات الصحيحة، تساعدك على التعافي ومتابعة حالتك من المنزل بسهولة.",
    icon: "",
  },
  {
    id: 4,
    title: "ملف صحي",
    details:
      "ملف صحي ذكي يُسجل حالتك وتطورك أولًا بأول، مع إمكانية المتابعة المستمرة من المختصين لتحسين نتائج العلاج.",
    icon: "",
  },
  {
    id: 5,
    title: "متابعة مستمرة",
    details:
      "تواصل دائم مع المختصين لمتابعة حالتك، وضمان التقدم في العلاج بخطة مرنة ومناسبة لحاجتك الفردية.",
    icon: "",
  },
  {
    id: 6,
    title: "قريبون منك",
    details:
      "نوصلك بأقرب مراكز التأهيل وأخصائيي العلاج الطبيعي حسب موقعك، لتبدأ رحلة التعافي بسهولة وفي المكان الأنسب لك.",
    icon: "",
  },
];

export default function Services() {
  return (
    <section className=" bg-[#F8F7F7]  py-20 px-14 md:px-18 lg:px-28">
      <div className="flex flex-col gap-7  mx-auto text-center">
        <div className="  max-w-[400] flex flex-col mx-auto ">
          <h1 className="text-2xl font-bold  p-2">خدماتنا المميزة</h1>
          <div className=" w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mb-2  mx-auto"></div>
          <p className="text-[#4B5563] text-lg leading-7">
            نوفّر خدمات طبية متكاملة ومبتكرة لعلاج الفيزيائي، مصمّمة لتلبية
            احتياجاتك الصحية بدقة، باستخدام أحدث التقنيات وأفضل المختصين.
          </p>
        </div>
        <div className=" flex flex-col md:flex-row gap-10">
          {ServicesCard.map((Service) => {
            return (
              <Card className="max-w-sm" key={Service.id}>
                <CardHeader>
                  <CardTitle className="mx-auto">
                    {Service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{Service.details}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
