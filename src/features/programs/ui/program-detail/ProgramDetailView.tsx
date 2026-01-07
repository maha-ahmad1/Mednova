"use client"

import { useProgramDetailQuery } from "@/features/programs/hooks"
import { ProgramDetailHeader , } from "./components/ProgramDetailHeader"
import { ProgramDetailContent } from "./components/ProgramDetailContent"
import { ProgramVideos } from "./components/ProgramVideos"
import { ProgramEnrollment } from "./components/ProgramEnrollment"
import { LoadingState } from "@/shared/ui/components/states/LoadingState"
import { ErrorState } from "@/shared/ui/components/states/ErrorState"
import { ProgramDetailSkeleton } from "./components/ProgramDetailSkeleton"

interface ProgramDetailViewProps {
  programId: number
}

export function ProgramDetailView({ programId }: ProgramDetailViewProps) {
  const { data, isLoading, error } = useProgramDetailQuery(programId)

  if (isLoading) {
    return <ProgramDetailSkeleton/>
  }

  if (error || !data?.success) {
    return <ErrorState />
  }

  const program = data.data

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgramDetailHeader program={program} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <ProgramDetailContent program={program} />
            <ProgramVideos videos={program.videos} />
          </div>

          <div className="lg:col-span-1">
            <ProgramEnrollment program={program} />
          </div>
        </div>
      </div>
    </div>
  )
}
