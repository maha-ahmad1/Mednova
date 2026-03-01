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
        <Button variant="ghost" size="icon-sm" aria-label="Open actions menu" className="cursor-pointer">
          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 ">
        <DropdownMenuItem
          onClick={onViewDetails}
          className="text-right cursor-pointer"
          dir="rtl"
        >
          <Eye className="h-4 w-4" />
          عرض التفاصيل
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onToggleBlock}
          className="text-right cursor-pointer"
          dir="rtl"
        >
          <Ban className="h-4 w-4" />

          {isBlocked ? "إلغاء الحظر" : "حظر"}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={onDelete}
          className="text-right cursor-pointer"
          dir="rtl"
        >
          <Trash2 className="h-4 w-4" />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
