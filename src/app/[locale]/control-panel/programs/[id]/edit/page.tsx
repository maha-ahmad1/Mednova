import { EditProgramPage } from "@/features/control-panel/programs/ui/EditProgramPage";

interface EditProgramRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ControlPanelEditProgramRoute({ params }: EditProgramRouteProps) {
  const resolvedParams = await params;

  return <EditProgramPage programId={resolvedParams.id} />;
}
