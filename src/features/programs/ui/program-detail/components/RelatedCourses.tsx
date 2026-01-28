"use client"

import type { Program } from "@/features/programs/types/program"
import { useProgramsQuery } from "@/features/programs/hooks"
import { ProgramCard } from "@/shared/ui/components/ProgramCard"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface RelatedCoursesProps {
  programId: number
  category?: string
}

export function RelatedCourses({ programId }: RelatedCoursesProps): React.ReactNode {
  const { data } = useProgramsQuery()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  // Filter related courses (excluding current course)
  const relatedCourses: Program[] = data?.data?.filter(
    (program) => program.id !== programId
  ).slice(0, 6) ?? []

  if (relatedCourses.length === 0) return null

  const itemsPerPage = 3
  const maxIndex = Math.max(0, relatedCourses.length - itemsPerPage)

  const nextSlide = (): void => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = (): void => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">دورات ذات صلة</h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            type="button"
            aria-label="الشريحة السابقة"
            className="p-2 rounded-full border border-gray-300 hover:border-[#32A88D] hover:bg-[#32A88D]/5 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            type="button"
            aria-label="الشريحة التالية"
            className="p-2 rounded-full border border-gray-300 hover:border-[#32A88D] hover:bg-[#32A88D]/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >
          {relatedCourses.map((program) => (
            <div key={program.id} className="w-full md:w-1/3 flex-shrink-0 px-3">
              <ProgramCard
                program={program}
                showCreator={true}
                showEnrollments={true}
                showStatus={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}