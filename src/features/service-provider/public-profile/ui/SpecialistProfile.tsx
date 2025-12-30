// src/features/service-provider/ui/SpecialistProfile.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Star, Edit, Award } from "lucide-react";
import { ConsultationDialog } from "@/features/service-provider/ui/ConsultationDialog";
import { useFetcher } from "@/hooks/useFetcher";
//import LandingNavbar from "@/shared/ui/layout/LandingNavbar";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileDetails from "./profile/ProfileDetails";
import ServicesPricing from "./profile/ServicesPricing";
import ScheduleCard from "./profile/ScheduleCard";
import CertificationsCard from "./profile/CertificationsCard";
import ReviewsSection from "./profile/ReviewsSection";
import { ServiceProvider } from "@/features/service-provider/types/provider";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
 import { ReviewDialog } from "./profile/ReviewDialog";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
// import { ReviewDialog } from "./reviews/ReviewDialog";


export default function SpecialistProfile() {
  const params = useParams();
  const router = useRouter();
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      // استدعاء API لإرسال التقييم
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          therapist_id: therapist?.id,
          rating,
          comment,
          patient_id: "current-user-id", // يجب استبدالها بالـ ID الفعلي للمستخدم
        }),
      });

      if (!response.ok) {
        throw new Error("فشل إرسال التقييم");
      }

      return await response.json();
    } catch (error) {
      console.error("خطأ في إرسال التقييم:", error);
      throw error;
    }
  };
  const {
    data: therapist,
    isLoading,
    error,
  } = useFetcher<ServiceProvider | null>(
    ["providerProfile", params.id],
    params.id ? `/api/customer/${params.id}` : null
  );

  // معالجة حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-2xl mb-6" />
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // معالجة حالة الخطأ
  if (error || !therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">حدث خطأ</h3>
          <p className="text-gray-600 mb-4">
            {error?.message || "لم يتم العثور على المختص"}
          </p>
          <Button onClick={() => router.back()}>العودة للخلف</Button>
        </div>
      </div>
    );
  }

  // الحصول على الجدول الزمني الأول
  const schedule = therapist?.schedules?.[0];

  return (
    <>
      <Navbar variant="landing" />
      {/* Breadcrumb Navigation - Reusable Component */}
      <BreadcrumbNav currentPage="الملف الشخصي" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* المحتوى الرئيسي */}
            <div className="lg:col-span-2">
              {/* Profile Header - Reusable Component */}
              <ProfileHeader therapist={therapist} />

              {/* التبويبات */}
              <Tabs
                defaultValue="bio"
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-4"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger
                    value="reviews"
                    className="text-lg flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    التقييمات
                  </TabsTrigger>

                  <TabsTrigger
                    value="bio"
                    className="text-lg flex items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    السيرة الذاتية
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bio" className="mt-0 text-right">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Profile Details - Reusable Component */}

                      <ServicesPricing services={therapist.services} />

                      <ProfileDetails
                        specialties={therapist.specialties || []}
                        universityName={
                          therapist.therapist_details?.university_name ?? ""
                        }
                        graduationYear={
                          therapist.therapist_details?.graduation_year ?? ""
                        }
                        experienceYears={
                          therapist.therapist_details?.experience_years || 0
                        }
                        medicalSpecialty={
                          therapist.therapist_details?.medical_specialties?.name
                        }
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        نبذة عن المختص
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {therapist.therapist_details?.bio ||
                          "لا توجد معلومات متاحة حالياً."}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 text-right">
                  {/* Reviews Section - Reusable Component */}
                  <ReviewsSection
                    totalReviews={therapist.total_reviews || 0}
                    onWriteReview={() => setShowReviewDialog(true)}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* الشريط الجانبي */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Booking & Schedule Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                      اختر موعد الجلسة
                    </h3>

                    {/* Schedule Card - Reusable Component */}
                    <ScheduleCard schedule={schedule} />

                    {/* أزرار الحجز والتقييم */}
                    <div className="my-6">
                      <ConsultationDialog
                        showProfileButton={false}
                        buttonClassName="px-8"
                        provider={{
                          id: therapist.id,
                          full_name: therapist.full_name,
                          type_account: therapist.type_account || "therapist",
                          image: therapist.image,
                          average_rating:
                            typeof therapist.average_rating === "number"
                              ? therapist.average_rating
                              : Number(therapist.average_rating) || 0,
                          total_reviews: therapist.total_reviews || 0,
                          therapist_details: therapist.therapist_details,
                          email: therapist.email || "",
                          phone: therapist.phone || "",
                          bio: therapist.therapist_details?.bio || "",
                          experience_years:
                            therapist.therapist_details?.experience_years || 0,
                        }}
                      />

                      <div className="mt-2">
                        <Button
                          onClick={() => setShowReviewDialog(true)}
                          variant="outline"
                          className="cursor-pointer w-full bg-white/90 backdrop-blur-sm text-[#32A88D] hover:bg-white border border-[#32A88D]/30 hover:border-[#32A88D] rounded-xl py-6 transition-all duration-300"
                        >
                          <Edit className="w-5 h-5 ml-2" />
                          اكتب تقييم
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications Card - Reusable Component */}
                <CertificationsCard
                  countriesCertified={
                    therapist.therapist_details?.countries_certified
                  }
                />
                <ReviewDialog
                  open={showReviewDialog}
                  onOpenChange={setShowReviewDialog}
                  therapistId={therapist.id}
                  therapistName={therapist.full_name}
                  onSubmit={handleReviewSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
