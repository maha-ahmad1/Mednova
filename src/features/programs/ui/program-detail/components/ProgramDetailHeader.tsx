"use client"

import Image from "next/image"
import { Users, Clock, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ProgramDetail } from "@/features/programs/types/program"
import { RatingBadge } from "@/shared/ui/components/RatingBadge"
import { MetaInfoItem } from "@/shared/ui/components/MetaInfoItem"

interface ProgramDetailHeaderProps {
  program: ProgramDetail
}

export function ProgramDetailHeader({ program }: ProgramDetailHeaderProps) {
  const rating = Number(program.ratings_avg_rating) || 0
  const enrollments = program.enrollments_count ?? 0
  const videosCount = program.videos?.length ?? 0

  return (
    <section className="space-y-4">
      {/* <Link href="/programs">
        <Button variant="ghost" className="rounded-full border border-gray-200">
          <ArrowRight className="ml-2 w-4 h-4" />
          العودة للبرامج
        </Button>
      </Link> */}

      <div className="rounded-3xl border border-gray-100 bg-white shadow-lg overflow-hidden">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src={program.cover_image || "/images/home/Sports-rehabilitation.jpg"}
              alt={program.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-16">
            <div className="flex flex-wrap items-center gap-3">
              {program.status === "published" && program.is_approved === 1 && (
                <Badge className="rounded-full bg-[#32A88D]/15 px-3 py-1 text-xs font-semibold text-[#1F6069]">
                  متاح الآن
                </Badge>
              )}
              <RatingBadge rating={rating} count={program.ratings_count} />
              <Badge className="rounded-full bg-[#1F6069]/10 px-3 py-1 text-xs text-[#1F6069]">
                برامج Mednova المعتمدة
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {program.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-gray-600 line-clamp-3">
                {program.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <MetaInfoItem icon={<Users className="h-4 w-4" />}>
                {program.creator?.full_name || "مدرب البرنامج"}
              </MetaInfoItem>
              <MetaInfoItem icon={<Clock className="h-4 w-4" />}>
                {enrollments} مسجل
              </MetaInfoItem>
              <MetaInfoItem icon={<PlayCircle className="h-4 w-4" />}>
                {videosCount} فيديو
              </MetaInfoItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
