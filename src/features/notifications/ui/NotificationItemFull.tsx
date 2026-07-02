"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import type { Notification } from "../types";
import { NotificationItemBase } from "./NotificationItemBase";

export interface NotificationItemFullProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: () => void;
  onMarkAsRead: () => void;
}

export function NotificationItemFull({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
}: NotificationItemFullProps) {
  const t = useTranslations("notifications");
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const trailing = (
    <div
      className="flex items-center gap-1 shrink-0 self-start mt-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onMarkAsRead}>
            <Check className="h-4 w-4 me-2" />
            {t("markAsRead")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="flex items-start gap-2">
      {/* Checkbox — outside the base so its click doesn't bubble into navigation */}
      <div
        className="pt-5 ps-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </div>

      <div className="flex-1 min-w-0">
        <NotificationItemBase
          notification={notification}
          onMarkAsRead={() => onMarkAsRead()}
          onNavigate={handleNavigate}
          trailingSlot={trailing}
          className="ps-0"
        />
      </div>
    </div>
  );
}
