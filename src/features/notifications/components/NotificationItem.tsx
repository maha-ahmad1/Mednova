"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock, User, Video } from "lucide-react";
import {NotificationItemProps } from "../types";


export function NotificationItem({
  id,
  type,
  title,
  message,
  data,
  read,
  createdAt,
  source,
  onMarkAsRead,
  getIcon,
  getColor,
  formatTimeAgo,
}: NotificationItemProps) {
  const handleClick = () => {
    onMarkAsRead(id);
  };

  const renderZoomAction = () => {
    if (type === "consultation_active" && data.video_room_link) {
      return (
        <Button
          size="sm"
          variant="default"
          className="mt-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            window.open(data.video_room_link, "_blank");
          }}
        >
          <Video className="h-3 w-3 ml-1" />
          انضم للجلسة
        </Button>
      );
    }
    return null;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 p-4 cursor-pointer hover:bg-muted transition-colors",
        !read && "bg-muted/50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start w-full gap-3">
        <div className="relative">
          <div
            className={cn(
              "h-2 w-2 rounded-full mt-1",
              getColor(type),
              read && "opacity-50"
            )}
          />
          <div className="mt-1">{getIcon(type)}</div>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className={cn("text-sm font-medium leading-none", !read && "text-primary")}>
              {title}
            </p>
            {!read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
          </div>

          <p className="text-sm text-muted-foreground">{message}</p>

          {data.patient_name && (
            <div className="text-xs text-muted-foreground">
              <User className="h-3 w-3 inline mr-1" />
              {data.patient_name}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(createdAt)}
            </div>
            {renderZoomAction()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="text-xs text-muted-foreground">#{data.consultation_id}</div>
        <div className="text-xs text-muted-foreground">
          {source === "api" ? "API" : "مباشر"}
        </div>
      </div>
    </div>
  );
}