import { useCallback, useMemo, useRef } from "react";

type ProcessedEventMap = Record<string, number>;

const STORAGE_KEY = "echo-processed-events-v1";
const DEFAULT_TTL_MS = 1000 * 60 * 60; // 1 hour

const readStorage = (): ProcessedEventMap => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as ProcessedEventMap;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
};

const writeStorage = (value: ProcessedEventMap): void => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage errors (private mode / quota)
  }
};

const pruneExpired = (map: ProcessedEventMap, now: number): ProcessedEventMap => {
  const next: ProcessedEventMap = {};

  Object.entries(map).forEach(([key, expiresAt]) => {
    if (expiresAt > now) {
      next[key] = expiresAt;
    }
  });

  return next;
};

export const useEventDeduplicator = () => {
  const processedEventsRef = useRef<Set<string>>(new Set());

  const markIfNew = useCallback((eventKey: string, ttlMs: number = DEFAULT_TTL_MS): boolean => {
    const now = Date.now();

    const persisted = pruneExpired(readStorage(), now);
    const existsInStorage = Boolean(persisted[eventKey]);
    const existsInMemory = processedEventsRef.current.has(eventKey);

    if (existsInStorage || existsInMemory) {
      writeStorage(persisted);
      return false;
    }

    processedEventsRef.current.add(eventKey);
    persisted[eventKey] = now + ttlMs;
    writeStorage(persisted);

    return true;
  }, []);

  const removeAfter = useCallback((eventKey: string, delayMs: number): void => {
    setTimeout(() => {
      processedEventsRef.current.delete(eventKey);
    }, delayMs);
  }, []);

  const clear = useCallback((): void => {
    processedEventsRef.current.clear();
  }, []);

  return useMemo(
    () => ({
      markIfNew,
      removeAfter,
      clear,
    }),
    [markIfNew, removeAfter, clear],
  );
};
