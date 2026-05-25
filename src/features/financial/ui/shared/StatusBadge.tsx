import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionStatus, PaymentStatus, WithdrawalStatus } from "../../types";

type FinancialStatus = TransactionStatus | PaymentStatus | WithdrawalStatus;

const statusClassName: Record<FinancialStatus, string> = {
  available: "bg-emerald-400 text-[#0f3d35] border-emerald-400",
  pending: "bg-amber-100 text-amber-600 border-amber-200",
  frozen: "bg-purple-100 text-purple-600 border-purple-200",
  completed: "bg-blue-100 text-blue-600 border-blue-200",
  captured: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
  refunded: "bg-sky-100 text-sky-600 border-sky-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

interface StatusBadgeProps {
  status: FinancialStatus;
  /** Override the default label — use status_label from the API response */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const t = useTranslations("financial");
  const statusLabels: Record<FinancialStatus, string> = {
    available: t("statusBadge.available"),
    pending: t("statusBadge.pending"),
    frozen: t("statusBadge.frozen"),
    completed: t("statusBadge.completed"),
    captured: t("statusBadge.captured"),
    failed: t("statusBadge.failed"),
    refunded: t("statusBadge.refunded"),
    cancelled: t("statusBadge.cancelled"),
  };

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium", statusClassName[status], className)}
    >
      {label ?? statusLabels[status]}
    </Badge>
  );
}
