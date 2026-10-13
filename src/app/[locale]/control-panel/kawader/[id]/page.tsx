import { Suspense } from "react";
import { AdminKawaderRequestDetailsPage } from "@/features/kawader/ui/admin/AdminKawaderRequestDetailsPage";
import { AdminKawaderRequestDetailsPageSkeleton } from "@/features/kawader/ui/admin/components/AdminKawaderDetailsSkeleton";

interface AdminKawaderRequestDetailsRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AdminKawaderRequestDetailsRoute({
  params,
}: AdminKawaderRequestDetailsRouteProps) {
  const { id } = await params;

  // The page reads the list's `from` filters with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense fallback={<AdminKawaderRequestDetailsPageSkeleton />}>
      <AdminKawaderRequestDetailsPage requestId={id} />
    </Suspense>
  );
}
