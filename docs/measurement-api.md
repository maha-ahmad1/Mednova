# Measurement Feature — API Documentation (for React Frontend)

Smart-glove ROM (range-of-motion) measurement sessions requested by a consultant (therapist / rehabilitation center) during an **active** consultation, executed on the external **Thero** platform, with results delivered back via webhook and pushed to the consultant in real time over Pusher.

All endpoints return the project-standard envelope:

```json
{
  "success": true,
  "message": "CREATE_SUCCESS",
  "data": { /* ... */ },
  "pagination": null,
  "status": "successfully created."
}
```

> `message` is a **translation key**, not display text — resolve it against `resources/lang/{locale}/messages.php` (or just show a generic message per `success`). `status` is a short human-readable HTTP status label, not the numeric code — read the numeric code from the actual HTTP response status.

All responses respect the `Accept-Language` header (`en` or `ar`, defaults to Arabic) for localized fields inside `data` (status labels).

---

## Quick Reference

| # | Method | Path | Auth | Who | Purpose |
|---|--------|------|------|-----|---------|
| 1 | `POST` | `/api/consultation-request/{type}/{id}/measurement` | Bearer (`auth:api`) | therapist, rehabilitation_center | Request a new measurement session |
| 2 | `GET` | `/api/consultation-request/{type}/{id}/measurements` | Bearer (`auth:api`) | therapist, rehabilitation_center | List all measurements for a consultation |
| 3 | `GET` | `/api/consultation-request/{type}/{id}/measurement/{measurementId}` | Bearer (`auth:api`) | therapist, rehabilitation_center | Get one measurement's current status |
| 4 | `POST` | `/api/consultation-request/{type}/{id}/measurement/{measurementId}/cancel` | Bearer (`auth:api`) | therapist, rehabilitation_center | Cancel a pending/in-progress measurement |
| 5 | `GET` | `/api/patients/{patientId}/measurements` | Bearer (`auth:api`) | patient (self) or their consultant | Paginated measurement history for a patient |
| — | `POST` | `/api/measurement-result` | Shared secret (`X-Bridge-Secret`), **not user auth** | Thero server only | Webhook — results delivery (React never calls this) |

`{type}` is always `video` or `chat` (route constraint `video\|chat`). `{id}` and `{patientId}` are numeric (route constraint `whereNumber`).

---

## Authentication & Authorization

- All 5 consultant/patient-facing endpoints require a Sanctum Bearer token: `Authorization: Bearer {token}`, guard `api`.
- Endpoints 1–4 additionally require `type_account` in `[therapist, rehabilitation_center]` (middleware `account_type:therapist,rehabilitation_center`) and sit under the `check.account` middleware (account must be `active` + `approved`).
- Endpoints 1–4 are **doctor-scoped**: the authenticated user must be the `consultant_id` on the target consultation, or the API returns a `403`.
- Endpoint 5 (`history`) is open to any authenticated user, but access is checked in-code:
  - the caller is the patient themself (`user.id === patientId`), **or**
  - the caller has at least one video or chat consultation as consultant with that patient.
  - Otherwise → `403`.

---

## 1. Request a Measurement

```
POST /api/consultation-request/{type}/{id}/measurement
```

Starts a new ROM measurement session for an active consultation. Creates a session on Thero and returns join URLs for both parties.

### Path Parameters

| Param | Type | Example | Notes |
|---|---|---|---|
| `type` | string | `video` | `video` or `chat` |
| `id` | integer | `1024` | Consultation ID (`ConsultationVideoRequest` or `ConsultationChatRequest`) |

### Headers

```
Authorization: Bearer {token}
Accept-Language: en
Accept: application/json
Content-Type: application/json
```

### Request Body

| Field | Type | Required | Rules |
|---|---|---|---|
| `exercise_type` | string | Yes | `max:100` |
| `affected_side` | string | Yes | `in:left,right,both` |
| `target_rom` | numeric | Yes | `min:1`, `max:360` (degrees) |
| `target_reps` | integer | Yes | `min:1`, `max:100` |
| `duration_seconds` | integer | Yes | `min:30`, `max:3600` |

