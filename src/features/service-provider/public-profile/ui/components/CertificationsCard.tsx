// src/features/service-provider/ui/components/CertificationsCard.tsx
import { Award, CheckCircle } from "lucide-react";

interface CertificationsCardProps {
  countriesCertified?: string;
}

export default function CertificationsCard({
  countriesCertified,
}: CertificationsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-[#32A88D]" />
        الشهادات والتراخيص
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>{countriesCertified || "غير محدد"}</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>مختص معتمد</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>عضو جمعية الأطباء النفسيين</span>
        </div>
      </div>
    </div>
  );
}