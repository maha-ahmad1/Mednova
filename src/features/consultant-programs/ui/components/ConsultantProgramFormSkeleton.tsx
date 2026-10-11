import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the admin CreateProgramPageSkeleton's structure (info card + videos card),
// adapted for the consultant edit page. Shared between the page's own isLoading state
// and the route-level loading.tsx.
export function ConsultantProgramFormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-72" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="rounded-xl border bg-white p-4">
        <Skeleton className="mb-4 h-6 w-24" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`consultant-program-form-skeleton-${index}`} className="h-10 w-full" />
          ))}
          <Skeleton className="h-24 w-full md:col-span-2" />
          <Skeleton className="h-24 w-full md:col-span-2" />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
