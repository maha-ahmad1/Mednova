import { Skeleton } from "@/components/ui/skeleton"

interface LoadingStateProps {
  type?: "grid" | "list"
  count?: number
}

export function LoadingState({ type = "grid", count = 6 }: LoadingStateProps) {
  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <Skeleton className="h-48 w-full rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-6">
            <Skeleton className="lg:w-1/4 h-48 lg:h-full rounded-xl" />
            <div className="lg:w-3/4 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
