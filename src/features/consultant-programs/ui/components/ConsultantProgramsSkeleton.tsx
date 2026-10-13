import { Skeleton } from "@/components/ui/skeleton";

// The cards-only skeleton, shown inside the list page's own isLoading state (below its
// already-rendered header). ConsultantProgramsPageSkeleton wraps this with a full-page
// shell for the route-level loading.tsx, so the two never drift apart.
export function ConsultantProgramsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={`consultant-program-skeleton-${index}`} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function ConsultantProgramsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full max-w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <ConsultantProgramsSkeleton />
    </div>
  );
}
