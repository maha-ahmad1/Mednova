import { useCallback, useMemo, useRef } from "react";

//It is a simple hook to prevent the same event from happening twice (e.g., receiving a notification from Pusher twice).


const STORAGE_PREFIX = "event_dedup_v1";

type PersistedEntry = {
  expiresAt: number;
};

const getStorageKey = (scope: string) => `${STORAGE_PREFIX}:${scope}`;

const readPersisted = (scope: string): Record<string, PersistedEntry> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(getStorageKey(scope));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, PersistedEntry>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writePersisted = (scope: string, payload: Record<string, PersistedEntry>): void => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(getStorageKey(scope), JSON.stringify(payload));
  } catch {
    // Ignore storage errors in private mode / quota exceeded.
  }
};

const pruneExpired = (payload: Record<string, PersistedEntry>): Record<string, PersistedEntry> => {
  const now = Date.now();
  const next: Record<string, PersistedEntry> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value?.expiresAt && value.expiresAt > now) {
      next[key] = value;
    }
  });
  return next;
};

export const useEventDeduplicator = (scope = "global") => {
  const processedEventsRef = useRef<Set<string>>(new Set());
  const persistedRef = useRef<Record<string, PersistedEntry>>(pruneExpired(readPersisted(scope)));

  const syncPersisted = useCallback(() => {
    const cleaned = pruneExpired(persistedRef.current);
    persistedRef.current = cleaned;
    writePersisted(scope, cleaned);
  }, [scope]);

  const markIfNew = useCallback((eventKey: string): boolean => {
    syncPersisted();

    const persisted = persistedRef.current[eventKey];
    if (persisted && persisted.expiresAt > Date.now()) {
      console.debug(`[Dedup] DROP ${eventKey} persisted-hit`);
      return false;
    }

    if (processedEventsRef.current.has(eventKey)) {
      console.debug(`[Dedup] DROP ${eventKey} memory-hit`);
      return false;
    }

    processedEventsRef.current.add(eventKey);
    console.debug(`[Dedup] PASS ${eventKey} new-event`);
    return true;
  }, [syncPersisted]);

  const removeAfter = useCallback((eventKey: string, delayMs: number): void => {
    const expiresAt = Date.now() + Math.max(delayMs, 0);
    persistedRef.current[eventKey] = { expiresAt };
    syncPersisted();

    setTimeout(() => {
      processedEventsRef.current.delete(eventKey);
      delete persistedRef.current[eventKey];
      syncPersisted();
    }, delayMs);
  }, [syncPersisted]);

  const clear = useCallback((): void => {
    processedEventsRef.current.clear();
    persistedRef.current = {};
    writePersisted(scope, {});
  }, [scope]);

  return useMemo(
    () => ({
      markIfNew,
      removeAfter,
      clear,
    }),
    [markIfNew, removeAfter, clear],
  );
};
