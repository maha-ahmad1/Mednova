import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = 9;
const ROWS = 8;

// Rows only: shown inside the table body while the first page loads.
export function AdminKawaderTableSkeletonRows() {
  return (
    <>
      {Array.from({ length: ROWS }).map((_, row) => (
        <tr key={`admin-kawader-skeleton-${row}`} className="border-t align-middle">
          {Array.from({ length: COLUMNS }).map((__, column) => (
            <td key={column} className="px-4 py-3">
              <Skeleton className="h-4 w-full max-w-28" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Full-page version for the route's loading.tsx.
export function AdminKawaderRequestsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-80" />
      </div>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <tbody>
            <AdminKawaderTableSkeletonRows />
          </tbody>
        </table>
      </div>
    </div>
  );
}
