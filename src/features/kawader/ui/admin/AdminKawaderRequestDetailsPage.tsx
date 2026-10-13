"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, FileSearch, Lock, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useAdminKawaderRequestDetail } from "../../hooks/useAdminKawaderRequestDetail";
import type { AdminKawaderDetails, KawaderTargetStatus } from "../../types/kawader";
import {
  parseAdminKawaderView,
  serializeAdminKawaderView,
} from "../../utils/kawader-admin-filters";
import { formatKawaderDate, getUserTimezone } from "../../utils/kawader-datetime";
import { DetailRow, DetailSection } from "../shared/DetailSection";
import { KawaderPriorityBadge } from "../shared/KawaderPriorityBadge";
import { KawaderStatusBadge } from "../shared/KawaderStatusBadge";
import { AdminKawaderDetailsSkeleton } from "./components/AdminKawaderDetailsSkeleton";
import { HospitalMessageCard } from "./components/HospitalMessageCard";
import { StatusActions } from "./components/StatusActions";
import { StatusChangeDialog } from "./components/StatusChangeDialog";
import { StatusLogTimeline } from "./components/StatusLogTimeline";

interface AdminKawaderRequestDetailsPageProps {
  requestId: string;
}

const KNOWN_ACTORS = new Set(["patient", "admin", "system"]);

