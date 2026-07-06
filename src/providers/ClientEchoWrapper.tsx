// providers/ClientEchoWrapper.tsx
"use client";
import { useEchoNotifications } from "@/hooks/useEchoNotifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";

export default function EchoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEchoNotifications();
  useNotificationSound();

  return <>{children}</>;
}
