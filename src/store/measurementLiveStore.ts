import { create } from "zustand";

interface MeasurementLiveArrival {
  type: "video" | "chat";
  consultationId: number;
  at: number;
}

interface MeasurementLiveState {
  lastArrival: MeasurementLiveArrival | null;
  setLastArrival: (arrival: Omit<MeasurementLiveArrival, "at">) => void;
}

// Bridges the app-level Pusher subscription (subscribeMeasurementEvents, which
// only invalidates the React Query cache) to any mounted MeasurementSection so
// it can tell a live-arrived result apart from one that was already there on
// load, without inferring it from the fetched data alone.
export const useMeasurementLiveStore = create<MeasurementLiveState>((set) => ({
  lastArrival: null,
  setLastArrival: ({ type, consultationId }) =>
    set({ lastArrival: { type, consultationId, at: Date.now() } }),
}));
