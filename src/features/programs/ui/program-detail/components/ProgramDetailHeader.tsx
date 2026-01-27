"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Users, Clock, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProgramDetail } from "@/features/programs/types/program"

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

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              {program.status === "published" && program.is_approved === 1 && (
                <Badge className="rounded-full bg-[#32A88D]/15 px-3 py-1 text-xs font-semibold text-[#1F6069]">
                  متاح الآن
                </Badge>
              )}
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating.toFixed(1) || "0.0"}</span>
                <span className="text-xs text-gray-500">({program.ratings_count || 0})</span>
              </div>
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
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#32A88D]" />
                <span>{program.creator?.full_name || "مدرب البرنامج"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#32A88D]" />
                <span>{enrollments} مسجل</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-[#32A88D]" />
                <span>{videosCount} فيديو</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
