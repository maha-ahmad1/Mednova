import { PlayCircle, Star, Users } from "lucide-react"
import type { ProgramDetail } from "@/features/programs/types/program"

interface ProgramDetailContentProps {
  program: ProgramDetail
}

export function ProgramDetailContent({ program }: ProgramDetailContentProps) {
  const rating = Number(program.ratings_avg_rating) || 0
  const enrollments = program.enrollments_count ?? 0

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">نظرة عامة</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <PlayCircle className="h-4 w-4 text-[#32A88D]" />
              <span>عدد الفيديوهات</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{program.videos.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="h-4 w-4 text-[#32A88D]" />
              <span>المسجلون</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{enrollments}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Star className="h-4 w-4 text-[#32A88D]" />
              <span>متوسط التقييم</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{rating.toFixed(1) || "0.0"}</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{program.description}</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">عن المدرب</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-[#32A88D]">
              {(program.creator?.full_name || program.title).charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">
              {program.creator?.full_name || program.title}
            </h4>
            <p className="text-sm text-gray-600">مدرب معتمد لدى Mednova</p>
          </div>
        </div>
      </div>
    </div>
  )
}
