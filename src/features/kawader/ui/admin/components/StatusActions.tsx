"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { KawaderTargetStatus } from "../../../types/kawader";

interface StatusActionsProps {
  /** `allowed_transitions` from A2. The backend decides; the frontend has no transition rules. */
  transitions: KawaderTargetStatus[];
  onSelect: (status: KawaderTargetStatus) => void;
  disabled?: boolean;
}

const DESTRUCTIVE: readonly KawaderTargetStatus[] = ["rejected", "cancelled"];
const KNOWN: readonly KawaderTargetStatus[] = [
  "sent_to_hospital",
  "confirmed",
  "completed",
  "rejected",
  "cancelled",
];

export function StatusActions({ transitions, onSelect, disabled = false }: StatusActionsProps) {
  const t = useTranslations("kawader.admin.actions");

  return (
    <section className="space-y-3 rounded-xl border bg-white p-4">
      <h2 className="text-base font-semibold text-foreground">{t("title")}</h2>

      {transitions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("none")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {transitions.map((status) => (
            <Button
              key={status}
              type="button"
              variant={DESTRUCTIVE.includes(status) ? "destructive" : "default"}
              className="w-full"
              disabled={disabled}
              onClick={() => onSelect(status)}
            >
              {KNOWN.includes(status) ? t(status) : status}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
