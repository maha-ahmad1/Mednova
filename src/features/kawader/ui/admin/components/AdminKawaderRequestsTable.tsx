"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { AdminKawaderListItem } from "../../../types/kawader";
import { formatKawaderDate, getUserTimezone } from "../../../utils/kawader-datetime";
import { KawaderStatusBadge } from "../../shared/KawaderStatusBadge";
import { AdminKawaderTableSkeletonRows } from "./AdminKawaderTableSkeleton";
import { KawaderPriorityBadge } from "../../shared/KawaderPriorityBadge";

interface AdminKawaderRequestsTableProps {
  items: AdminKawaderListItem[];
  /** First load: skeleton rows instead of data. */
  isLoading?: boolean;
  /** Showing the previous page while the next one loads. */
  isRefreshing?: boolean;
  /** The list's current filters; handed to the detail page so its back link can restore them. */
  listQuery?: string;
}

export function AdminKawaderRequestsTable({
  items,
  isLoading = false,
  isRefreshing = false,
  listQuery = "",
}: AdminKawaderRequestsTableProps) {
  const t = useTranslations("kawader.admin.table");
  const locale = useLocale();
  const router = useRouter();
  const timeZone = getUserTimezone();

  const headers = [
    t("reference"),
    t("patient"),
    t("phone"),
    t("service"),
    t("area"),
    t("preferredAt"),
    t("priority"),
    t("status"),
    t("createdAt"),
  ];

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border bg-white transition-opacity",
        isRefreshing && "opacity-60",
      )}
      aria-busy={isLoading || isRefreshing}
    >
      <table className="w-full min-w-[64rem] text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 text-start font-medium whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <AdminKawaderTableSkeletonRows />
          ) : (
            items.map((request) => {
              const href = `/control-panel/kawader/${request.id}${
                listQuery ? `?from=${encodeURIComponent(listQuery)}` : ""
              }`;

              return (
                // The link in the first cell is the keyboard/screen-reader entry point;
                // clicking anywhere else on the row also opens the request.
                <tr
                  key={request.id}
                  onClick={() => router.push(href)}
                  className="cursor-pointer border-t align-middle transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={href}
                      onClick={(event) => event.stopPropagation()}
                      className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40"
                    >
                      <bdi>{request.reference_code}</bdi>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{request.patient_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("ageYears", { age: request.patient_age })}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <bdi>{request.patient_phone}</bdi>
                  </td>
                  <td className="px-4 py-3">{request.service.name}</td>
                  <td className="px-4 py-3">{request.service_area?.name ?? ""}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatKawaderDate(request.preferred_at, locale, timeZone)}
                  </td>
                  <td className="px-4 py-3">
                    <KawaderPriorityBadge priority={request.priority} label={request.priority_label} />
                  </td>
                  <td className="px-4 py-3">
                    <KawaderStatusBadge status={request.status} label={request.status_label} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatKawaderDate(request.created_at, locale, timeZone)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
