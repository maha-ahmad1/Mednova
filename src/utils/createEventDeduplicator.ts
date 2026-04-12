import { useRef } from "react";
import {
  getDeduplicator,
  type PersistentDeduplicator,
} from "@/utils/persistentDeduplicator";

export type EventDeduplicator = Pick<
  PersistentDeduplicator,
  "markIfNew" | "removeAfter" | "has" | "markBulk" | "clear"
>;

export const useEventDeduplicator = (): EventDeduplicator => {
  const deduplicatorRef = useRef<EventDeduplicator>(getDeduplicator());
  return deduplicatorRef.current;
};
