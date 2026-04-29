// import { ProgramDetailView } from "@/features/programs/ui/program-detail/ProgramDetailView"
import { ProgramDetailView } from "@/features/programs/ui"

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params

  return <ProgramDetailView programId={Number(id)} />
}
