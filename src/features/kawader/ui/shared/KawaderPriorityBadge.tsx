import { cn } from "@/lib/utils";
import type { KawaderPriority } from "../../types/kawader";
import { PRIORITY_STYLES } from "../../utils/kawader-status";

interface KawaderPriorityBadgeProps {
  /** `null` for closed requests: nothing is rendered. */
  priority: KawaderPriority | null;
  /** `priority_label` from the API, already in the request language. */
  label: string | null;
  className?: string;
}

export function KawaderPriorityBadge({ priority, label, className }: KawaderPriorityBadgeProps) {
  if (!priority || !label) return null;

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.normal,
        className,
      )}
    >
      {label}
    </span>
  );
}
