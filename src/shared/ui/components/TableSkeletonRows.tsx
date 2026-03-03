import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonRowsProps {
  columns: number;
  rows?: number;
}

export function TableSkeletonRows({ columns, rows = 10 }: TableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`} className="border-t align-middle">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <td key={`skeleton-cell-${rowIndex}-${columnIndex}`} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
