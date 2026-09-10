"use client";

import type { ConsultationRequest } from "@/types/consultation";
import { useConsultationMeasurements } from "../hooks/useConsultationMeasurements";
import MeasurementStatusCard from "./MeasurementStatusCard";
import MeasurementResultCard from "./MeasurementResultCard";

interface MeasurementPanelProps {
  request: ConsultationRequest;
  userRole: "consultable" | "patient" | undefined;
}

export default function MeasurementPanel({ request, userRole }: MeasurementPanelProps) {
  const { latest } = useConsultationMeasurements(request.type, request.id);

  if (userRole === "patient" || !latest) return null;

  if (latest.status === "pending" || latest.status === "in_progress") {
    return <MeasurementStatusCard measurement={latest} request={request} />;
  }

  return <MeasurementResultCard measurement={latest} />;
}
