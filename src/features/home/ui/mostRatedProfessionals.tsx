"use client";

import React from "react";
import { useFetcher } from "@/hooks/useFetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { ProviderCard } from "@/features/service-provider/ui/ProviderCard"; 
import { ServiceProvider } from "@/features/service-provider/types/provider"; 
import { EmptyState } from "@/shared/ui/components/EmptyState";

type MedicalSpecialties = {
  id: number;
  name: string;
  description: string;
};

type TherapistDetails = {
  id: number;
  medical_specialties: MedicalSpecialties;
  university_name: string;
  countries_certified: string;
};

type TypeItem = {
  id: number;
  full_name: string;
  image: string;
  therapist_details: TherapistDetails;
  total_reviews: number;
  average_rating: number;
};

export default function MostRatedProfessionals() {
  const { data, isLoading, error } = useFetcher<TypeItem[]>(
    ["mostRatedProfessionals"],
    "/api/rating?typeServiceProvider=therapist"
  );

  const items = data?.slice(0, 4) || [];

  const convertToServiceProvider = (item: TypeItem): ServiceProvider => {
    return {
      id: item.id,
      full_name: item.full_name,
      type_account: "therapist",
      image: item.image || "/images/home/therapist.jpg",
      email: "",
      phone: "",
      bio: "",
      experience_years: item.therapist_details?.university_name ? 0 : 0,
      average_rating:
        typeof item.average_rating === "number"
          ? item.average_rating
          : Number(item.average_rating) || 0,
      total_reviews: item.total_reviews || 0,
      therapist_details: item.therapist_details
        ? {
            id: item.therapist_details.id,
            medical_specialties: {
              id: item.therapist_details.medical_specialties.id,
              name: item.therapist_details.medical_specialties.name,
              description:
                item.therapist_details.medical_specialties.description || "",
            },
            experience_years: 0,
            university_name: item.therapist_details.university_name || "",
            countries_certified:
              item.therapist_details.countries_certified || "",
            graduation_year: "",
            certificate_file: null,
            license_number: "",
            license_authority: "",
            license_file: null,
            bio: "",
          }
        : undefined,
      // location_details: {
      //   city: "متصل الآن",
      // },
    };
  };

  // حالة التحميل
  if (isLoading) {
    return (
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse"
              >
                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white">
        <EmptyState
          type="error"
          title="حدث خطأ"
          description="تعذر تحميل بيانات المختصين"
          actionText="إعادة المحاولة"
          onAction={() => window.location.reload()}
        />
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* الهيدر */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-6 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            <span className="text-sm font-medium text-[#32A88D]">
              المختصون المميزون
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            المختصون الأكثر تقييماً
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اختر من بين أفضل المختصين المعتمدين ذوي الخبرة الواسعة والتقييمات
            المرتفعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {items.map((item: TypeItem) => (
            <ProviderCard
              key={item.id}
              provider={convertToServiceProvider(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
