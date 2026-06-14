// providers/ClientEchoWrapper.tsx
"use client";
import { useEchoNotifications } from "@/hooks/useEchoNotifications";

export default function EchoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEchoNotifications();

  return <>{children}</>;
}
