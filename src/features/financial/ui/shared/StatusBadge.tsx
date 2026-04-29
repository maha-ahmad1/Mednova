import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionStatus, PaymentStatus } from "../../types";

type FinancialStatus = TransactionStatus | PaymentStatus;

const statusConfig: Record<FinancialStatus, { defaultLabel: string; className: string }> = {
  // TransactionStatus
  available: {
    defaultLabel: "متاح",
    className: "bg-emerald-400 text-[#0f3d35] border-emerald-400",
  },
  pending: {
    defaultLabel: "معلق",
    className: "bg-amber-100 text-amber-600 border-amber-200",
  },
  frozen: {
    defaultLabel: "مجمد",
    className: "bg-purple-100 text-purple-600 border-purple-200",
  },
  completed: {
    defaultLabel: "مكتمل",
    className: "bg-blue-100 text-blue-600 border-blue-200",
  },
  // PaymentStatus (pending already defined above; same style)
  captured: {
    defaultLabel: "مكتمل",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  failed: {
    defaultLabel: "فشل",
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
  refunded: {
    defaultLabel: "مسترد",
    className: "bg-sky-100 text-sky-600 border-sky-200",
  },
};

interface StatusBadgeProps {
  status: FinancialStatus;
  /** Override the default label — use status_label from the API response */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-medium", config.className, className)}
    >
      {label ?? config.defaultLabel}
    </Badge>
  );
}