function RequestDetails({
  request,
  backHref,
  onSelectStatus,
}: {
  request: AdminKawaderDetails;
  backHref: string;
  onSelectStatus: (status: KawaderTargetStatus) => void;
}) {
  const ta = useTranslations("kawader.admin");
  const locale = useLocale();
  const timeZone = getUserTimezone();

  const date = (iso: string | null) => formatKawaderDate(iso, locale, timeZone);
  const hasCoordinates = request.latitude !== null && request.longitude !== null;

  const reasonTitle =
    request.status === "rejected"
      ? ta("details.reasonRejected")
      : request.status === "cancelled"
        ? ta("details.reasonCancelled")
        : ta("details.reasonDefault");
  const cancelledBy = request.cancelled_by
    ? KNOWN_ACTORS.has(request.cancelled_by)
      ? ta(`actors.${request.cancelled_by}`)
      : request.cancelled_by
    : null;

  return (
    <div className="space-y-5">
      <header className="space-y-3 rounded-xl border bg-white p-4 sm:p-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          {ta("details.back")}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{ta("table.reference")}</p>
            <h1 className="text-2xl font-semibold text-primary">
              <bdi>{request.reference_code}</bdi>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <KawaderPriorityBadge priority={request.priority} label={request.priority_label} />
            <KawaderStatusBadge status={request.status} label={request.status_label} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {ta("details.createdAt")}: {date(request.created_at)}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Side panel: first on mobile (the actions matter most), last column on large screens. */}
        <aside className="order-first space-y-4 lg:order-none lg:col-start-3 lg:row-start-1">
          <StatusActions transitions={request.allowed_transitions} onSelect={onSelectStatus} />
          <HospitalMessageCard message={request.hospital_message} />
        </aside>

        <div className="space-y-4 lg:col-span-2 lg:col-start-1 lg:row-start-1">
          {request.status_reason ? (
            <div
              role="note"
              className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
            >
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">{reasonTitle}</p>
                <p className="whitespace-pre-line break-words text-foreground">{request.status_reason}</p>
                {cancelledBy ? (
                  <p className="text-xs text-muted-foreground">
                    {ta("details.cancelledBy", { actor: cancelledBy })}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {request.admin_note ? (
            <div
              role="note"
              className="flex items-start gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4"
            >
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-amber-800">{ta("details.internalNoteTitle")}</p>
                <p className="whitespace-pre-line break-words text-foreground">{request.admin_note}</p>
                <p className="text-xs text-amber-700">{ta("details.internalNoteHint")}</p>
              </div>
            </div>
          ) : null}

          <DetailSection title={ta("details.sectionRequest")}>
            <DetailRow label={ta("table.service")}>{request.service.name}</DetailRow>
            {request.service_area?.name ? (
              <DetailRow label={ta("table.area")}>{request.service_area.name}</DetailRow>
            ) : null}
            <DetailRow label={ta("table.preferredAt")}>{date(request.preferred_at)}</DetailRow>
            {request.transfer_destination ? (
              <DetailRow label={ta("details.destination")} wide>
                {request.transfer_destination}
              </DetailRow>
            ) : null}
            {request.patient_notes ? (
              <DetailRow label={ta("details.notes")} wide>
                {request.patient_notes}
              </DetailRow>
            ) : null}
          </DetailSection>

          <DetailSection title={ta("details.sectionPatient")}>
            <DetailRow label={ta("details.name")}>{request.patient_name}</DetailRow>
            <DetailRow label={ta("details.age")}>{request.patient_age}</DetailRow>
            <DetailRow label={ta("table.phone")}>
              <a href={`tel:${request.patient_phone}`} className="text-primary underline">
                <bdi>{request.patient_phone}</bdi>
              </a>
            </DetailRow>
          </DetailSection>

          <DetailSection title={ta("details.sectionAccount")} description={ta("details.accountHint")}>
            <DetailRow label={ta("details.name")}>{request.account.full_name}</DetailRow>
            <DetailRow label={ta("table.phone")}>
              {request.account.phone ? (
                <a href={`tel:${request.account.phone}`} className="text-primary underline">
                  <bdi>{request.account.phone}</bdi>
                </a>
              ) : (
                "—"
              )}
            </DetailRow>
            <DetailRow label={ta("details.email")}>
              {request.account.email ? (
                <a href={`mailto:${request.account.email}`} className="text-primary underline">
                  <bdi>{request.account.email}</bdi>
                </a>
              ) : (
                "—"
              )}
            </DetailRow>
          </DetailSection>

          <DetailSection title={ta("details.sectionLocation")}>
            <DetailRow label={ta("details.address")} wide>
              {request.location_address}
            </DetailRow>
            {hasCoordinates ? (
              <DetailRow label={ta("details.map")} wide>
                <a
                  href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline"
                >
                  {ta("details.openMap")}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </DetailRow>
            ) : null}
          </DetailSection>

          {request.has_insurance === true ? (
            <DetailSection title={ta("details.sectionInsurance")}>
              {request.insurance_company ? (
                <DetailRow label={ta("details.insuranceCompany")}>{request.insurance_company}</DetailRow>
              ) : null}
              {request.insurance_card_number ? (
                <DetailRow label={ta("details.insuranceCard")}>
                  <bdi>{request.insurance_card_number}</bdi>
                </DetailRow>
              ) : null}
            </DetailSection>
          ) : null}

          <StatusLogTimeline logs={request.status_logs} />
        </div>
      </div>
    </div>
  );
}

export function AdminKawaderRequestDetailsPage({ requestId }: AdminKawaderRequestDetailsPageProps) {
  const ta = useTranslations("kawader.admin");
  const searchParams = useSearchParams();
  const { data, error, isPending, isError, refetch } = useAdminKawaderRequestDetail(requestId);
  const [pendingStatus, setPendingStatus] = useState<KawaderTargetStatus | null>(null);

  // The list sends its filters in `from`. It is parsed and rebuilt, so only valid, known
  // params can end up in the link.
  const backHref = useMemo(() => {
    const from = searchParams.get("from");
    const query = from ? serializeAdminKawaderView(parseAdminKawaderView(new URLSearchParams(from))) : "";
    return query ? `/control-panel/kawader?${query}` : "/control-panel/kawader";
  }, [searchParams]);

  const renderContent = () => {
    if (isError) {
      // 404: the request does not exist.
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return (
          <div className="space-y-4 rounded-xl border bg-white px-6 py-16 text-center">
            <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{ta("details.notFoundTitle")}</h2>
              <p className="text-sm text-muted-foreground">{ta("details.notFoundDescription")}</p>
            </div>
            <Button asChild>
              <Link href={backHref}>{ta("details.back")}</Link>
            </Button>
          </div>
        );
      }

      return (
        <ErrorState
          title={ta("details.errorTitle")}
          description={ta("details.errorDescription")}
          retryLabel={ta("retry")}
          onRetry={() => void refetch()}
        />
      );
    }

    // `isPending` (not `isLoading`): the query stays disabled until the session is ready.
    if (isPending || !data) return <AdminKawaderDetailsSkeleton />;

    return <RequestDetails request={data} backHref={backHref} onSelectStatus={setPendingStatus} />;
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-6">
      {renderContent()}

      {data ? (
        <StatusChangeDialog
          requestId={data.id}
          status={pendingStatus}
          onOpenChange={(open) => {
            if (!open) setPendingStatus(null);
          }}
          onStale={() => void refetch()}
        />
      ) : null}
    </div>
  );
}