```json
{
  "exercise_type": "shoulder_flexion",
  "affected_side": "left",
  "target_rom": 120,
  "target_reps": 10,
  "duration_seconds": 300
}
```

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "CREATE_SUCCESS",
  "data": {
    "measurement_id": "MEAS-4F7A2B1C",
    "exercise_type": "shoulder_flexion",
    "affected_side": "left",
    "target_rom": 120,
    "target_reps": 10,
    "duration_seconds": 300,
    "measured_rom": null,
    "reps_completed": null,
    "accuracy_percentage": null,
    "status": "pending",
    "status_label": "Pending",
    "end_reason": null,
    "therapist_url": "https://thero.mednovacare.com/session?bridge_room_id=ROOM-9C3D1A2B&bridge_token=aB3xY9...",
    "patient_url": "https://thero.mednovacare.com/join/ROOM-9C3D1A2B?token=aB3xY9...",
    "expires_at": "2026-09-02T14:00:00+00:00",
    "started_at": null,
    "completed_at": null,
    "created_at": "2026-09-02T12:00:00+00:00"
  },
  "pagination": null,
  "status": "successfully created."
}
```

**Frontend flow:** open `therapist_url` in the consultant's browser/webview to join the ROM session; `patient_url` is meant to be shared/opened by the patient. Poll endpoint 3, or (better) listen on Pusher (see below) for the result once the session ends.

### Error Responses

| Status | Condition | Body |
|---|---|---|
| `404` | Consultation `{id}` of `{type}` not found | `{"success": false, "message": "NOT_FOUND", "data": [], "status": "NotFound."}` |
| `422` | Caller is not the consultant on this consultation | `{"success": false, "message": "You do not have permission to modify this consultation.", "data": [], "status": "Unprocessable Entity"}` |
| `422` | Consultation status is not `accepted`/`active` | `{"success": false, "message": "A measurement can only be requested while the consultation is active.", "data": [], "status": "Unprocessable Entity"}` |
| `422` | Validation failure | `{"success": false, "message": "ERROR_OCCURRED", "data": {"exercise_type": "The exercise type field is required."}, "status": "Unprocessable Entity"}` |
| `422` | Thero bridge unreachable/failed | `{"success": false, "message": "Measurement service unavailable, please try again later.", "data": [], "status": "Unprocessable Entity"}` |
| `500` | Unexpected server error | `{"success": false, "message": "ERROR_OCCURRED", "data": {"error": "..."}, "status": "Internal Server Error"}` |

> Note: authorization/business-rule failures here are `\DomainException` and are surfaced as **422**, not 403/404 — the controller only returns `404` when the consultation record itself doesn't exist, and `403` is used elsewhere (see endpoint 2 and 5).

---

## 2. List Measurements for a Consultation

```
GET /api/consultation-request/{type}/{id}/measurements
```

Returns every measurement ever requested for one consultation (not paginated).

### Headers
```
Authorization: Bearer {token}
Accept-Language: en
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "DATA_RETRIEVED_SUCCESSFULLY",
  "data": [
    {
      "measurement_id": "MEAS-4F7A2B1C",
      "exercise_type": "shoulder_flexion",
      "affected_side": "left",
      "target_rom": 120,
      "target_reps": 10,
      "duration_seconds": 300,
      "measured_rom": 108.5,
      "reps_completed": 9,
      "accuracy_percentage": 90.4,
      "status": "completed",
      "status_label": "Completed",
      "end_reason": "completed",
      "therapist_url": "https://thero.mednovacare.com/session?bridge_room_id=ROOM-9C3D1A2B&bridge_token=aB3xY9...",
      "patient_url": "https://thero.mednovacare.com/join/ROOM-9C3D1A2B?token=aB3xY9...",
      "expires_at": "2026-09-02T14:00:00+00:00",
      "started_at": null,
      "completed_at": "2026-09-02T12:18:32+00:00",
      "created_at": "2026-09-02T12:00:00+00:00"
    }
  ],
  "pagination": null,
  "status": "Ok."
}
```

### Error Responses

| Status | Condition |
|---|---|
| `404` | Consultation not found — `NOT_FOUND` |
| `403` | Caller is not the consultant on this consultation — `UNAUTHORIZED_CONSULTATION_ACTION` |
| `500` | Unexpected error |

---

## 3. Get a Single Measurement

```
GET /api/consultation-request/{type}/{id}/measurement/{measurementId}
```

Use for polling a measurement's status/result (e.g. if not listening on Pusher).

### Path Parameters
`measurementId` — the human-readable ID returned at creation, e.g. `MEAS-4F7A2B1C` (**not** the numeric DB id).

### Success Response — `200 OK`
Same `ConsultationMeasurementResource` shape as above, single object in `data`, message key `DATA_RETRIEVED_SUCCESSFULLY`.

### Error Responses

| Status | Condition | Message key |
|---|---|---|
| `404` | Consultation not found | `NOT_FOUND` |
| `422` | Measurement not found / doesn't belong to this consultation | `NOT_FOUND` (raised as `DomainException` → 422, **not** 404) |
| `422` | Caller is not the consultant on this consultation | `UNAUTHORIZED_CONSULTATION_ACTION` |
| `500` | Unexpected error | `ERROR_OCCURRED` |

---

## 4. Cancel a Measurement

```
POST /api/consultation-request/{type}/{id}/measurement/{measurementId}/cancel
```

Cancels a measurement that hasn't finished yet. No request body required.

### Headers
```
Authorization: Bearer {token}
Accept-Language: en
```

### Request Body
None (empty `{}` is fine — `CancelMeasurementRequest` has no rules).

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "STATUS_UPDATED",
  "data": {
    "measurement_id": "MEAS-4F7A2B1C",
    "exercise_type": "shoulder_flexion",
    "affected_side": "left",
    "target_rom": 120,
    "target_reps": 10,
    "duration_seconds": 300,
    "measured_rom": null,
    "reps_completed": null,
    "accuracy_percentage": null,
    "status": "cancelled",
    "status_label": "Cancelled",
    "end_reason": "cancelled_by_doctor",
    "therapist_url": "https://thero.mednovacare.com/session?bridge_room_id=ROOM-9C3D1A2B&bridge_token=aB3xY9...",
    "patient_url": "https://thero.mednovacare.com/join/ROOM-9C3D1A2B?token=aB3xY9...",
    "expires_at": "2026-09-02T14:00:00+00:00",
    "started_at": null,
    "completed_at": "2026-09-02T12:05:11+00:00",
    "created_at": "2026-09-02T12:00:00+00:00"
  },
  "pagination": null,
  "status": "Ok."
}
```

