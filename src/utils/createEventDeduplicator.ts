import { useCallback, useMemo, useRef } from "react";

export const useEventDeduplicator = () => {
  const processedEventsRef = useRef<Set<string>>(new Set());

  const markIfNew = useCallback((eventKey: string): boolean => {
    if (processedEventsRef.current.has(eventKey)) {
      return false;
    }

    processedEventsRef.current.add(eventKey);
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
