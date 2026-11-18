"use client";

import { useEffect, useRef } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const TOAST_ID = "connection-status";
// Short delay so a flaky connection doesn't flash the offline toast.
const OFFLINE_DEBOUNCE_MS = 1000;

export function ConnectionStatusToast() {
  const t = useTranslations("connection");
  const online = useOnlineStatus();
  const wasOffline = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (!online) {
      timer = setTimeout(() => {
        wasOffline.current = true;
        toast.warning(t("offline"), {
          id: TOAST_ID,
          icon: <WifiOff className="size-4" />,
          description: t("offlineHint"),
          duration: Infinity,
          dismissible: false,
        });
      }, OFFLINE_DEBOUNCE_MS);
    } else if (wasOffline.current) {
      wasOffline.current = false;
      toast.success(t("online"), {
        id: TOAST_ID,
        icon: <Wifi className="size-4" />,
        // Replaces the offline hint carried over by the shared id.
        description: t("onlineHint"),
        duration: 3000,
        dismissible: true,
      });
    }

    return () => clearTimeout(timer);
  }, [online, t]);

  return null;
}
