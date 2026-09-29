import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProgramStatus } from "../../types/consultant-program";

interface ConsultantProgramStatusBadgeProps {
  status: ProgramStatus;
  label: string;
  className?: string;
}

// Same color mapping as the admin's ProgramStatusDropdown (control-panel/programs),
// kept in sync so a given status reads the same color in both dashboards.
const statusClasses: Record<ProgramStatus, string> = {
  draft: "bg-amber-100 text-amber-700 border-amber-200",
  pending: "bg-sky-100 text-sky-700 border-sky-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
  archived: "bg-slate-200 text-slate-700 border-slate-300",
};

export function ConsultantProgramStatusBadge({
  status,
  label,
  className,
}: ConsultantProgramStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full", statusClasses[status], className)}
    >
      {label}
    </Badge>
  );
}
