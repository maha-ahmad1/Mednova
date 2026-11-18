"use client";

import Image from "next/image";
import { Eye, Clock, Users, Lock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { Program } from "@/features/programs/types/program";
import { RatingBadge } from "@/shared/ui/components/RatingBadge";
import { useTranslations } from 'next-intl';
// export interface ProgramCardData {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   cover_image?: string;
//   image?: string;
//   ratings_avg_rating?: number;
//   ratings_count?: number;
//   enrollments_count?: number | null;
//   creator?: {
//     full_name: string;
//   };
//   status?: string;
//   is_approved?: number;
//   average_rating?: number;
//   total_reviews?: number;
// }

interface ProgramCardProps {
  program: Program; // ✅ برنامج واحد
  variant?: "default" | "top-rated";
  showCreator?: boolean;
  showEnrollments?: boolean;
  showStatus?: boolean;
}

export function ProgramCard({
  program,
  variant = "default",
  showCreator = true,
  showEnrollments = true,
  showStatus = true,
}: ProgramCardProps) {
  const t = useTranslations('programs');
  const imageUrl =
    program.cover_image || "/images/home/Sports-rehabilitation.jpg";
  const rating = Number(program.ratings_avg_rating) || 0;
  const reviewsCount = program.ratings_count || 0;
  const price = program.price || 0;
  // is_enrolled from the backend is the only source of truth for access.
  const isEnrolled = program.is_enrolled === true;

  return (
    <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary">
      <div className="relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={program.title}
          width={400}
          height={250}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        {/* Rating */}
        <div className="pointer-events-none absolute top-3 end-3">
          <RatingBadge rating={rating} count={reviewsCount} tone="dark" />
        </div>

        <div className="pointer-events-none absolute start-3 top-3 flex flex-col items-start gap-2">
          {/* Single access-status chip (non-interactive). */}
          {isEnrolled ? (
            <span className="inline-flex rounded-full bg-white/90 backdrop-blur-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#32A88D]/10 px-3 py-1 text-xs font-semibold text-[#1F6069]">
                <Check className="h-3 w-3 text-[#32A88D]" aria-hidden="true" />
                {t("enrolledBadge")}
              </span>
            </span>
          ) : program.is_free ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
              {t("freeBadge")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50/90 px-3 py-1 text-xs font-semibold text-amber-800 backdrop-blur-sm">
              <Lock className="h-3 w-3" aria-hidden="true" />
              {t("paidBadge")}
            </span>
          )}

          {/* Status Badge or Top Rated Badge */}
          {variant === "top-rated" ? (
            <Badge className="bg-white/90 backdrop-blur-sm text-[#32A88D] px-3 py-1 rounded-full text-xs font-medium border border-[#32A88D]/20">
              {t('topRequested')}
            </Badge>
          ) : (
            showStatus &&
            program.status === "published" &&
            program.is_approved === 1 && (
              <Badge className="bg-emerald-400 text-[#0f3d35] px-3 py-1 rounded-full text-xs font-semibold">
                {t('availableNow')}
              </Badge>
            )
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 truncate">
            <Link
              href={`/programs/${program.id}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {program.title}
            </Link>
          </h3>
          {/* <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </Button> */}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {program.description}
        </p>

        {/* Creator Info - Optional */}
        {showCreator && program.creator && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <div className="w-8 h-8 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-[#32A88D]" />
            </div>
            <span className="font-medium">{program.creator.name}</span>
          </div>
        )}

        {/* Enrollments Count - Optional */}
        {showEnrollments &&
          program.enrollments_count !== null &&
          program.enrollments_count !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Clock className="w-4 h-4" />
              <span>{t('registeredUsers', {count: program.enrollments_count})}</span>
            </div>
          )}

        {/* Price and Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isEnrolled ? (
                <span className="text-sm text-gray-400">{t('purchased')}</span>
              ) : (
                <div className="flex items-center gap-1 text-2xl font-bold text-[#32A88D]">
                  <span>{price}</span>
                  <Image
                    width={16}
                    height={16}
                    src="/images/Light22.svg"
                    className="w-6 h-6"
                    alt="Light icon"
                  />
                </div>
              )}
            </div>

            <span
              aria-hidden="true"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] px-6 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 group-hover:from-[#2a8a7a] group-hover:to-[#32A88D]"
            >
              <Eye className="h-4 w-4" />
              {isEnrolled ? t('continueWatching') : t('viewDetails')}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
