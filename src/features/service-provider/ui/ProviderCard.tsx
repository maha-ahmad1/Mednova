"use client";

import React from "react";
import Image from "next/image";
import {
  Star,
  MapPin,
  Award,
  Building2,
  Banknote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ServiceProvider } from "../types/provider";
import { ConsultationDialog } from "./ConsultationDialog";
import Link from "next/link";

interface ProviderCardProps {
  provider: ServiceProvider;
  showLocation?: boolean;
  locationText?: string;
  showStatusBadge?: boolean;
}

/* =======================
   Currency Renderer
======================= */
const CurrencyRenderer = ({ currency }: { currency: string }) => {
  if (currency === "OMR") {
    return (
      <Image
        src="/images/Light22.svg"
        width={14}
        height={14}
        className="w-4 h-4 translate-y-[1px]"
        alt="OMR currency"
      />
    );
  }

  return <span className="text-gray-500 text-xs">{currency}</span>;
};

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const isTherapist = provider.type_account === "therapist";
  const rating = provider.average_rating
    ? Number(provider.average_rating)
    : 0;

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
      chatPrice: provider.chat_price || 129,
      videoPrice: provider.video_price || 65,
      currency: "OMR",
    };
  };

  const prices = getPrices();

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
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" />
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

      {/* المحتوى */}
      <div className="p-4">
        <Link href={`/therapists/${provider.id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 hover:text-[#32A88D] transition-colors">
            {provider.full_name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Award className="w-4 h-4 text-[#32A88D]" />
          <span className="line-clamp-1">{getSpecialties()}</span>
        </div>

        {/* الأسعار */}
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="w-4 h-4 text-[#32A88D] flex-shrink-0" />

          <div className="flex items-center gap-3 text-sm">
            {/* محادثة */}
            <div className="flex items-center gap-1">
              <span>محادثة</span>
              <span className="font-bold">{prices.chatPrice}</span>
              <CurrencyRenderer currency={prices.currency} />
            </div>

            <span className="text-gray-300">•</span>

            {/* فيديو */}
            <div className="flex items-center gap-1">
              <span>فيديو</span>
              <span className="font-bold">{prices.videoPrice}</span>
              <CurrencyRenderer currency={prices.currency} />
            </div>
          </div>
        </div>

        <ConsultationDialog provider={provider} />
      </div>
    </div>
  );
};
