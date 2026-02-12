import { Eye, Ban, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsDropdownProps {
  isBlocked: boolean;
  onViewDetails: () => void;
  onToggleBlock: () => void;
  onDelete: () => void;
}

export function UserActionsDropdown({
  isBlocked,
  onViewDetails,
  onToggleBlock,
  onDelete,
}: UserActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Open actions menu">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleBlock}>
          <Ban className="h-4 w-4" />
          {isBlocked ? "Unblock" : "Block"}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
