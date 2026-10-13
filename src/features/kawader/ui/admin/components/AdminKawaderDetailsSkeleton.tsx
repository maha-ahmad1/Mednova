import { Skeleton } from "@/components/ui/skeleton";

export function AdminKawaderDetailsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-xl border bg-white p-4 sm:p-6">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="order-first space-y-4 lg:order-none lg:col-start-3 lg:row-start-1">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="space-y-4 lg:col-span-2 lg:col-start-1 lg:row-start-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`admin-kawader-details-skeleton-${index}`} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminKawaderRequestDetailsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <Skeleton className="h-5 w-32" />
      <AdminKawaderDetailsSkeleton />
    </div>
  );
}
