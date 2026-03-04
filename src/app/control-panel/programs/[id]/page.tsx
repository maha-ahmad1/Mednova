import { ProgramDetailsPage } from "@/features/control-panel/programs/ui/ProgramDetailsPage";

interface ProgramDetailsRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ControlPanelProgramDetailsRoute({ params }: ProgramDetailsRouteProps) {
  const resolvedParams = await params;

  return <ProgramDetailsPage programId={resolvedParams.id} />;
}
