import { Suspense } from "react";
import { MyKawaderRequestsPage } from "@/features/kawader/ui/patient/MyKawaderRequestsPage";
import { MyKawaderRequestsPageSkeleton } from "@/features/kawader/ui/patient/components/KawaderRequestsSkeleton";

export default function MyKawaderRequestsRoute() {
  // The page reads the status/page filters with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense fallback={<MyKawaderRequestsPageSkeleton />}>
      <MyKawaderRequestsPage />
    </Suspense>
  );
}
