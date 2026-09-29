import { ConsultantEditProgramPage } from "@/features/consultant-programs/ui/ConsultantEditProgramPage";

interface ConsultantEditProgramRouteProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultantEditProgramRoute({
  params,
}: ConsultantEditProgramRouteProps) {
  const { id } = await params;

  return <ConsultantEditProgramPage programId={Number(id)} />;
}
