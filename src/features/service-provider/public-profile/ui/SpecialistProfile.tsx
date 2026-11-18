"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Edit, Star } from "lucide-react";
import { ConsultationDialog } from "@/features/service-provider/ui/ConsultationDialog";
import { useFetcher } from "@/hooks/useFetcher";
import { cn } from "@/lib/utils";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileDetails from "./profile/ProfileDetails";
import ServicesPricing from "./profile/ServicesPricing";
import ScheduleCard from "./profile/ScheduleCard";
import type { ServiceProvider } from "@/features/service-provider/types/provider";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import {
  ReviewsSection,
  type ReviewAccess,
} from "@/features/service-provider/public-profile/ui/reviews/ReviewsSection";
import { ProviderReviewsList } from "@/features/service-provider/public-profile/ui/reviews/ProviderReviewsList";
import { isOwnReview } from "@/shared/ui/components/reviews";
import { OverallRating } from "@/features/programs/ui/program-detail/components/course-reviews/OverallRating";
import { RatingDistribution } from "@/features/programs/ui/program-detail/components/course-reviews/RatingDistribution";
import { useQueryClient } from "@tanstack/react-query";
import { useRatings } from "@/hooks/useRatings";
import { Link, usePathname as useIntlPathname } from "@/i18n/navigation";
import { buildLoginHref } from "@/lib/safe-redirect";
import { useSession } from "next-auth/react";
import { EmptyState } from "@/shared/ui/components/EmptyState";
import { normalizeProvider } from "@/utils/normalizeProvider";

