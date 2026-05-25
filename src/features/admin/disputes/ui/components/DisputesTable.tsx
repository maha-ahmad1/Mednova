import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DisputeStatusBadge } from "./DisputeStatusBadge";
import type { Dispute } from "../../types";

interface DisputesTableProps {
  disputes: Dispute[];
  isLoading: boolean;
  isFetching: boolean;
}

const columns = [
  "رقم النزاع",
  "المريض",
  "المستشار",
  "نوع الاستشارة",
  "المبلغ",
  "الحالة",
  "تاريخ الفتح",
  "إجراء",
];

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const typeLabel: Record<string, string> = {
  chat: "محادثة",
  video: "فيديو",
};

export function DisputesTable({ disputes, isLoading, isFetching }: DisputesTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-right font-medium text-muted-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b last:border-0">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!disputes.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center">
        <p className="text-lg font-medium text-foreground">لا توجد نزاعات</p>
        <p className="mt-1 text-sm text-muted-foreground">لا توجد نزاعات تطابق الفلتر المحدد</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-xl border bg-white transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 text-right font-medium text-muted-foreground">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {disputes.map((dispute) => (
            <tr key={dispute.id} className="border-b last:border-0 hover:bg-muted/20">
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                #{dispute.id}
              </td>
              <td className="px-4 py-3">{dispute.patient_name ?? "—"}</td>
              <td className="px-4 py-3">{dispute.consultant_name ?? "—"}</td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="rounded-full text-xs">
                  {typeLabel[dispute.consultation_type] ?? dispute.consultation_type}
                </Badge>
              </td>
              <td className="px-4 py-3 tabular-nums">
                {dispute.amount} {dispute.currency}
              </td>
              <td className="px-4 py-3">
                <DisputeStatusBadge status={dispute.status} label={dispute.status_label} />
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {fmtDate(dispute.opened_at)}
              </td>
              <td className="px-4 py-3">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/control-panel/disputes/${dispute.id}`}>عرض</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
