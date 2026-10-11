import { Skeleton } from "@/components/ui/skeleton";

// Mirrors ReviewQueueDetailsPage's course-info card + tabs shape for the
// route-level loading.tsx.
export function ReviewQueueDetailsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-full max-w-96" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`review-details-info-skeleton-${index}`} className="h-16 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <Skeleton className="h-9 w-full max-w-64 rounded-lg" />

      <div className="space-y-3 rounded-xl border bg-white p-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={`review-details-video-skeleton-${index}`} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