### Error Responses

| Status | Condition | Message key |
|---|---|---|
| `404` | Consultation not found | `NOT_FOUND` |
| `422` | Measurement not found / mismatched consultation | `NOT_FOUND` |
| `422` | Caller is not the consultant on this consultation | `UNAUTHORIZED_CONSULTATION_ACTION` |
| `422` | Measurement is already `completed`/`abandoned`/`cancelled` (only `pending`/`in_progress` can be cancelled) | `This measurement cannot be cancelled in its current status.` |
| `500` | Unexpected error | `ERROR_OCCURRED` |

---

## 5. Patient Measurement History

```
GET /api/patients/{patientId}/measurements
```

Paginated list of a patient's measurements across **all** their consultations (video + chat). Callable by the patient themself, or by a consultant who has had a consultation with that patient.

### Query Parameters

| Param | Type | Default | Notes |
|---|---|---|---|
| `per_page` | integer | 15 | Capped at 50 server-side |

### Headers
```
Authorization: Bearer {token}
Accept-Language: en
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "DATA_RETRIEVED_SUCCESSFULLY",
  "data": [
    {
      "measurement_id": "MEAS-4F7A2B1C",
      "exercise_type": "shoulder_flexion",
      "affected_side": "left",
      "target_rom": 120,
      "target_reps": 10,
      "duration_seconds": 300,
      "measured_rom": 108.5,
      "reps_completed": 9,
      "accuracy_percentage": 90.4,
      "status": "completed",
      "status_label": "Completed",
      "end_reason": "completed",
      "therapist_url": "https://thero.mednovacare.com/session?bridge_room_id=ROOM-9C3D1A2B&bridge_token=aB3xY9...",
      "patient_url": "https://thero.mednovacare.com/join/ROOM-9C3D1A2B?token=aB3xY9...",
      "expires_at": "2026-09-02T14:00:00+00:00",
      "started_at": null,
      "completed_at": "2026-09-02T12:18:32+00:00",
      "created_at": "2026-09-02T12:00:00+00:00"
    }
  ],
  "pagination": {
    "total": 27,
    "per_page": 15,
    "current_page": 1,
    "last_page": 2
  },
  "status": "Ok."
}
```

### Error Responses

| Status | Condition | Message key |
|---|---|---|
| `403` | Caller is neither the patient nor a consultant who treated them | `UNAUTHORIZED_CONSULTATION_ACTION` |
| `500` | Unexpected error | `ERROR_OCCURRED` |

---

## Status Values Reference

| `status` (raw) | `status_label` (en) | `status_label` (ar) | Meaning |
|---|---|---|---|
| `pending` | Pending | بانتظار البدء | Session created, not yet started |
| `in_progress` | In Progress | جارٍ | Session started, glove streaming data |
| `completed` | Completed | مكتمل | Finished normally; `measured_rom`/`reps_completed`/`accuracy_percentage` populated |
| `abandoned` | Abandoned | غير مكتمل | Ended early (patient stopped, pain, disconnect, timeout, technical error) |
| `cancelled` | Cancelled | ملغي | Cancelled by the doctor before/during the session |

