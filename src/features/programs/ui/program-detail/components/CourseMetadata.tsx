"use client"

import { Clock, FileText, Users, Award } from "lucide-react"
import type { ProgramDetail } from "@/features/programs/types/program"

interface CourseMetadataProps {
  program: ProgramDetail
}

export function CourseMetadata({ program }: CourseMetadataProps) {
  // Calculate total duration from videos
  const totalDuration = program.videos?.reduce((sum, video) => 
    sum + (video.duration_minute || 0), 0
  ) || 0
  
  const totalLectures = program.videos?.length || 0

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#32A88D]" />
          </div>
          <div>
            <div className="text-sm text-gray-600">المدة الإجمالية</div>
            <div className="font-bold text-gray-900">{totalDuration} دقيقة</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#32A88D]" />
          </div>
          <div>
            <div className="text-sm text-gray-600">عدد المحاضرات</div>
            <div className="font-bold text-gray-900">{totalLectures} محاضرة</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-[#32A88D]" />
          </div>
          <div>
            <div className="text-sm text-gray-600">المسجلين</div>
            <div className="font-bold text-gray-900">
              {program.enrollments_count?.toLocaleString() || 0} شخص
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-[#32A88D]" />
          </div>
          <div>
            <div className="text-sm text-gray-600">المستوى</div>
            <div className="font-bold text-gray-900">جميع المستويات</div>
          </div>
        </div>
      </div>
    </div>
  )
}