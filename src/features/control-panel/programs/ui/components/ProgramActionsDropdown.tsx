import { CheckCircle2, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProgramActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
}

export function ProgramActionsDropdown({ onEdit, onDelete, onApprove }: ProgramActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Open actions menu" className="cursor-pointer">
          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer text-right" dir="rtl">
          <Pencil className="h-4 w-4" />
          تعديل
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onApprove} className="cursor-pointer text-right" dir="rtl">
          <CheckCircle2 className="h-4 w-4" />
          موافقة
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete} className="cursor-pointer text-right" dir="rtl">
          <Trash2 className="h-4 w-4" />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
