import { ReviewQueueDetailsPage } from "@/features/control-panel/programs/ui";

interface ReviewQueueDetailsRouteProps {
  params: Promise<{ id: string }>;
}

export default async function AdminReviewQueueDetailsRoute({ params }: ReviewQueueDetailsRouteProps) {
  const resolvedParams = await params;

  return <ReviewQueueDetailsPage programId={resolvedParams.id} />;
}
