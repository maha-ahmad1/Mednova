"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProgramDetail } from "@/features/programs/types/program"

interface ProgramDetailHeaderProps {
  program: ProgramDetail
}

export function ProgramDetailHeader({ program }: ProgramDetailHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <Link href="/programs">
        <Button variant="ghost" className="m-4">
          <ArrowRight className="ml-2 w-4 h-4" />
          العودة للبرامج
        </Button>
      </Link>

      <div className="relative h-96 w-full">
        <Image
          src={program.cover_image || "/images/home/Sports-rehabilitation.jpg"}
          alt={program.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            {program.status === "published" && program.is_approved === 1 && (
              <Badge className="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">متاح</Badge>
            )}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {/* <span className="font-medium">{program.ratings_avg_rating?.toFixed(1) || "0.0"}</span> */}
              <span className="text-xs opacity-80">({program.ratings_count || 0})</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-3">{program.title}</h1>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{program.title}</span>
            </div>
            {program.enrollments_count !== null && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{program.enrollments_count} شخص مسجل</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
