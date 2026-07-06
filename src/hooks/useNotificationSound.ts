"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { useNotificationSoundStore } from "@/store/notificationSoundStore";
import {
  playNotificationSound,
  unlockNotificationAudio,
} from "@/lib/notificationSound";

const GESTURE_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

/**
 * Plays /sounds/notification.mp3 whenever a genuinely new notification
 * lands in the shared notification store — whether it arrived over
 * Pusher/Echo (single push) or an API poll (bulk merge). Mount this
 * once near the app root (it already lives in ClientEchoWrapper); it
 * has no visual output and never blocks rendering.
 */
export const useNotificationSound = (): void => {
  const notifications = useNotificationStore((state) => state.notifications);
  const muted = useNotificationSoundStore((state) => state.muted);

  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const baselineReadyRef = useRef(false);
  const lastTopIdRef = useRef<string | null>(null);
  const lastCountRef = useRef(0);

  // Unlock audio on the first real user gesture anywhere in the app.
  useEffect(() => {
    const handleGesture = () => {
      unlockNotificationAudio();
      GESTURE_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, handleGesture)
      );
    };
    GESTURE_EVENTS.forEach((evt) =>
      window.addEventListener(evt, handleGesture, { once: false })
    );
    return () => {
      GESTURE_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, handleGesture)
      );
    };
  }, []);

  // Establish a baseline once persisted state has rehydrated, so we
  // never "sound off" for notifications that were already on disk.
  useEffect(() => {
    const captureBaseline = () => {
      const state = useNotificationStore.getState();
      lastTopIdRef.current = state.notifications[0]?.id ?? null;
      lastCountRef.current = state.notifications.length;
      baselineReadyRef.current = true;
    };

    if (useNotificationStore.persist.hasHydrated()) {
      captureBaseline();
    }
    const unsubscribe =
      useNotificationStore.persist.onFinishHydration(captureBaseline);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!baselineReadyRef.current) return;

    const topId = notifications[0]?.id ?? null;
    const grew = notifications.length > lastCountRef.current;
    const topChanged = topId !== lastTopIdRef.current;

    if (grew && topChanged) {
      playNotificationSound(mutedRef.current);
    }

    lastTopIdRef.current = topId;
    lastCountRef.current = notifications.length;
  }, [notifications]);
};
