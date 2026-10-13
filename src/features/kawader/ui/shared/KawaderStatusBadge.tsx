import { cn } from "@/lib/utils";
import type { KawaderStatus } from "../../types/kawader";
import { STATUS_STYLES } from "../../utils/kawader-status";

interface KawaderStatusBadgeProps {
  status: KawaderStatus;
  /** `status_label` from the API, already in the request language. */
  label: string;
  className?: string;
}

export function KawaderStatusBadge({ status, label, className }: KawaderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        // An unknown status (backend added one) falls back to the neutral style.
        STATUS_STYLES[status] ?? STATUS_STYLES.expired,
        className,
      )}
    >
      {label}
    </span>
  );
}
