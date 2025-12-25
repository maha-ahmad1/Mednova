import Image from "next/image";
import { Star, MapPin, University, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ServiceProvider } from "@/features/service-provider/types/provider";



interface ProfileHeaderProps {
  therapist: ServiceProvider;
}

export default function ProfileHeader({ therapist }: ProfileHeaderProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-gray-100">
              <Image
                src={therapist.image || "/images/home/therapist.jpg"}
                alt={therapist.full_name}
                fill
                className="object-cover"
                sizes="(max-width: 128px) 100vw, 128px"
              />
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="xl:text-3xl text-lg font-bold text-gray-800">
                  {therapist.full_name}
                </h1>
              </div>

              {/* Rating */}
              {/* Rating */}
<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
  <div className="flex items-center">
    {renderStars(therapist.average_rating || 0)}
  </div>
  <span className="text-gray-600">
    ({therapist.total_reviews || 0} تقييم)
  </span>
</div>

{/* Specialties */}
<div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
  {therapist.specialties?.map((specialty) => (
    <Badge key={specialty.id} variant="outline" className="bg-gray-50 px-3 py-1">
      {specialty.name}
    </Badge>
  ))}
</div>

{/* Stats */}
<div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
  <div className="flex items-center gap-2">
    <MapPin className="w-4 h-4" />
    <span>{therapist.location_details?.city || "غير محدد"}</span>
  </div>
  <div className="flex items-center gap-2">
    <University className="w-4 h-4" />
    <span>{therapist.therapist_details?.university_name || "غير محدد"}</span>
  </div>
  <div className="flex items-center gap-2">
    <Clock className="w-4 h-4" />
    <span>{therapist.therapist_details?.experience_years || 0} سنوات خبرة</span>
  </div>
</div>

             </div>
          </div>
        </div>
      </div>
    </div>
  );
}