import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROWS = 4;

function SkeletonTable({ columns }: { columns: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <div className="min-w-max">
        <div className="flex items-center gap-4 border-b bg-muted/40 px-4 py-3">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`review-queue-head-${index}`} className="h-4 w-20" />
          ))}
        </div>
        {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
          <div key={`review-queue-row-${rowIndex}`} className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`review-queue-cell-${rowIndex}-${colIndex}`} className="h-4 w-20" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Mirrors ReviewQueuePage's tabs + table shape for the route-level loading.tsx.
export function ReviewQueuePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-full max-w-96" />
      </div>

      <Skeleton className="h-9 w-full max-w-80 rounded-lg" />

      <SkeletonTable columns={7} />
    </div>
  );
}
