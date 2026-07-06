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
  if (unlocked) return;
  const el = getAudio();
  if (!el) return;

  const restoreVolume = el.volume;
  el.volume = 0;
  el
    .play()
    .then(() => {
      el.pause();
      el.currentTime = 0;
      el.volume = restoreVolume;
      unlocked = true;
    })
    .catch(() => {
      el.volume = restoreVolume;
    });
};

export const isNotificationAudioUnlocked = (): boolean => unlocked;

/**
 * Fire-and-forget playback. Never throws, never awaited by callers —
 * a rejected promise (autoplay block, unlock not yet granted, tab
 * backgrounded) is swallowed so it can never interrupt UI work.
 */
export const playNotificationSound = (muted: boolean): void => {
  if (muted || !unlocked) return;
  const el = getAudio();
  if (!el) return;
  el.currentTime = 0;
  void el.play().catch(() => {
    // Ignore: autoplay restrictions or the tab lost focus mid-call.
  });
};
