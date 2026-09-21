"use client";

import type { ConsultationRequest } from "@/types/consultation";
import { useConsultationMeasurements } from "../hooks/useConsultationMeasurements";
import MeasurementStatusCard from "./MeasurementStatusCard";
import SessionResultPanel, { SessionResultPanelSkeleton } from "./SessionResultPanel";

interface MeasurementPanelProps {
  request: ConsultationRequest;
  userRole: "consultable" | "patient" | undefined;
}

export default function MeasurementPanel({ request, userRole }: MeasurementPanelProps) {
  const { latest, isLoading } = useConsultationMeasurements(request.type, request.id);

  if (userRole === "patient") return null;

  if (isLoading && !latest) return <SessionResultPanelSkeleton />;

  if (!latest) return null;

  if (latest.status === "pending" || latest.status === "in_progress") {
    return <MeasurementStatusCard measurement={latest} request={request} />;
  }

  return (
    <SessionResultPanel measurement={latest} patientId={request.data.patient.id} />
  );
}
