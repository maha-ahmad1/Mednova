import { Skeleton } from "@/components/ui/skeleton";

export function CreateProgramPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border bg-white p-6">
          <Skeleton className="mb-4 h-6 w-36" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`program-info-skeleton-${index}`} className="h-10 w-full" />
            ))}
            <Skeleton className="h-24 w-full md:col-span-2" />
            <Skeleton className="h-24 w-full md:col-span-2" />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <Skeleton className="mb-4 h-6 w-28" />
          <div className="space-y-4">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="flex justify-end rounded-lg border bg-background/95 p-3">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
