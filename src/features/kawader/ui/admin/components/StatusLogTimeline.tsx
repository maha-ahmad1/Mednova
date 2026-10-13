"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { KawaderStatusLog } from "../../../types/kawader";
import { formatKawaderDate, getUserTimezone } from "../../../utils/kawader-datetime";

interface StatusLogTimelineProps {
  logs: KawaderStatusLog[];
}

const KNOWN_STATUSES = new Set([
  "pending",
  "sent_to_hospital",
  "confirmed",
  "completed",
  "rejected",
  "cancelled",
  "expired",
]);
const KNOWN_ACTORS = new Set(["patient", "admin", "system"]);

export function StatusLogTimeline({ logs }: StatusLogTimelineProps) {
  const t = useTranslations("kawader");
  const ta = useTranslations("kawader.admin");
  const locale = useLocale();
  const timeZone = getUserTimezone();

  // Oldest first.
  const ordered = useMemo(
    () => [...logs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [logs],
  );

  // The logs carry no labels, so statuses and actors are translated here; an unknown value
  // (the backend added one) is shown as it is.
  const statusLabel = (status: string) => (KNOWN_STATUSES.has(status) ? t(`status.${status}`) : status);
  const actorLabel = (actor: string) => (KNOWN_ACTORS.has(actor) ? ta(`actors.${actor}`) : actor);

  return (
    <section className="space-y-4 rounded-xl border bg-white p-4 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">{ta("timeline.title")}</h2>

      {ordered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{ta("timeline.empty")}</p>
      ) : (
        <ol className="space-y-5 border-s ps-5">
          {ordered.map((log, index) => (
            <li key={`${log.created_at}-${index}`} className="relative space-y-1">
              <span
                className="absolute -start-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-white"
                aria-hidden
              />
              <p className="text-sm font-semibold text-foreground">{statusLabel(log.to_status)}</p>
              <p className="text-xs text-muted-foreground">
                {[log.actor_name, `(${actorLabel(log.actor_type)})`].filter(Boolean).join(" ")}
                {" · "}
                {formatKawaderDate(log.created_at, locale, timeZone)}
              </p>
              {log.note ? (
                <p className="whitespace-pre-line break-words text-sm text-foreground">{log.note}</p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
