import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Static map — Tailwind JIT can scan these strings at build time
const STATUS_CLASS: Record<string, string> = {
  pending_review: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

interface WithdrawalStatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function WithdrawalStatusBadge({
  status,
  label,
  className,
}: WithdrawalStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full font-medium",
        STATUS_CLASS[status] ?? "bg-muted text-muted-foreground border-border/60",
        className,
      )}
    >
      {label ?? status}
    </Badge>
  );
}
