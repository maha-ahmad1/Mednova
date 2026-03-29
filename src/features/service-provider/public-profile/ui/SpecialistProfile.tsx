"use client";

import { useEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Star } from "lucide-react";
import { ConsultationDialog } from "@/features/service-provider/ui/ConsultationDialog";
import { useFetcher } from "@/hooks/useFetcher";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileDetails from "./profile/ProfileDetails";
import ServicesPricing from "./profile/ServicesPricing";
import ScheduleCard from "./profile/ScheduleCard";
import type { ServiceProvider } from "@/features/service-provider/types/provider";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import { ReviewsSection } from "@/features/service-provider/public-profile/ui/reviews/ReviewsSection";
import { useSession } from "next-auth/react";
import { EmptyState } from "@/shared/ui/components/EmptyState";
import { normalizeProvider } from "@/utils/normalizeProvider";

export default function SpecialistProfile(): React.ReactNode {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const reviewsTabRef = useRef<HTMLDivElement>(null);

  const { data: rawProvider, isLoading, error } = useFetcher<ServiceProvider | null>(
    ["providerProfile", params.id],
    params.id ? `/api/customer/${params.id}` : null
  );

  const provider = rawProvider ? normalizeProvider(rawProvider) : null;
  const { data: session } = useSession();
  const currentUserId = typeof session?.user?.id === "number" ? session.user.id : 0;

  useEffect(() => {
    if (!rawProvider || !params.id) return;

    if (
      rawProvider.type_account === "rehabilitation_center" &&
      pathname?.startsWith("/therapists/")
    ) {
      router.replace(`/centers/${params.id}`);
    }
  }, [rawProvider, pathname, params.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  if (error || !rawProvider || !provider) {
    return (
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50/50 to-white">
        <EmptyState
          type="error"
          title="حدث خطأ"
          description="لم يتم العثور على المختص"
          actionText="إعادة المحاولة"
          onAction={() => window.location.reload()}
        />
      </section>
    );
  }

  return (
    <>
      <Navbar variant="landing" />
      <BreadcrumbNav currentPage="الملف الشخصي" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProfileHeader provider={provider} />

              <Tabs
                defaultValue="bio"
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-4"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="reviews" className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    التقييمات
                  </TabsTrigger>

                  <TabsTrigger value="bio" className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    السيرة الذاتية
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bio" className="mt-0 text-right">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ServicesPricing provider={provider} />

                      <ProfileDetails
                        specialties={provider.specialties || []}
                        universityName={rawProvider.therapist_details?.university_name ?? ""}
                        graduationYear={rawProvider.therapist_details?.graduation_year ?? ""}
                        experienceYears={provider.experienceYears || 0}
                        medicalSpecialty={rawProvider.therapist_details?.medical_specialties?.name}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">نبذة عن المختص</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {provider.bio || "لا توجد معلومات متاحة حالياً."}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 text-right">
                  <div className="space-y-6" ref={reviewsTabRef}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-gray-800">{provider.rating.toFixed(1)}</div>
                            <div className="text-gray-500">من 5.0</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-6 h-6 ${
                                    i < Math.floor(provider.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-gray-600 mt-1">({provider.reviewsCount} تقييم)</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ReviewsSection
                      reviewerId={currentUserId}
                      revieweeId={provider.id}
                      revieweeType="customer"
                      revieweeName={provider.name}
                      showTriggerButton={true}
                      triggerButtonText="اكتب تقييمك"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">اختر موعد الجلسة</h3>

                    <ScheduleCard provider={provider} />

                    <div className="my-6">
                      <ConsultationDialog
                        showProfileButton={false}
                        buttonClassName="px-8"
                        provider={{
                          ...rawProvider,
                          full_name: provider.name,
                          bio: provider.bio,
                          experience_years: provider.experienceYears || 0,
                          average_rating: provider.rating,
                          total_reviews: provider.reviewsCount,
                          services: provider.services,
                          type_account: provider.type,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
