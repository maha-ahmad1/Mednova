"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Video, ExternalLink, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Notification } from "../types";
import { getTypeConfig } from "../config/notificationTypeConfig";
import { resolveNotificationAction } from "../utils/resolveNotificationAction";

export interface NotificationItemBaseProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onNavigate?: (href: string) => void;
  className?: string;
  trailingSlot?: React.ReactNode;
}

export function NotificationItemBase({
  notification,
  onMarkAsRead,
  onNavigate,
  className,
  trailingSlot,
}: NotificationItemBaseProps) {
  const t = useTranslations("notifications");
  const { id, type, message, read, data } = notification;
  const config = getTypeConfig(type);
  const Icon = config.icon;
  const action = resolveNotificationAction(notification);
  const patientName =
    typeof (data as Record<string, unknown>).patient_name === "string"
      ? (data as Record<string, unknown>).patient_name as string
      : undefined;

  const handleContainerClick = () => {
    if (!read) onMarkAsRead(id);
    if (action.kind === "external") window.open(action.href, "_blank");
    else if (action.kind === "internal") onNavigate?.(action.href);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted",
        !read && "bg-muted/50",
        className
      )}
      onClick={handleContainerClick}
    >
      {/* Icon + unread dot */}
      <div className="relative shrink-0 mt-0.5">
        {!read && (
          <span
            className={cn(
              "absolute -top-1 -end-1 h-2 w-2 rounded-full",
              config.colorClass
            )}
          />
        )}
        <div className={cn("p-2 rounded-lg", read ? "bg-muted" : "bg-primary/10")}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("text-sm font-medium leading-none", !read && "text-primary")}>
            {t(config.titleKey as Parameters<typeof t>[0])}
          </p>
          {!read && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{message}</p>

        {patientName && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {patientName}
          </div>
        )}

        {action.kind !== "none" && (
          <div onClick={(e) => e.stopPropagation()}>
            {action.kind === "external" ? (
              <Button
                size="sm"
                variant="default"
                className="mt-1 h-7 text-xs gap-1"
                onClick={() => window.open(action.href, "_blank")}
              >
                <Video className="h-3 w-3" />
                {t("joinSession")}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-1 h-7 text-xs gap-1"
                onClick={() => onNavigate?.(action.href)}
              >
                <ExternalLink className="h-3 w-3" />
                {t("viewDetails")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Injected trailing content (checkbox, ⋮ menu, etc.) */}
      {trailingSlot}
    </div>
  );
}
