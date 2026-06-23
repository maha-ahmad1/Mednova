import { Suspense } from "react";
import PendingProfile from "@/features/pages/PendingProfile";

export default function Page() {
  return (
    <Suspense>
      <PendingProfile />
    </Suspense>
  );
}
