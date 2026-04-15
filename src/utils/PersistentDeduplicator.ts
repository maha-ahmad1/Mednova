// /**
//  * PersistentDeduplicator
//  * ─────────────────────
//  * Survives page refreshes within the same browser session (sessionStorage).
//  * Falls back to in-memory-only when sessionStorage is unavailable (SSR / private
//  * browsing with strict settings).
//  *
//  * Each entry carries a TTL so stale keys are pruned automatically, preventing
//  * unbounded growth in long-lived sessions.
//  */

// const STORAGE_KEY = "echo:processed_events_v1";
// const DEFAULT_TTL_MS = 30 * 60 * 1_000; // 30 min

// interface Entry {
//   ts: number; // timestamp when the key was first seen
//   ttl: number; // how long (ms) the key should be remembered
// }

// type StorageMap = Record<string, Entry>;

// // ─── helpers ────────────────────────────────────────────────────────────────

// function readStorage(): StorageMap {
//   try {
//     const raw = sessionStorage.getItem(STORAGE_KEY);
//     return raw ? (JSON.parse(raw) as StorageMap) : {};
//   } catch {
//     return {};
//   }
// }

// function writeStorage(map: StorageMap): void {
//   try {
//     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
//   } catch {
//     // quota exceeded or unavailable – degrade gracefully
//   }
// }

// function pruneExpired(map: StorageMap): StorageMap {
//   const now = Date.now();
//   const pruned: StorageMap = {};
//   for (const [key, entry] of Object.entries(map)) {
//     if (now < entry.ts + entry.ttl) {
//       pruned[key] = entry;
//     }
//   }
//   return pruned;
// }

// // ─── class ──────────────────────────────────────────────────────────────────

// export class PersistentDeduplicator {
//   /** In-memory mirror – kept in sync with sessionStorage. */
//   private cache: StorageMap;

//   constructor() {
//     this.cache = pruneExpired(readStorage());
//     writeStorage(this.cache); // persist pruned state
//   }

//   /**
//    * Returns `true` and records the key if this is the first time we see it
//    * within its TTL window.
//    * Returns `false` (and logs) when the key is a duplicate.
//    */
//   markIfNew(key: string, ttlMs: number = DEFAULT_TTL_MS): boolean {
//     // Always prune before checking so TTL expiry is respected across refreshes.
//     this.cache = pruneExpired(this.cache);

//     if (this.cache[key]) {
//       const age = Math.round((Date.now() - this.cache[key].ts) / 1_000);
//       console.debug(`[Dedup] ⛔ duplicate ignored (${age}s old): ${key}`);
//       return false;
//     }

//     this.cache[key] = { ts: Date.now(), ttl: ttlMs };
//     writeStorage(this.cache);
//     console.debug(`[Dedup] ✅ new event recorded: ${key}`);
//     return true;
//   }

//   /** Check without recording. */
//   has(key: string): boolean {
//     return !!this.cache[key] && Date.now() < this.cache[key].ts + this.cache[key].ttl;
//   }

//   /** Remove a key immediately (e.g. after a failed side-effect). */
//   remove(key: string): void {
//     delete this.cache[key];
//     writeStorage(this.cache);
//   }

//   /**
//    * Schedule removal after `delayMs`. Useful for short-lived dedup windows
//    * (e.g. burst protection) where you want the key to eventually expire
//    * sooner than its TTL.
//    */
//   removeAfter(key: string, delayMs: number): void {
//     setTimeout(() => this.remove(key), delayMs);
//   }

//   /**
//    * Bulk-mark keys that were already handled by the API hydration pass so
//    * Pusher events for the same logical events are silently dropped.
//    */
//   markBulk(keys: string[], ttlMs: number = DEFAULT_TTL_MS): void {
//     const now = Date.now();
//     let changed = false;
//     for (const key of keys) {
//       if (!this.cache[key]) {
//         this.cache[key] = { ts: now, ttl: ttlMs };
//         changed = true;
//       }
//     }
//     if (changed) writeStorage(this.cache);
//   }

//   /** Full reset – call on sign-out / role switch. */
//   clear(): void {
//     this.cache = {};
//     try {
//       sessionStorage.removeItem(STORAGE_KEY);
//     } catch {
//       // ignore
//     }
//   }

//   /** Expose the current cache size for diagnostics. */
//   get size(): number {
//     return Object.keys(this.cache).length;
//   }
// }

// // ─── module-level singleton ──────────────────────────────────────────────────

// let _instance: PersistentDeduplicator | null = null;

// /** Always returns the same instance; safe to call from multiple hooks. */
// export function getDeduplicator(): PersistentDeduplicator {
//   if (!_instance) {
//     _instance = new PersistentDeduplicator();
//   }
//   return _instance;
// }

// /** Reset the singleton (useful in tests or after sign-out). */
// export function resetDeduplicator(): void {
//   _instance?.clear();
//   _instance = null;
// }