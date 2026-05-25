import { DisputeDetailsPage } from "@/features/admin/disputes/ui/DisputeDetailsPage";

interface AdminDisputeDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDisputeDetailsPage({ params }: AdminDisputeDetailsPageProps) {
  const { id } = await params;

  return <DisputeDetailsPage disputeId={id} />;
}
