import { Skeleton } from "@/components/ui/skeleton"

interface ProgramSkeletonProps {
  count?: number
}

export function ProgramSkeleton({ count = 6 }: ProgramSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <Skeleton className="h-52 w-full rounded-2xl mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
