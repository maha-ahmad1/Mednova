# Notifications Root Cause Analysis

## Confirmed root causes

1. **Deduplication key is always unique, so dedupe never works.**
   In `subscribeConsultationEvents`, `eventKey` includes `Date.now()`. That guarantees a unique key per callback invocation, even for the same event payload. Result: duplicate broadcasts are always treated as new notifications.

2. **Realtime notification IDs are also always unique (`Date.now()`), preventing API+socket reconciliation.**
   In `notificationFactory`, IDs for consultation/system/account/message notifications are generated with timestamp suffixes. Even when API later returns the same domain notification, IDs differ (`api_123` vs `consultation_123_..._timestamp`), so merge-by-id cannot deduplicate.

3. **Both data sources feed the same UI without a shared identity strategy.**
   Dropdown path fetches API notifications and syncs to Zustand (`useNotificationsDropdown`), while Echo pushes real-time notifications into the same store. Since identity is not domain-stable, same business event appears multiple times.

4. **Effect re-subscription can happen frequently and magnify duplicates.**
   `useEchoNotifications` depends on `session` object identity. Any session refresh can re-run the effect and re-bind channel listeners. Cleanup exists, but if repeated events arrive around reconnect/rebind windows, duplicates pass through due to broken dedupe key.

5. **Empty notification content path exists for consultation events.**
   `createConsultationNotification` uses `event.message` directly with no fallback. If backend sends missing/empty message, UI renders blank/near-empty item.

## High-probability contributing factors

- **Duplicate backend delivery of `ConsultationUpdatedBroadcast` + initial API history pull** can race at app load and create 2–3 copies of “consultation accepted”.
- **Strict Mode in development** may mount/unmount effects twice, exposing dedupe flaws faster.

## Fix strategy (ordered)

1. Build a **stable domain key** per notification (e.g., `${sourceType}:${consultation_id}:${status}` or backend `event_id`) and use it for both deduplication and notification `id`.
2. Change dedupe key in `subscribeConsultationEvents` to deterministic fields (no timestamp).
3. Normalize API and socket payloads to same identity schema before inserting into store.
4. Add message/title fallbacks at factory level to prevent empty renders.
5. Reduce effect churn by depending on stable session primitives (`session?.user?.id`, `session?.accessToken`, role) instead of whole `session` object.
