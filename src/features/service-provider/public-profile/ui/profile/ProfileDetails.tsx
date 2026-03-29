import { Badge } from "@/components/ui/badge";
import type { NormalizedProvider } from "@/utils/normalizeProvider";

interface ProfileDetailsProps {
  provider: NormalizedProvider;
}

export default function ProfileDetails({ provider }: ProfileDetailsProps) {
  return (
    <div className="space-y-4 text-right" dir="rtl">
      <div className="flex items-start gap-3">
        <span className="text-gray-500 text-sm whitespace-nowrap">التخصصات:</span>
        <div className="flex flex-wrap gap-2">
          {provider.specialties?.length > 0 ? (
            provider.specialties.map((specialty) => (
              <Badge
                key={specialty.id}
                className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1.5 text-sm"
              >
                {specialty.name}
              </Badge>
            ))
          ) : (
            <Badge className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1.5 text-sm">
              غير محدد
            </Badge>
          )}
        </div>
      </div>

      {provider.details.map((detail) => (
        <div className="flex gap-2" key={detail.label}>
          <span className="text-gray-500 text-sm whitespace-nowrap">{detail.label}:</span>
          <span className="text-gray-800">{detail.value}</span>
        </div>
      ))}
    </div>
  );
}
