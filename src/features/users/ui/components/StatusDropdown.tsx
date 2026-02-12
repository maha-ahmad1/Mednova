import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { UserStatus } from "../../types/user";

const statusClasses: Record<UserStatus, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-100 text-rose-700 border-rose-200",
  Suspended: "bg-slate-200 text-slate-700 border-slate-300",
};

interface StatusDropdownProps {
  status: UserStatus;
  onSelectStatus: (status: UserStatus) => void;
}

const statusOptions: UserStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Suspended",
];

export function StatusDropdown({ status, onSelectStatus }: StatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer rounded-full gap-1 pr-1.5",
            statusClasses[status],
          )}
        >
          {status}
          <ChevronDown className="h-3.5 w-3.5" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {statusOptions.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onSelectStatus(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
