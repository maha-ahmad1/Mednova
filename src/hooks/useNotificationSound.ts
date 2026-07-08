"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { useNotificationSoundStore } from "@/store/notificationSoundStore";
import {
  playNotificationSound,
  unlockNotificationAudio,
  isNotificationAudioUnlocked,
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
    // TEMP DEBUG - remove after diagnosing sound issue
    const mountId = Math.random().toString(36).slice(2, 8);
    console.log("🧩 [UnlockDebug] init effect running — attaching gesture listeners", {
      mountId,
      events: GESTURE_EVENTS,
      unlockedBefore: isNotificationAudioUnlocked(),
    });

    const handleGesture = (e: Event) => {
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("🖱️ [UnlockDebug] gesture fired", {
        mountId,
        type: e.type,
        isTrusted: (e as Event & { isTrusted?: boolean }).isTrusted,
      });
      unlockNotificationAudio();
      GESTURE_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, handleGesture)
      );
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("🧹 [UnlockDebug] gesture listeners removed after first gesture", {
        mountId,
        unlockedAfter: isNotificationAudioUnlocked(),
      });
    };
    GESTURE_EVENTS.forEach((evt) =>
      window.addEventListener(evt, handleGesture, { once: false })
    );
    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("🧩 [UnlockDebug] gesture listeners attached", { mountId });

    return () => {
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("🧹 [UnlockDebug] effect cleanup — removing gesture listeners (unmount or re-run)", {
        mountId,
        unlockedAtCleanup: isNotificationAudioUnlocked(),
      });
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
    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("🔔 [SoundDebug] notifications array changed", {
      length: notifications.length,
      topId: notifications[0]?.id ?? null,
      baselineReady: baselineReadyRef.current,
    });

    if (!baselineReadyRef.current) {
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("❌ [SoundDebug] Sound blocked — baseline not ready yet (persist not hydrated)");
      return;
    }

    const topId = notifications[0]?.id ?? null;
    const grew = notifications.length > lastCountRef.current;
    const topChanged = topId !== lastTopIdRef.current;

    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("🔊 [SoundDebug] Sound check (hook level)", {
      grew,
      topChanged,
      topId,
      lastTopId: lastTopIdRef.current,
      count: notifications.length,
      lastCount: lastCountRef.current,
      muted: mutedRef.current,
      unlocked: isNotificationAudioUnlocked(),
    });

    if (grew && topChanged) {
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("✅ [SoundDebug] grew && topChanged — calling playNotificationSound");
      playNotificationSound(mutedRef.current);
    } else {
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("❌ [SoundDebug] Sound blocked — grew/topChanged condition not met", {
        grew,
        topChanged,
      });
    }

    lastTopIdRef.current = topId;
    lastCountRef.current = notifications.length;
  }, [notifications]);
};
