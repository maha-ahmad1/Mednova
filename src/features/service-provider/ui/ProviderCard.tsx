"use client";
 
import React from "react";
import Image from "next/image";
import { Star, MapPin, Banknote, Stethoscope } from "lucide-react";
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
  return <span className="text-gray-400 text-xs">{currency}</span>;
};
 
/* =======================
   Specialties Display
======================= */
const SpecialtiesDisplay = ({
  specialtyNames,
  isTherapist,
}: {
  specialtyNames: string[];
  isTherapist: boolean;
}) => {
  const MAX_VISIBLE = 2;
  const visible = specialtyNames.slice(0, MAX_VISIBLE);
  const hidden = specialtyNames.slice(MAX_VISIBLE);
  const hasMore = hidden.length > 0;
 
  const fallback = isTherapist ? "تخصص عام" : "مركز تأهيلي";
  const displayNames = specialtyNames.length > 0 ? visible : [fallback];
 
  return (
    <div className="flex items-center gap-1.5 mb-4 min-h-[28px]">
      {/* أيقونة التخصص */}
      <Stethoscope className="w-3.5 h-3.5 text-[#32A88D] flex-shrink-0" />
 
      {/* التخصصات inline مع فاصل */}
      <p className="text-sm text-gray-600 leading-tight line-clamp-1">
        {displayNames.map((name, index) => (
          <React.Fragment key={name}>
            {index > 0 && (
              <span className="mx-1.5 text-gray-300 select-none">•</span>
            )}
            <span className="font-medium text-gray-700">{name}</span>
          </React.Fragment>
        ))}
 
        {/* عرض +X بشكل نظيف */}
        {hasMore && (
          <span
            className="mr-1.5 text-[#32A88D] font-semibold cursor-help text-xs"
            title={hidden.join("، ")}
          >
            +{hidden.length}
          </span>
        )}
      </p>
    </div>
  );
};
 
/* =======================
   Provider Card
======================= */
export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const isTherapist = provider.type_account === "therapist";
  const rating = provider.average_rating
    ? Number(provider.average_rating)
    : 0;
 
  const specialtyNames = isTherapist
    ? provider.therapist_details?.medical_specialties
      ? [provider.therapist_details.medical_specialties.name]
      : []
    : provider.medicalSpecialties?.map((s) => s.name) ?? [];
 
  const toNumberValue = (
    value: string | number | null | undefined,
    fallback: number
  ) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
  };
 
  const prices = {
    chatPrice: isTherapist
      ? toNumberValue(
          provider.therapist_details?.chat_consultation_price ??
            provider.chat_price,
          129
        )
      : toNumberValue(
          provider.center_details?.chat_consultation_price ??
            provider.chat_price,
          129
        ),
    videoPrice: isTherapist
      ? toNumberValue(
          provider.therapist_details?.video_consultation_price ??
            provider.video_price,
          65
        )
      : toNumberValue(
          provider.center_details?.video_consultation_price ??
            provider.video_price,
          65
        ),
    currency:
      (isTherapist
        ? provider.therapist_details?.currency
        : provider.center_details?.currency) || "OMR",
  };
 
  return (
    <div className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-400 hover:-translate-y-1">
      
      {/* ======= الصورة ======= */}
      <div className="relative overflow-hidden">
        <Image
          src={provider.image || "/images/home/therapist.jpg"}
          width={400}
          height={300}
          alt={provider.full_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
 
        {/* الموقع */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
            <MapPin className="w-3 h-3 text-[#32A88D]" />
            <span>{provider.location_details?.city || "غير محدد"}</span>
          </div>
        </div>
 
        {/* التقييم */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-black/65 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
 
      {/* ======= المحتوى ======= */}
      <div className="p-4">
 
        {/* الاسم */}
        <Link href={`/therapists/${provider.id}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 hover:text-[#32A88D] transition-colors duration-200">
            {provider.full_name}
          </h3>
        </Link>
 
        {/* ======= التخصصات ======= */}
        <SpecialtiesDisplay
          specialtyNames={specialtyNames}
          isTherapist={isTherapist}
        />
 
        {/* ======= الأسعار ======= */}
        <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-xl px-3 py-2">
          <Banknote className="w-4 h-4 text-[#32A88D] flex-shrink-0" />
          <div className="flex items-center gap-3 text-sm w-full">
            
            {/* محادثة */}
            <div className="flex items-center gap-1">
              <span className="text-gray-500">محادثة</span>
              <span className="font-bold text-[#32A88D]">
                {prices.chatPrice}
              </span>
              <CurrencyRenderer currency={prices.currency} />
            </div>
 
            <span className="text-gray-200 select-none">|</span>
 
            {/* فيديو */}
            <div className="flex items-center gap-1">
              <span className="text-gray-500">فيديو</span>
              <span className="font-bold text-[#32A88D]">
                {prices.videoPrice}
              </span>
              <CurrencyRenderer currency={prices.currency} />
            </div>
          </div>
        </div>
 
        {/* ======= الأزرار ======= */}
        <ConsultationDialog provider={provider} />
      </div>
    </div>
  );
};