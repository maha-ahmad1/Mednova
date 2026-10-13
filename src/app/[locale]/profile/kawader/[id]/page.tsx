import { KawaderRequestDetailsPage } from "@/features/kawader/ui/patient/KawaderRequestDetailsPage";

interface KawaderRequestDetailsRouteProps {
  params: Promise<{ id: string }>;
}

export default async function KawaderRequestDetailsRoute({ params }: KawaderRequestDetailsRouteProps) {
  const { id } = await params;

  return <KawaderRequestDetailsPage requestId={id} />;
}
