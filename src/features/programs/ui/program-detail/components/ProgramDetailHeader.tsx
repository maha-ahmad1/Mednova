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
    <section className="relative overflow-hidden rounded-3xl bg-[#1F6069] text-white shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F6069] via-[#1F6069]/95 to-[#32A88D]/70" />
      <div className="relative grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Link href="/programs">
            <Button
              variant="secondary"
              className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowRight className="ml-2 w-4 h-4" />
              العودة للبرامج
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {program.status === "published" && program.is_approved === 1 && (
              <Badge className="rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-semibold text-[#0f3d35]">
                متاح الآن
              </Badge>
            )}
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1) || "0.0"}</span>
              <span className="text-xs opacity-80">({program.ratings_count || 0})</span>
            </div>
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              برامج مميزة من Mednova
            </Badge>
          </div>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{program.title}</h1>
          <p className="text-base leading-relaxed text-white/85 line-clamp-3">
            {program.description}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{program.creator?.full_name || "مدرب البرنامج"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{enrollments} مسجل</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              <span>{videosCount} فيديو</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-8 -top-8 hidden h-24 w-24 rounded-full bg-white/10 blur-2xl lg:block" />
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
            <Image
              src={program.cover_image || "/images/home/Sports-rehabilitation.jpg"}
              alt={program.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
