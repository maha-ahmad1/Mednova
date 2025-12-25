import { ServiceProvider } from "@/features/service-provider/types/provider";

interface ServicesPricingProps {
  services?: ServiceProvider["services"];
}

export default function ServicesPricing({ services }: ServicesPricingProps) {
  const defaultServices = [
    {
      id: 1,
      name: "استشارة نصية ",
      description: "دردشة عبر المحادثة ",
      price: 30,
    //   duration: "30 دقيقة",
    },
    {
      id: 2,
      name: "جلسة فيديو",
      description: " استشارة متكاملة عبر زووم",
      price: 50,
      duration: "60 دقيقة",
    },
  ];

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <div className="space-y-6 ">
      <h3 className="text-gray-500 text-sm mb-4"> :أسعار الجلسات   </h3>
      <div className="space-y-4">
        {displayServices.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div>
              <div className="font-semibold text-gray-800">{service.name}</div>
              <div className="text-sm text-gray-500">{service.description}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#32A88D]">
                ${service.price}
              </div>
              <div className="text-sm text-gray-500">{service.duration}</div>
            </div>
          </div>
        ))}
      </div>

      {/* VAT Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-700 text-center">
          جميع الأسعار تشمل ضريبة القيمة المضافة ورسوم الخدمة
        </p>
      </div>
    </div>
  );
}