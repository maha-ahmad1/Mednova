import { Eye, Ban, Trash2, MoreHorizontal, ShieldCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsDropdownProps {
  isBlocked?: boolean;
  showActivateSubscription?: boolean;
  onViewDetails?: () => void;
  onToggleBlock?: () => void;
  onActivateSubscription?: () => void;
  activateSubscriptionLabel?: string;
  activateSubscriptionDestructive?: boolean;
  onDeactivateSubscription?: () => void;
  onDelete?: () => void;
}

export function UserActionsDropdown({
  isBlocked = false,
  showActivateSubscription = false,
  onViewDetails,
  onToggleBlock,
  onActivateSubscription,
  activateSubscriptionLabel = "تفعيل الاشتراك",
  activateSubscriptionDestructive = false,
  onDeactivateSubscription,
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
        {onViewDetails ? (
          <DropdownMenuItem onClick={onViewDetails} className="text-right cursor-pointer" dir="rtl">
            <Eye className="h-4 w-4" />
            عرض التفاصيل
          </DropdownMenuItem>
        ) : null}
        {onToggleBlock ? (
          <DropdownMenuItem onClick={onToggleBlock} className="text-right cursor-pointer" dir="rtl">
            <Ban className="h-4 w-4" />

            {isBlocked ? "إلغاء الحظر" : "حظر"}
          </DropdownMenuItem>
        ) : null}
        {showActivateSubscription && onActivateSubscription ? (
          <DropdownMenuItem
            variant={activateSubscriptionDestructive ? "destructive" : "default"}
            onClick={onActivateSubscription}
            className="text-right cursor-pointer"
            dir="rtl"
          >
            <ShieldCheck className="h-4 w-4" />
            {activateSubscriptionLabel}
          </DropdownMenuItem>
        ) : null}
        {onDeactivateSubscription ? (
          <DropdownMenuItem onClick={onDeactivateSubscription} className="text-right cursor-pointer" dir="rtl">
            <UserX className="h-4 w-4" />
            تعطيل الاشتراك
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <DropdownMenuItem
            variant="destructive"
            onClick={onDelete}
            className="text-right cursor-pointer"
            dir="rtl"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
