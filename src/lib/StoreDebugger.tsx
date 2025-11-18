// components/StoreDebugger.tsx (مؤقت للاختبار فقط)
"use client";
import { useConsultationStore } from "@/store/consultationStore";
import { useEffect } from "react";

export function StoreDebugger() {
  const requests = useConsultationStore((state) => state.requests);

  useEffect(() => {
    console.log("📊 حالة الـ store الحالية:", requests);
  }, [requests]);

  return null;
}