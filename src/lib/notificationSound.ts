const SOUND_SRC = "/sounds/notification.mp3";

let audioEl: HTMLAudioElement | null = null;
let unlocked = false;

const getAudio = (): HTMLAudioElement | null => {
  if (typeof window === "undefined") return null;
  if (!audioEl) {
    audioEl = new Audio(SOUND_SRC);
    audioEl.preload = "auto";
  }
  return audioEl;
};

/**
 * Browsers block unsolicited audio until a real user gesture has
 * successfully started playback at least once. Call this from a
 * click/keydown/touchstart handler; it plays muted-volume + pauses
 * immediately so later programmatic `play()` calls are allowed.
 */
export const unlockNotificationAudio = (): void => {
  // TEMP DEBUG - remove after diagnosing sound issue
  console.log("🔐 [UnlockDebug] unlockNotificationAudio() called", {
    unlockedBefore: unlocked,
  });

  if (unlocked) {
    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("🔐 [UnlockDebug] already unlocked — skipping play() attempt");
    return;
  }
  const el = getAudio();
  // TEMP DEBUG - remove after diagnosing sound issue
  console.log("🔐 [UnlockDebug] getAudio() result", {
    hasElement: !!el,
    isNewInstance: !!el && el === audioEl,
    readyState: el?.readyState,
    src: el?.currentSrc || el?.src,
  });
  if (!el) {
    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("❌ [UnlockDebug] no <audio> element available (SSR? window undefined?)");
    return;
  }

  const restoreVolume = el.volume;
  el.volume = 0;
  // TEMP DEBUG - remove after diagnosing sound issue
  console.log("🔐 [UnlockDebug] calling el.play() to unlock (volume muted to 0)");
  el
    .play()
    .then(() => {
      el.pause();
      el.currentTime = 0;
      el.volume = restoreVolume;
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("🔐 [UnlockDebug] play() succeeded — setting unlocked = true", {
        unlockedBeforeSet: unlocked,
      });
      unlocked = true;
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("🔓 [SoundDebug] Audio unlocked successfully", {
        unlockedAfterSet: unlocked,
      });
    })
    .catch((err) => {
      el.volume = restoreVolume;
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("❌ [SoundDebug] Audio unlock attempt failed — exception from play()", {
        name: err?.name,
        message: err?.message,
        unlockedRemainsFalse: unlocked,
      });
    });
};

export const isNotificationAudioUnlocked = (): boolean => unlocked;

/**
 * Fire-and-forget playback. Never throws, never awaited by callers —
 * a rejected promise (autoplay block, unlock not yet granted, tab
 * backgrounded) is swallowed so it can never interrupt UI work.
 */
export const playNotificationSound = (muted: boolean): void => {
  // TEMP DEBUG - remove after diagnosing sound issue
  console.log("🔊 [SoundDebug] Sound check", { muted, unlocked });

  if (muted) {
    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("❌ [SoundDebug] Sound blocked — muted is true");
    return;
  }
  if (!unlocked) {
    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("❌ [SoundDebug] Sound blocked — audio not unlocked yet");
    return;
  }
  const el = getAudio();
  if (!el) {
    // TEMP DEBUG - remove after diagnosing sound issue
    console.log("❌ [SoundDebug] Sound blocked — no <audio> element (SSR?)");
    return;
  }
  el.currentTime = 0;
  // TEMP DEBUG - remove after diagnosing sound issue
  console.log("✅ [SoundDebug] Playing sound — calling el.play()");
  void el
    .play()
    .then(() => {
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("✅ [SoundDebug] play() resolved — sound should be audible now");
    })
    .catch((err) => {
      // TEMP DEBUG - remove after diagnosing sound issue
      console.log("❌ [SoundDebug] play() rejected by browser", err);
    });
};
