import { Badge } from "@/components/ui/badge";

interface ProfileDetailsProps {
  specialties: Array<{ id: number; name: string }>;
  universityName: string;
  graduationYear: string;
  experienceYears: number;
  medicalSpecialty?: string;
}

export default function ProfileDetails({
  specialties,
  universityName,
  graduationYear,
  experienceYears,
  medicalSpecialty,
}: ProfileDetailsProps) {
  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Specialties */}
      <div className="flex items-start gap-3">
        <span className="text-gray-500 text-sm whitespace-nowrap">
          التخصصات:
        </span>
        <div className="flex flex-wrap gap-2">
          {specialties?.length > 0 ? (
            specialties.map((specialty) => (
              <Badge
                key={specialty.id}
                className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1.5 text-sm"
              >
                {specialty.name}
              </Badge>
            ))
          ) : (
            <Badge className="bg-[#32A88D]/10 text-[#32A88D] px-3 py-1.5 text-sm">
              {medicalSpecialty || "غير محدد"}
            </Badge>
          )}
        </div>
      </div>

      {/* University */}
      <div className="flex gap-2">
        <span className="text-gray-500 text-sm whitespace-nowrap">
          الجامعة:
        </span>
        <span className="text-gray-800">
          {universityName || "غير محدد"}
        </span>
      </div>

      {/* Graduation Year */}
      <div className="flex gap-2">
        <span className="text-gray-500 text-sm whitespace-nowrap">
          سنة التخرج:
        </span>
        <span className="text-gray-800">
          {graduationYear || "غير محدد"}
        </span>
      </div>

      {/* Experience */}
      <div className="flex gap-2">
        <span className="text-gray-500 text-sm whitespace-nowrap">
          سنوات الخبرة:
        </span>
        <span className="text-gray-800">
          {experienceYears} سنوات
        </span>
      </div>
    </div>
  );
}
