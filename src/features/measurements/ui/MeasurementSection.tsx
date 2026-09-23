"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, ChevronDown } from "lucide-react";
import type { ConsultationRequest } from "@/types/consultation";
import { useConsultationMeasurements } from "../hooks/useConsultationMeasurements";
import { useMeasurementLiveStore } from "@/store/measurementLiveStore";
import MeasurementRequestDialog from "./MeasurementRequestDialog";
import MeasurementStatusCard from "./MeasurementStatusCard";
import SessionResultPanel, { SessionResultPanelSkeleton } from "./SessionResultPanel";
import { mapSessionOutcome, type SessionOutcome } from "../utils/mapSessionOutcome";
import type { Measurement } from "../types";

interface MeasurementSectionProps {
  request: ConsultationRequest;
  userRole: "consultable" | "patient" | undefined;
}

const COLLAPSED_SUMMARY_KEY: Record<SessionOutcome, string> = {
  success: "measurements.collapsedSummary.success",
  expired: "measurements.collapsedSummary.expired",
  cancelled_by_doctor: "measurements.collapsedSummary.cancelledByDoctor",
  cancelled_by_patient: "measurements.collapsedSummary.cancelledByPatient",
  unknown: "measurements.collapsedSummary.unknown",
};

// Teal-tinted inset panel — deliberately NOT a separate Card (no own shadow/
// border-radius-2xl/margin-as-a-block). It renders inline inside the same
// details card and scroll region as the session controls, so measurement
// reads as part of that workspace instead of a second, trailing module.
// No dedicated tint token exists in DESIGN.md yet (see Section 2), so this
// uses the approved mockup's exact value as a one-off pending a DESIGN.md
// decision.
function MeasurementSectionShell({
  children,
  panelRef,
}: {
  children: React.ReactNode;
  panelRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={panelRef}
      className="mt-6 sm:mt-8 rounded-xl border border-[#32A88D]/25 bg-[#EAF7F4] p-4 sm:p-5"
    >
      {children}
    </div>
  );
}

// Patient-facing reassurance only — no ROM/accuracy/reps, no join links, no
// cancel control. Patients get a one-line, non-technical status; all clinical
// detail stays therapist-only via the states below.
function PatientMeasurementNotice({ isActive }: { isActive: boolean }) {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-[#32A88D]/10 rounded-lg shrink-0">
        <Activity className="w-5 h-5 text-[#32A88D]" />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-gray-800 text-sm sm:text-base">
          {t("measurements.sectionTitle")}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          {isActive
            ? t("measurements.patientNotice.inProgress")
            : t("measurements.patientNotice.shared")}
        </p>
      </div>
    </div>
  );
}

function MeasurementResultToggle({
  measurement,
  isExpanded,
  onToggle,
}: {
  measurement: Measurement;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations();
  const outcome = mapSessionOutcome(measurement.end_reason);
  const summaryText = t(COLLAPSED_SUMMARY_KEY[outcome], {
    accuracy: measurement.accuracy_percentage ?? 0,
  });

  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-label={isExpanded ? t("measurements.hideDetails") : t("measurements.showDetails")}
      onClick={onToggle}
      className="cursor-pointer w-full flex items-center justify-between gap-3 text-start"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 bg-[#32A88D]/10 rounded-lg shrink-0">
          <Activity className="w-5 h-5 text-[#32A88D]" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-sm sm:text-base">
            {t("measurements.sectionTitle")}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{summaryText}</p>
        </div>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

export default function MeasurementSection({ request, userRole }: MeasurementSectionProps) {
  const { latest, isLoading } = useConsultationMeasurements(request.type, request.id);

  // Only events received after this component mounted count as "just arrived
  // live" — a result that already existed when the page loaded must not
  // auto-expand just because the global store happens to hold a stale entry.
  const mountedAtRef = useRef(Date.now());
  const [justArrivedLive, setJustArrivedLive] = useState(false);
  const lastArrival = useMeasurementLiveStore((state) => state.lastArrival);

  useEffect(() => {
    if (!lastArrival) return;
    if (lastArrival.type !== request.type || lastArrival.consultationId !== request.id) return;
    if (lastArrival.at < mountedAtRef.current) return;
    setJustArrivedLive(true);
  }, [lastArrival, request.type, request.id]);

  const [isExpanded, setIsExpanded] = useState(justArrivedLive);
  const resultPanelRef = useRef<HTMLDivElement>(null);

  const scrollResultIntoView = () => {
    // Deferred a frame so it runs after the expand transition's layout
    // settles, not mid-collapse — the panel is inside the details card's own
    // scroll region, so this scrolls within that region, not the page.
    requestAnimationFrame(() => {
      resultPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    if (justArrivedLive) {
      setIsExpanded(true);
      scrollResultIntoView();
    }
  }, [justArrivedLive]);

  const handleToggle = () => {
    setIsExpanded((current) => {
      const next = !current;
      if (next) scrollResultIntoView();
      return next;
    });
  };

  if (userRole === "patient") {
    // Nothing has happened yet (or still loading the first fetch) — stay
    // silent rather than show an empty/irrelevant panel.
    if (isLoading || !latest) return null;

    const isActive = latest.status === "pending" || latest.status === "in_progress";
    return (
      <MeasurementSectionShell>
        <PatientMeasurementNotice isActive={isActive} />
      </MeasurementSectionShell>
    );
  }

  if (isLoading && !latest) {
    return (
      <MeasurementSectionShell>
        <SessionResultPanelSkeleton />
      </MeasurementSectionShell>
    );
  }

  // no-session: nothing to show, no chevron, not collapsible.
  if (!latest) {
    if (request.status !== "active") return null;

    return (
      <MeasurementSectionShell>
        <MeasurementRequestDialog request={request} />
      </MeasurementSectionShell>
    );
  }

  if (latest.status === "pending" || latest.status === "in_progress") {
    return (
      <MeasurementSectionShell>
        <MeasurementStatusCard measurement={latest} request={request} />
      </MeasurementSectionShell>
    );
  }

  return (
    <MeasurementSectionShell panelRef={resultPanelRef}>
      <MeasurementResultToggle
        measurement={latest}
        isExpanded={isExpanded}
        onToggle={handleToggle}
      />
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <SessionResultPanel
            measurement={latest}
            patientId={request.data.patient.id}
            consultationId={request.id}
            consultationType={request.type}
          />
        </div>
      </div>

      {/* A finished/cancelled measurement doesn't block requesting another one
          during the same active consultation — matches the original
          behavior, which only gated on request.status. */}
      {request.status === "active" && (
        <div className="mt-4 pt-4 border-t border-[#32A88D]/20">
          <MeasurementRequestDialog request={request} />
        </div>
      )}
    </MeasurementSectionShell>
  );
}
