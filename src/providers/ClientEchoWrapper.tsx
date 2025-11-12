"use client";

import { ReactNode } from "react";
import { useEchoNotifications } from "@/hooks/useEchoNotifications";

interface EchoProviderProps {
  children: ReactNode;
}

export default function EchoProvider({ children }: EchoProviderProps) {
  useEchoNotifications(); 
  return <>{children}</>;
}
