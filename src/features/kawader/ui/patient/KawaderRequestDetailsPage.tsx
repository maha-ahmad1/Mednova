"use client";

import axios from "axios";
import { ArrowLeft, ExternalLink, FileSearch, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ErrorState } from "@/shared/ui/components/states/ErrorState";
import { useMyKawaderRequestDetail } from "../../hooks/useMyKawaderRequestDetail";
import type { KawaderRequest } from "../../types/kawader";
import { formatKawaderDate } from "../../utils/kawader-datetime";
import { CancelRequestDialog } from "./components/CancelRequestDialog";
import { DetailRow, DetailSection } from "../shared/DetailSection";
import { KawaderRequestDetailsSkeleton } from "./components/KawaderRequestsSkeleton";
import { KawaderStatusBadge } from "../shared/KawaderStatusBadge";

interface KawaderRequestDetailsPageProps {
  requestId: string;
}

function BackLink() {
  const t = useTranslations("kawader");

  return (
    <Link
      href="/profile/kawader"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
      {t("details.back")}
    </Link>
  );
}

function NotFoundState() {
  const t = useTranslations("kawader");

  return (
    <div className="space-y-4 rounded-xl border bg-white px-6 py-16 text-center">
      <FileSearch className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{t("details.notFoundTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("details.notFoundDescription")}</p>
      </div>
      <Button asChild>
        <Link href="/profile/kawader">{t("details.notFoundCta")}</Link>
      </Button>
    </div>
  );
}

function StatusReasonNotice({ request }: { request: KawaderRequest }) {
  const t = useTranslations("kawader");
  if (!request.status_reason) return null;

  const title =
    request.status === "rejected"
      ? t("details.reasonRejected")
      : request.status === "cancelled"
        ? t("details.reasonCancelled")
        : t("details.reasonDefault");

  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
    >
      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="whitespace-pre-line break-words text-foreground">{request.status_reason}</p>
      </div>
    </div>
  );
}

function RequestDetails({ request }: { request: KawaderRequest }) {
  const t = useTranslations("kawader");
  const locale = useLocale();

  const hasCoordinates = request.latitude !== null && request.longitude !== null;

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-xl border bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{t("details.reference")}</p>
            <h1 className="text-xl font-semibold text-primary">
              <bdi>{request.reference_code}</bdi>
            </h1>
          </div>
          <KawaderStatusBadge status={request.status} label={request.status_label} />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("details.createdAt")}: {formatKawaderDate(request.created_at, locale)}
        </p>
        {request.can_cancel ? (
          <div className="pt-1">
            <CancelRequestDialog request={request} />
          </div>
        ) : null}
      </div>

      <StatusReasonNotice request={request} />

      <DetailSection title={t("details.sectionService")}>
        <DetailRow label={t("details.service")}>{request.service.name}</DetailRow>
        {request.service_area?.name ? (
          <DetailRow label={t("details.area")}>{request.service_area.name}</DetailRow>
        ) : null}
        <DetailRow label={t("details.preferredAt")}>
          {formatKawaderDate(request.preferred_at, locale)}
        </DetailRow>
      </DetailSection>

      <DetailSection title={t("details.sectionPatient")}>
        <DetailRow label={t("details.patientName")}>{request.patient_name}</DetailRow>
        <DetailRow label={t("details.patientAge")}>{request.patient_age}</DetailRow>
        <DetailRow label={t("details.patientPhone")}>
          <bdi>{request.patient_phone}</bdi>
        </DetailRow>
      </DetailSection>

      <DetailSection title={t("details.sectionLocation")}>
        <DetailRow label={t("details.address")} wide>
          {request.location_address}
        </DetailRow>
        {hasCoordinates ? (
          <DetailRow label={t("details.map")} wide>
            <a
              href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline"
            >
              {t("details.openMap")}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </DetailRow>
        ) : null}
        {request.transfer_destination ? (
          <DetailRow label={t("details.destination")} wide>
            {request.transfer_destination}
          </DetailRow>
        ) : null}
      </DetailSection>

      {request.patient_notes ? (
        <DetailSection title={t("details.sectionNotes")}>
          <DetailRow label={t("details.notes")} wide>
            {request.patient_notes}
          </DetailRow>
        </DetailSection>
      ) : null}

      {/* Only the masked card number is ever shown. */}
      {request.has_insurance === true ? (
        <DetailSection title={t("details.sectionInsurance")}>
          {request.insurance_company ? (
            <DetailRow label={t("details.insuranceCompany")}>{request.insurance_company}</DetailRow>
          ) : null}
          {request.insurance_card_masked ? (
            <DetailRow label={t("details.insuranceCard")}>
              <bdi>{request.insurance_card_masked}</bdi>
            </DetailRow>
          ) : null}
        </DetailSection>
      ) : null}
    </div>
  );
}

export function KawaderRequestDetailsPage({ requestId }: KawaderRequestDetailsPageProps) {
  const t = useTranslations("kawader");
  const { data, error, isPending, isError, refetch } = useMyKawaderRequestDetail(requestId);

  const renderContent = () => {
    if (isError) {
      // 404: the request does not exist or is not this patient's.
      if (axios.isAxiosError(error) && error.response?.status === 404) return <NotFoundState />;

      return (
        <ErrorState
          title={t("details.errorTitle")}
          description={t("details.errorDescription")}
          retryLabel={t("list.retry")}
          onRetry={() => void refetch()}
        />
      );
    }

    // `isPending` (not `isLoading`): the query stays disabled until the session is ready.
    if (isPending || !data) return <KawaderRequestDetailsSkeleton />;

    return <RequestDetails request={data} />;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6">
      <BackLink />
      {renderContent()}
    </div>
  );
}