export default function SpecialistProfile(): React.ReactNode {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const reviewsTabRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("specialists.publicProfile");
  const tCard = useTranslations("specialists.card");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("bio");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [isBioClamped, setIsBioClamped] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  const {
    data: rawProvider,
    isLoading,
    error,
  } = useFetcher<ServiceProvider | null>(
    ["providerProfile", params.id],
    params.id ? `/api/customer/${params.id}` : null,
    { requiresAuth: false },
  );

  const provider = rawProvider
    ? normalizeProvider(rawProvider, {
        notSpecified: tCard("notSpecified"),
        citySeparator: locale === "ar" ? "، " : ", ",
        chatServiceName: t("services.chatServiceName"),
        chatServiceDesc: t("services.chatServiceDesc"),
        videoServiceName: t("services.videoServiceName"),
        videoServiceDesc: t("services.videoServiceDesc"),
        university: t("details.university"),
        graduationYear: t("details.graduationYear"),
        experienceYearsLabel: t("details.experienceYears"),
        yearsUnit: (years) => t("details.yearsUnit", { years }),
        yearEstablishment: t("details.yearEstablishment"),
        location: t("details.location"),
        licenseAuthority: t("details.licenseAuthority"),
      })
    : null;
  const { data: session } = useSession();
  // session.user.id is a string (see lib/auth.ts); 0 means "not logged in".
  const currentUserId = Number(session?.user?.id) || 0;

  const queryClient = useQueryClient();
  const loginPathname = useIntlPathname();
  const providerId = provider?.id ?? 0;
  const { data: ratings, isLoading: ratingsLoading } = useRatings("customer", providerId);
  const ratingsList = ratings ?? [];

  // Average, count and per-star distribution are derived from the ratings list:
  // the provider endpoint returns average_rating / total_reviews as null for now (backend bug),
  // and it has no per-star counts like programs do.
  const ratingStats = useMemo(() => {
    const count = ratingsList.length;
    const counts = [5, 4, 3, 2, 1].map(
      (stars) => ratingsList.filter((r) => Math.round(Number(r.rating)) === stars).length,
    );
    const sum = ratingsList.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return {
      count,
      average: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
      distribution: counts.map((c, i) => ({
        stars: 5 - i,
        count: c,
        percentage: count > 0 ? Math.round((c / count) * 100) : 0,
      })),
    };
  }, [ratingsList]);

  const myRating = currentUserId
    ? ratingsList.find((r) => isOwnReview(r, currentUserId))
    : undefined;

  const reviewAccess: ReviewAccess =
    currentUserId === 0
      ? "guest"
      : currentUserId === providerId
        ? "own"
        : myRating
          ? "reviewed"
          : "can";

  const handleReviewSubmitted = () => {
    queryClient.invalidateQueries({ queryKey: ["providerProfile", params.id] });
    queryClient.invalidateQueries({ queryKey: ["ratings", "customer", providerId] });
  };

  useEffect(() => {
    if (!rawProvider || !params.id) return;

    if (
      rawProvider.type_account === "rehabilitation_center" &&
      pathname?.startsWith("/therapists/")
    ) {
      router.replace(`/centers/${params.id}`);
    }
  }, [rawProvider, pathname, params.id, router]);

  useEffect(() => {
    const el = bioRef.current;
    if (el) {
      setIsBioClamped(el.scrollHeight > el.clientHeight);
    }
  }, [provider?.bio, activeTab]);

  const scrollToReviews = () => {
    setActiveTab("reviews");
    setTimeout(() => {
      reviewsTabRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

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
          title={t("errorTitle")}
          description={t("notFoundDesc")}
          actionText={tCommon("tryAgain")}
          onAction={() => window.location.reload()}
        />
      </section>
    );
  }

  return (
    <>
      <Navbar variant="landing" />
      <BreadcrumbNav currentPage={t("breadcrumb")} />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProfileHeader provider={provider} />

              {/* Radix Tabs defaults to dir="ltr" and overrides the page direction. */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                dir={locale === "ar" ? "rtl" : "ltr"}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-4"
              >
                {/* Bio first: it is the default tab, so it sits at the start (right in Arabic). */}
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger
                    value="bio"
                    className="text-lg flex items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    {t("bioTab")}
                  </TabsTrigger>

                  <TabsTrigger
                    value="reviews"
                    className="text-lg flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    {t("reviewsTab")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="bio" className="mt-0 text-start">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Specialties/details first so they sit at the start (right in Arabic). */}
                      <ProfileDetails provider={provider} />

                      <ServicesPricing provider={provider} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {rawProvider.type_account === "rehabilitation_center"
                          ? t("aboutTitleCenter")
                          : t("aboutTitle")}
                      </h3>
                      <p
                        ref={bioRef}
                        className={cn(
                          "max-w-3xl text-base leading-7 text-gray-600",
                          !bioExpanded && "line-clamp-3",
                        )}
                      >
                        {provider.bio || t("noInfoAvailable")}
                      </p>
                      {isBioClamped && (
                        <button
                          type="button"
                          onClick={() => setBioExpanded((prev) => !prev)}
                          className="text-[#32A88D] text-sm font-medium mt-2 hover:underline"
                        >
                          {bioExpanded ? t("showLess") : t("showMore")}
                        </button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 text-start">
                  <div className="space-y-6" ref={reviewsTabRef}>
                    {/* Same summary as the course page: average + per-star distribution. */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <div className="grid md:grid-cols-3 gap-8 items-center">
                        <OverallRating
                          rating={ratingStats.average}
                          reviewCount={ratingStats.count}
                        />
                        <div className="md:col-span-2">
                          <RatingDistribution distribution={ratingStats.distribution} />
                        </div>
                      </div>
                    </div>

                    <ReviewsSection
                      reviewerId={currentUserId}
                      revieweeId={provider.id}
                      revieweeType="customer"
                      revieweeName={provider.name}
                      access={reviewAccess}
                      loginHref={buildLoginHref(loginPathname)}
                      myReview={myRating}
                      triggerButtonText={t("writeYourReview")}
                      onReviewSubmitted={handleReviewSubmitted}
                    />

                    <ProviderReviewsList
                      ratings={ratingsList}
                      isLoading={ratingsLoading}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                      {t("chooseSessionTime")}
                    </h3>

                    <ScheduleCard provider={provider} />

                    <div className="my-6 space-y-3">
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

                      {reviewAccess === "can" && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={scrollToReviews}
                          className="w-full border-[#32A88D]/40 text-[#2a8a7a] hover:bg-[#32A88D]/10"
                        >
                          <Edit className="w-4 h-4 me-2" />
                          {t("writeReview")}
                        </Button>
                      )}
                      {reviewAccess === "guest" && (
                        <p className="text-center text-sm text-gray-600">
                          {t("reviews.loginPrompt")}{" "}
                          <Link
                            href={buildLoginHref(loginPathname)}
                            className="font-semibold text-[#32A88D] hover:underline"
                          >
                            {t("reviews.loginLink")}
                          </Link>
                        </p>
                      )}
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
