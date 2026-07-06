import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationSoundStore {
  muted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

export const useNotificationSoundStore = create<NotificationSoundStore>()(
  persist(
    (set) => ({
      muted: false,
      toggleMute: () => set((state) => ({ muted: !state.muted })),
      setMuted: (muted) => set({ muted }),
    }),
    {
      name: "notification-sound-storage",
    }
  )
);
