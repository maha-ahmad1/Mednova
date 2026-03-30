import Image from "next/image";
import type { NormalizedProvider } from "@/utils/normalizeProvider";

interface ServicesPricingProps {
  provider: NormalizedProvider;
}

export default function ServicesPricing({ provider }: ServicesPricingProps) {
  return (
    <div className="space-y-6 ">
      <h3 className="text-gray-500 text-sm mb-4"> :أسعار الجلسات </h3>
      <div className="space-y-4">
        {provider.services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div>
              <div className="font-semibold text-gray-800">{service.name}</div>
              <div className="text-sm text-gray-500">{service.description}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-2xl font-bold text-[#32A88D]">
                <Image
                  src="/images/Light22.svg"
                  width={14}
                  height={14}
                  className="w-6 h-6 translate-y-[1px] ml-1"
                  alt="OMR currency"
                />
                <span>{service.price}</span>
              </div>
              <div className="text-sm text-gray-500">{service.duration}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-700 text-center">
          جميع الأسعار تشمل ضريبة القيمة المضافة ورسوم الخدمة
        </p>
      </div>
    </div>
  );
}
