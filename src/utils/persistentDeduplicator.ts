const STORAGE_KEY = "mednova-event-dedup-v1";
const DEFAULT_TTL_MS = 30 * 60 * 1000;

type DedupMap = Map<string, number>;

const hasSessionStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  } catch {
    return false;
  }
};

export interface PersistentDeduplicator {
  markIfNew: (key: string, ttlMs?: number) => boolean;
  markBulk: (keys: string[], ttlMs?: number) => void;
  removeAfter: (key: string, delayMs: number) => void;
  has: (key: string) => boolean;
  remove: (key: string) => void;
  clear: () => void;
}

class PersistentDeduplicatorImpl implements PersistentDeduplicator {
  private entries: DedupMap;

  constructor() {
    this.entries = this.load();
    this.pruneExpired();
    this.persist();
  }

  markIfNew(key: string, ttlMs = DEFAULT_TTL_MS): boolean {
    this.pruneExpired();

    const existingExpiry = this.entries.get(key);
    if (existingExpiry && existingExpiry > Date.now()) {
      return false;
    }

    this.entries.set(key, Date.now() + ttlMs);
    this.persist();
    console.debug("[dedup] markIfNew", { key, ttlMs });
    return true;
  }

  markBulk(keys: string[], ttlMs = DEFAULT_TTL_MS): void {
    const expiresAt = Date.now() + ttlMs;
    this.pruneExpired();

    keys.forEach((key) => {
      this.entries.set(key, expiresAt);
    });

    this.persist();
    console.debug("[dedup] markBulk", { count: keys.length, ttlMs });
  }

  removeAfter(key: string, delayMs: number): void {
    setTimeout(() => {
      this.remove(key);
    }, delayMs);
  }

  has(key: string): boolean {
    this.pruneExpired();
    const expiry = this.entries.get(key);
    return Boolean(expiry && expiry > Date.now());
  }

  remove(key: string): void {
    this.entries.delete(key);
    this.persist();
    console.debug("[dedup] remove", { key });
  }

  clear(): void {
    this.entries.clear();
    this.persist();
    console.debug("[dedup] clear");
  }

  private pruneExpired(): void {
    const now = Date.now();
    let changed = false;

    this.entries.forEach((expiresAt, key) => {
      if (expiresAt <= now) {
        this.entries.delete(key);
        changed = true;
      }
    });

    if (changed) {
      this.persist();
    }
  }

  private load(): DedupMap {
    if (!hasSessionStorage()) {
      return new Map<string, number>();
    }

    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return new Map<string, number>();
      }

      const parsed = JSON.parse(raw) as Record<string, number>;
      return new Map<string, number>(Object.entries(parsed));
    } catch (error) {
      console.error("[dedup] failed to load from sessionStorage", error);
      return new Map<string, number>();
    }
  }

  private persist(): void {
    if (!hasSessionStorage()) {
      return;
    }

    try {
      const serialized = JSON.stringify(Object.fromEntries(this.entries));
      window.sessionStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error("[dedup] failed to persist to sessionStorage", error);
    }
  }
}

let deduplicatorSingleton: PersistentDeduplicator | null = null;

export const getDeduplicator = (): PersistentDeduplicator => {
  if (!deduplicatorSingleton) {
    deduplicatorSingleton = new PersistentDeduplicatorImpl();
  }

  return deduplicatorSingleton;
};

export const resetDeduplicator = (): void => {
  if (deduplicatorSingleton) {
    deduplicatorSingleton.clear();
  }

  deduplicatorSingleton = null;
};
