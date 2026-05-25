"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDisputeDetail } from "../hooks/useAdminDisputeDetail";
import { DisputeStatusBadge } from "./components/DisputeStatusBadge";
import { DisputeResolveDialog } from "./components/DisputeResolveDialog";

interface DisputeDetailsPageProps {
  disputeId: string;
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </CardContent>
    </Card>
  );
}

const typeLabel: Record<string, string> = { chat: "محادثة", video: "فيديو" };
const resolutionLabel: Record<string, string> = {
  release: "إفراج عن الأموال للمستشار",
  refund: "استرداد المبلغ للمريض",
};

export function DisputeDetailsPage({ disputeId }: DisputeDetailsPageProps) {
  const [resolveOpen, setResolveOpen] = useState(false);
  const { data, isLoading, isError } = useAdminDisputeDetail(disputeId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="border-b pb-4">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-10" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <p className="text-lg font-medium">تعذر تحميل تفاصيل النزاع.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/control-panel/disputes">العودة إلى النزاعات</Link>
        </Button>
      </div>
    );
  }

  const { dispute, consultation, patient, consultant, service_evidence } = data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/control-panel/disputes">
              <ArrowRight className="h-4 w-4" />
              رجوع
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">تفاصيل النزاع #{dispute.id}</h1>
          <DisputeStatusBadge status={dispute.status} label={dispute.status_label} />
        </div>
        {dispute.status === "opened" && (
          <Button onClick={() => setResolveOpen(true)}>حل النزاع</Button>
        )}
      </div>

      {/* Dispute info */}
      <SectionCard title="معلومات النزاع">
        <InfoRow label="رقم النزاع" value={`#${dispute.id}`} />
        <InfoRow
          label="المبلغ المجمد"
          value={<span className="tabular-nums">{dispute.amount} {dispute.currency}</span>}
        />
        <InfoRow label="تاريخ الفتح" value={fmtDate(dispute.opened_at)} />
        {dispute.resolved_at && (
          <InfoRow label="تاريخ الحل" value={fmtDate(dispute.resolved_at)} />
        )}
        {dispute.resolution && (
          <InfoRow
            label="القرار"
            value={
              <Badge variant="outline" className="rounded-full text-xs">
                {resolutionLabel[dispute.resolution] ?? dispute.resolution}
              </Badge>
            }
          />
        )}
        {dispute.admin_note && (
          <div className="col-span-full flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">ملاحظة المسؤول</span>
            <p className="text-sm">{dispute.admin_note}</p>
          </div>
        )}
      </SectionCard>

      {/* Consultation info */}
      <SectionCard title="معلومات الاستشارة">
        <InfoRow label="رقم الاستشارة" value={`#${consultation?.id ?? "—"}`} />
        <InfoRow
          label="النوع"
          value={
            consultation?.type ? (
              <Badge variant="outline" className="rounded-full text-xs">
                {typeLabel[consultation.type] ?? consultation.type}
              </Badge>
            ) : "—"
          }
        />
      </SectionCard>

      {/* Patient & Consultant side by side */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base">معلومات المريض</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <InfoRow label="الاسم" value={patient?.full_name ?? "—"} />
            {patient?.email && <InfoRow label="البريد الإلكتروني" value={patient.email} />}
            {patient?.phone && <InfoRow label="رقم الهاتف" value={patient.phone} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base">معلومات المستشار</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <InfoRow label="الاسم" value={consultant?.full_name ?? "—"} />
            {consultant?.email && <InfoRow label="البريد الإلكتروني" value={consultant.email} />}
            {consultant?.phone && <InfoRow label="رقم الهاتف" value={consultant.phone} />}
          </CardContent>
        </Card>
      </div>

      {/* Service evidence */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base">دليل الخدمة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {!service_evidence?.chat && !service_evidence?.video ? (
            <p className="text-sm text-muted-foreground">لا توجد أدلة مرفقة</p>
          ) : (
            <>
              {service_evidence.chat && (
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-medium">دليل المحادثة</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <InfoRow label="رسائل المريض" value={service_evidence.chat.patient_message_count} />
                    <InfoRow label="رسائل المستشار" value={service_evidence.chat.consultant_message_count} />
                    <InfoRow label="إجمالي الرسائل" value={service_evidence.chat.total_messages} />
                    <InfoRow
                      label="استجاب المستشار"
                      value={service_evidence.chat.consultant_responded ? "نعم" : "لا"}
                    />
                    {service_evidence.chat.response_time_minutes != null && (
                      <InfoRow
                        label="وقت الاستجابة (دقيقة)"
                        value={service_evidence.chat.response_time_minutes}
                      />
                    )}
                    {service_evidence.chat.first_patient_message_at && (
                      <InfoRow
                        label="أول رسالة من المريض"
                        value={fmtDate(service_evidence.chat.first_patient_message_at)}
                      />
                    )}
                    {service_evidence.chat.first_consultant_message_at && (
                      <InfoRow
                        label="أول رسالة من المستشار"
                        value={fmtDate(service_evidence.chat.first_consultant_message_at)}
                      />
                    )}
                  </div>
                </div>
              )}
              {service_evidence.video && (
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-medium">دليل الفيديو</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Object.entries(service_evidence.video).map(([key, val]) => (
                      <InfoRow key={key} label={key} value={String(val ?? "—")} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <DisputeResolveDialog
        disputeId={dispute.id}
        open={resolveOpen}
        onOpenChange={setResolveOpen}
      />
    </div>
  );
}
