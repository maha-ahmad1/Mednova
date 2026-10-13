import { Suspense } from "react";
import { AdminKawaderRequestsPage } from "@/features/kawader/ui/admin/AdminKawaderRequestsPage";
import { AdminKawaderRequestsPageSkeleton } from "@/features/kawader/ui/admin/components/AdminKawaderTableSkeleton";

export default function AdminKawaderRequestsRoute() {
  // The page reads scope, filters and page with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense fallback={<AdminKawaderRequestsPageSkeleton />}>
      <AdminKawaderRequestsPage />
    </Suspense>
  );
}
