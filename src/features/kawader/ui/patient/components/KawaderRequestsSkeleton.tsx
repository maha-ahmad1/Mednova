import { Skeleton } from "@/components/ui/skeleton";

// List-only skeleton, shown below the already-rendered header while the page loads data.
export function KawaderRequestsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`kawader-request-skeleton-${index}`} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  );
}

// Full-page version for the route's loading.tsx.
export function MyKawaderRequestsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-9 w-full max-w-xl" />
      <KawaderRequestsListSkeleton />
    </div>
  );
}

export function KawaderRequestDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-xl border bg-white p-4 sm:p-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={`kawader-details-skeleton-${index}`} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function KawaderRequestDetailsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6">
      <Skeleton className="h-5 w-32" />
      <KawaderRequestDetailsSkeleton />
    </div>
  );
}
