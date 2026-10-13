import { Skeleton } from "@/components/ui/skeleton";

// Form-only skeleton, shown while the services (P1) load. The page-level version adds the
// same outer shell the real page uses, for the route's loading.tsx.
export function KawaderRequestFormSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="space-y-5 rounded-xl border bg-white p-4 sm:p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`kawader-form-skeleton-${index}`} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-40 ms-auto" />
      </div>
    </div>
  );
}

export function KawaderRequestFormPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-80" />
      </div>
      <KawaderRequestFormSkeleton />
    </div>
  );
}
