import { notFound } from "next/navigation";
import ConsultationDetailsView from "@/features/consultations/details/ui/ConsultationDetailsView";

export default async function Page({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  if (type !== "video" && type !== "chat") {
    notFound();
  }

  return <ConsultationDetailsView type={type} id={id} />;
}