`status_label` is already localized server-side based on `Accept-Language` — the frontend should just display it directly and doesn't need its own translation table for status.

`end_reason` raw values seen from Thero: `completed`, `stopped_by_therapist` → mapped to `completed`; `stopped_by_patient`, `pain`, `disconnected`, `timeout`, `technical_error` → mapped to `abandoned`; plus `cancelled_by_doctor` when cancelled via endpoint 4.

---

## Real-Time Result Delivery (Pusher)

React does not call the webhook — results arrive server-side from Thero, get saved, and are pushed to the **consultant** in real time. Use this instead of polling endpoint 3 wherever possible.

- **Channel:** `private-consultant.{consultant_id}` (private channel — requires Sanctum-authenticated broadcast auth via `/broadcasting/auth`; this is the consultant's existing personal channel, reused for this event rather than a dedicated per-measurement channel)
- **Event name:** `measurement.completed`
- **Broadcast type:** `ShouldBroadcastNow` — fires immediately, no queue delay

### Payload

```json
{
  "consultation_id": 1024,
  "consultation_type": "App\\Models\\ConsultationVideoRequest",
  "measurement_id": "MEAS-4F7A2B1C",
  "status": "completed",
  "exercise_type": "shoulder_flexion",
  "affected_side": "left",
  "measured_rom": 108.5,
  "target_rom": 120,
  "reps_completed": 9,
  "target_reps": 10,
  "accuracy_percentage": 90.4,
  "end_reason": "completed",
  "completed_at": "2026-09-02T12:18:32+00:00"
}
```

> Note `consultation_type` is the raw PHP FQCN (`App\Models\ConsultationVideoRequest` or `App\Models\ConsultationChatRequest`) — use it only to distinguish video vs. chat, don't display it directly. `status`/`end_reason` use the same raw values as the REST endpoints (map to labels client-side using the table above, or just re-fetch endpoint 3 for the fully localized `status_label`).

### Suggested Laravel Echo setup

```js
Echo.private(`consultant.${consultantId}`)
  .listen('.measurement.completed', (payload) => {
    // payload.measurement_id, payload.status, payload.measured_rom, ...
  });
```

Note the leading `.` before `measurement.completed` — required by Echo because the event declares an explicit `broadcastAs()` name rather than using its class name.

---

## Webhook (Context Only — Not Called by React)

```
POST /api/measurement-result
```

This is how measurement results actually get into the system. Thero calls it server-to-server when a session ends; React never touches this endpoint, but the flow explains why results might not be instant.

- **Auth:** header `X-Bridge-Secret` must match `config('services.thero.bridge_secret')` (env `THERO_BRIDGE_SECRET`). No user/Sanctum auth.
- **Always responds `200`**, even on internal error (by design, to stop Thero's retry loop) — errors are logged server-side instead of surfaced via HTTP status.
- **Expected payload fields** (all read defensively, no strict validation):

| Field | Notes |
|---|---|
| `room_id` or `session_id` | One of the two must match the `room_id` stored when the measurement was created; `session_id` is Thero's actual current field name |
| `measured_rom` | number |
| `reps_completed` | integer |
| `accuracy_percentage` | number |
| `end_reason` | `completed`, `stopped_by_therapist`, `stopped_by_patient`, `pain`, `disconnected`, `timeout`, `technical_error` |
| `completed_at` | ISO 8601 datetime; defaults to server "now" if absent |

On receipt: the matching `ConsultationMeasurement` row is updated (`measured_rom`, `reps_completed`, `accuracy_percentage`, `status`, `end_reason`, full raw payload in `result_data`, `completed_at`), then the `MeasurementCompleted` event fires, triggering the Pusher push described above. If no matching measurement is found for the room/session id, the webhook just logs a warning and does nothing (no error surfaced anywhere).

---

## Known Gaps / Things Frontend Should Be Aware Of

- **Thero integration is currently mocked in code** (`MeasurementService::callTheroApi` / `callTheroCancelApi`) behind a live HTTP call that's already wired up but pending Thero's endpoint being ready — the response shape documented above (`room_id`, `therapist_url`, `patient_url`, `expires_at`) is the contract, but exact values/latency may change once Thero's real bridge goes live.
- Endpoint 1 authorization/business-rule failures return **422**, not 403 — don't special-case 403 handling for "not your consultation" on the *store* endpoint; do handle 403 for `index` (list) and `history`.
- `measurementId` in the URL is always the string `measurement_id` (e.g. `MEAS-4F7A2B1C`), never the internal numeric row id.
