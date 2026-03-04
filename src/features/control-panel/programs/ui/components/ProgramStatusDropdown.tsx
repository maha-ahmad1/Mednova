import { ChevronDown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProgramStatus } from "../../types/program";

interface ProgramStatusDropdownProps {
  status: Extract<ProgramStatus, "draft" | "approved" | "rejected">;
  isLoading?: boolean;
  onSelectStatus: (status: Extract<ProgramStatus, "approved" | "rejected">) => void;
}

const statusClasses: Record<ProgramStatus, string> = {
  draft: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
  published: "bg-sky-100 text-sky-700 border-sky-200",
  archived: "bg-slate-200 text-slate-700 border-slate-300",
};

const statusLabels: Record<ProgramStatus, string> = {
  draft: "مسودة",
  approved: "موافق عليه",
  rejected: "مرفوض",
  published: "منشور",
  archived: "مؤرشف",
};

export function ProgramStatusDropdown({ status, isLoading = false, onSelectStatus }: ProgramStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Badge
          variant="outline"
          className={cn("cursor-pointer rounded-full gap-1 pr-1.5", statusClasses[status], isLoading && "opacity-70")}
        >
          {statusLabels[status]}
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36 text-right">
        <DropdownMenuItem disabled className="justify-end">
          {statusLabels.draft}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={status === "approved"}
          onClick={() => onSelectStatus("approved")}
          className="justify-end"
        >
          {statusLabels.approved}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={status === "rejected"}
          onClick={() => onSelectStatus("rejected")}
          className="justify-end"
        >
          {statusLabels.rejected}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
