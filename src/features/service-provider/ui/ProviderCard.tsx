"use client";

import React from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  GraduationCap,
  Award,
  Building2,
  Banknote,
  Video,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { ServiceProvider } from "@/types/therapist";
// import { ConsultationDialog } from "./ConsultationDialog";
import { ServiceProvider } from "../types/provider";
import { ConsultationDialog } from "./ConsultationDialog";
import Link from "next/link";
interface ProviderCardProps {
  provider: ServiceProvider;
  showLocation?: boolean;
  locationText?: string;
  showStatusBadge?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const isTherapist = provider.type_account === "therapist";
  const rating = provider.average_rating ? Number(provider.average_rating) : 0;

  const getSpecialties = () => {
    if (isTherapist) {
      return (
        provider.therapist_details?.medical_specialties?.name || "تخصص عام"
      );
    }
    return provider.medicalSpecialties?.[0]?.name || "مركز تأهيلي";
  };

  const getPrices = () => {
    return {
      chatPrice: provider.chat_price || 129, // قيمة افتراضية
      videoPrice: provider.video_price || 65, // قيمة افتراضية
      currency: "دولار", // يمكنك تغييرها حسب بياناتك
    };
  };
  const prices = getPrices();

  const getEducation = () => {
    if (isTherapist) {
      return provider.therapist_details?.university_name || "غير محدد";
    }
    return `تأسس عام ${
      provider.center_details?.year_establishment || "غير محدد"
    }`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* الصورة */}
      <div className="relative overflow-hidden">
        <Image
          src={provider.image || "/images/home/therapist.jpg"}
          width={400}
          height={300}
          alt={provider.full_name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
            <MapPin className="w-3 h-3 mr-1" />
            {provider.location_details?.city || "غير محدد"}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* المعلومات */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Link href={`/therapists/${provider.id}`}>
            <h3 className="text-xl font-bold text-gray-800 line-clamp-1 hover:text-[#32A88D]">
              {provider.full_name}
            </h3>
          </Link>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isTherapist ? (
              <GraduationCap className="w-4 h-4 text-[#32A88D]" />
            ) : (
              <Building2 className="w-4 h-4 text-[#32A88D]" />
            )}
            <span className="line-clamp-1">{getEducation()}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="w-4 h-4 text-[#32A88D]" />
            <span className="line-clamp-1">{getSpecialties()}</span>
          </div>
        </div>

        {/* السعر - تصميم مضغوط */}
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="w-4 h-4 text-[#32A88D] flex-shrink-0" />
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <p>محادثة</p>
              <span className="font-bold">{prices.chatPrice}</span>
              <span className="text-gray-500 text-xs">{prices.currency}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <p>فيديو</p>
              <span className="font-bold">{prices.videoPrice}</span>
              <span className="text-gray-500 text-xs">{prices.currency}</span>
            </div>
          </div>
        </div>

        {/* التقييمات */}
        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-300 text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({provider.total_reviews || 0} تقييم)
            </span>
          </div>
          <span className="text-xs bg-[#32A88D]/10 text-[#32A88D] px-2 py-1 rounded-full">
            {isTherapist ? "مختص" : "مركز"}
          </span>
        </div> */}

        <ConsultationDialog provider={provider} />
      </div>
    </div>
  );
};
