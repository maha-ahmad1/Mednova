import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DisputeStatus } from "../../types";

const statusClassName: Record<DisputeStatus, string> = {
  opened: "bg-amber-100 text-amber-700 border-amber-200",
  under_review: "bg-blue-100 text-blue-700 border-blue-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

interface DisputeStatusBadgeProps {
  status: DisputeStatus;
  label?: string;
  className?: string;
}

export function DisputeStatusBadge({ status, label, className }: DisputeStatusBadgeProps) {
  const defaultLabels: Record<DisputeStatus, string> = {
    opened: "مفتوح",
    under_review: "قيد المراجعة",
    resolved: "محلول",
  };

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium", statusClassName[status], className)}
    >
      {label ?? defaultLabels[status]}
    </Badge>
  );
}
