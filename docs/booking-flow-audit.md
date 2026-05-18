# Booking Flow Audit — MedNova

**الهدف:** توثيق كامل flow حجز الاستشارة من specialists list حتى رجوع المريض من بوابة الدفع.
**مرجع لبناء:** صفحة Payment Result + صفحة Consultation Details.

---

## 1. SPECIALISTS → BOOKING FLOW

### Route Files (بالترتيب)

| الخطوة | Route | ملف الصفحة |
|--------|-------|------------|
| 1. قائمة المختصين | `/[locale]/specialists` | `src/app/[locale]/specialists/page.tsx` |
| 2. صفحة الحجز (video فقط) | `/[locale]/appointment/[doctorId]` | `src/app/[locale]/appointment/[doctorId]/page.tsx` |
| 3. صفحة الدفع | `/[locale]/payment` | `src/app/[locale]/payment/page.tsx` |
| dialog اختيار النوع | (modal، لا route منفصل) | `src/features/service-provider/ui/ConsultationDialog.tsx` |

### تفاصيل الخطوات

**Step 1 — Specialists List**
- Component: `src/features/service-provider/ui/TherapistsAndCenters.tsx`
- كل بطاقة مختص تفتح `ConsultationDialog` → `src/features/service-provider/ui/ConsultationDialog.tsx`

**Step 2a — Chat Flow (مباشر للدفع)**
- في `ConsultationDialog` (lines 40-97):
  - POST `/api/consultation-request/store` مباشرةً
  - يحفظ النتيجة في Zustand store
  - `router.push("/payment")`

**Step 2b — Video Flow (appointment أولاً)**
- في `ConsultationDialog` (lines 99-116):
  - يحفظ `consultationType: "video"` في Zustand فقط
  - `router.push("/appointment/{providerId}")`
- في BookingPage (`src/features/consultationtype/video/ui/BookingPage.tsx`):
  - يجيب الـ available slots عبر POST `/api/consultation-request/video/check-available-slots`
  - المريض يختار date/time
  - عند الـ confirm: POST `/api/consultation-request/store` مع `requested_day`, `requested_time`, `timezone`
  - يحفظ `consultationRequestId` في Zustand
  - `router.push("/payment")`

### State بين الصفحات

| من → إلى | الآلية | البيانات |
|-----------|--------|---------|
| specialists → appointment | Zustand + URL param `[doctorId]` | `providerId`, `providerName`, `consultationType: "video"` |
| appointment → payment | Zustand (`ConsultationTypeStore`) | كامل `currentConsultation` مع `consultationRequestId` و `financial` |
| payment → payment (return) | URL query params | `?payment_return=1&gateway_payment_id=...&biller_ref=...&status=...` |

**Zustand Store:** `src/store/ConsultationTypeStore.ts`
```typescript
currentConsultation: {
  providerId: string
  providerName: string
  providerImage?: string
  consultationType: 'chat' | 'video'
  consultantType: 'therapist' | 'rehabilitation_center'
  consultationRequestId?: string
  financial: {
    consultationPrice: number
    gatewayCommissionRate: string
    gatewayCommissionAmount: number
    netAmount: number
  }
  currency?: string
  requestedDay?: string
  requestedTime?: string
  appointmentType?: 'online' | 'in-person'
  video_room_link?: string
}
```
Storage: `localStorage` عبر Zustand persist (key: `'consultation-storage'`)

---

## 2. BOOKING/PAYMENT API CALLS

### A. Store Consultation Request

- **File:** `src/features/home/hooks/useConsultationRequestStore.ts`
- **Endpoint:** `POST /api/consultation-request/store`
- **Payload:**
```typescript
{
  patient_id: string | number
  consultant_id: string | number
  consultant_type: "therapist" | "rehabilitation_center"
  consultant_nature: "video" | "chat"
  requested_day?: string        // video only
  requested_time?: string       // video only
  type_appointment?: "online"   // video only
  timezone?: string             // video only
}
```
- **Response:** يحتوي على `id` (consultationRequestId) + financial details
- **يُستدعى من:** `ConsultationDialog` (chat) و `useBookingLogic` (video)

### B. Check Available Slots

- **File:** `src/app/api/slots.ts`
- **Endpoint:** `POST /api/consultation-request/video/check-available-slots`
- **Payload:**
```typescript
{
  consultant_id: string | number
  consultant_type: string
  day: string               // "Monday"
  date: string              // "YYYY-MM-DD"
  type_appointment: "online"
  patient_id?: string
  timezone?: string
}
```
- **Response:** `{ data: { day: string, available_slots: string[] } }`
- **يُستدعى من:** `useAvailableSlots` — `src/features/consultationtype/video/hooks/useAvailableSlots.ts`

### C. Create Payment Link (AmwalPay)

- **File:** `src/features/payment/hooks/useCreatePaymentLink.ts:26-38`
- **Endpoint:** `POST /api/consultation-request/payment-gateway/create-link-payment/{type}/{consultationId}`
  - `type` = `"chat"` | `"video"`
  - `consultationId` = من الـ Zustand store
- **Payload:** `{ payment_method: "card", card_type: "domestic" }`
- **Response:**
```typescript
{
  success: boolean
  data: {
    checkout_url: string        // URL للـ redirect إلى AmwalPay
    gateway_payment_id: number
    biller_ref: string          // مرجع داخلي (مثال: CONS-VIDEO-192-...)
    expires_in_minutes: number
  }
}
```
- **يُستدعى من:** `PaymentPageView` عند الضغط على زر "ادفع"

### D. Get Payment Status

- **File:** `src/features/payment/hooks/usePaymentStatus.ts:20-52`
- **Endpoint:** `GET /api/consultation-request/get-status-request`
- **Query Params:** `{ limit: 30, consultation_id: string | number }`
- **Response:** consultation object يحتوي على `financial_status` / `status`
- **يُستدعى من:** `PaymentPageView` بعد الرجوع من البوابة — polling كل 15 ثانية إذا status = "pending"

### E. Update Consultation Status

- **File:** `src/app/api/consultation.ts:20-32`
- **Endpoint:** `POST /api/consultation-request/update-status-request`
- **Payload:**
```typescript
{
  id: string | number
  status: "accepted" | "completed" | "cancelled"
  action_by: "consultable" | "patient"
  consultant_nature: "video" | "chat"
  action_reason?: string
}
```

---

## 3. AMWAL PAY INTEGRATION

### بناء الـ Redirect URL
- الـ `checkout_url` يُعاد جاهزاً من `POST .../create-link-payment/...`
- الـ frontend **لا يبني الـ URL يدوياً** — يُعيد redirect مباشرة إليه

### Return URL والـ Query Params
- **ملف الاستقبال:** `src/features/payment/pages/PaymentPageView.tsx:144-147`
- الـ return هو **نفس صفحة `/payment`** مع query params:
```
/payment?payment_return=1&gateway_payment_id=...&biller_ref=...&status=...
```
- **Query params المتوقعة:**

| Param | النوع | الوصف |
|-------|-------|-------|
| `payment_return` | flag | يُشير لوجود رجوع من البوابة |
| `gateway_payment_id` | number | رقم المعاملة في AmwalPay |
| `biller_ref` | string | المرجع الداخلي (مثال: `CONS-VIDEO-192-...`) |
| `status` | string | الحالة الخام من البوابة (`"paid"`, `"success"`, `"captured"`) |

### Webhook
- **لا يوجد webhook handler في الـ frontend**
- الكل backend — الـ frontend يعتمد على polling عبر `usePaymentStatus` كل 15 ثانية
- كود التحقق من domain `secure.amwalpay.com` موجود لكنه **معلّق** في `src/features/payment/pages/PaymentPageView.tsx:169`

### Order Reference Format
- `biller_ref` (مثال: `CONS-VIDEO-192-...`) يُوَلَّد في الـ **backend فقط**
- الـ frontend يستلمه كـ response ويمرره كـ query param عند الـ return — لا يُولِّده

---

## 4. CONSULTATION DATA MODEL

### Types — `src/types/consultation.ts`

```typescript
type ConsultationType = "video" | "chat"
type ConsultationStatus = "active" | "accepted" | "cancelled" | "completed" | "pending"
type UserType = "therapist" | "rehabilitation_center" | "patient" | "consultable"
type ConsultantType = "therapist" | "center"

interface ConsultationData {
  id: number
  patient: User
  consultant: User
  consultant_type: string
  status: ConsultationStatus
  appointment: {
    requested_day: string
    requested_time: string
    timezone: string
    type_appointment: string
  }
}

interface ConsultationRequest {
  id: number
  type: ConsultationType
  status: ConsultationStatus
  created_at: string
  updated_at: string
  data: ConsultationData
  video_room_link?: string
}
```

### financial_status — القيم الممكنة

**Raw من API** (`src/features/financial/types/index.ts`):
```typescript
type PaymentStatus = "captured" | "failed" | "pending" | "refunded"
type TransactionStatus = "available" | "frozen" | "completed" | "pending"
```

**Normalized** (`src/features/payment/utils/paymentStatus.ts`):
```typescript
type PaymentStatus = "paid" | "failed" | "pending"
// "paid"   ← ["paid", "completed", "success", "succeeded", "successful"]
// "failed" ← ["failed", "declined", "cancelled", "canceled", "error"]
// "pending" ← default
```

**في PaymentPageView** (`src/features/payment/pages/PaymentPageView.tsx:49`):
```typescript
type PaymentStatusType = "pending" | "paid" | "failed" | "loading"
```

### consultation status — Badge Labels (`src/features/consultations/utils/consultation-helpers.tsx:4-44`)

| Status | Label (AR) | Color |
|--------|-----------|-------|
| `pending` | في انتظار الموافقة | amber |
| `accepted` | مقبول | green |
| `cancelled` | مرفوض | red |
| `active` | نشطة | blue |
| `completed` | مكتمل | gray |

### Patient vs Consultant Response

- **لا يوجد types منفصلة** — نفس `ConsultationData` للطرفين
- الفرق في الـ `action_by` field عند الـ mutations: `"consultable"` | `"patient"`
- الـ components تقرر ماذا تعرض بناءً على `userRole`
- مثال: `ConsultationDetails.tsx` يعرض info المريض للمختص والعكس

---

## 5. EXISTING CONSULTATION/APPOINTMENT PAGES

### صفحة الـ consultations list (موجودة)
- **Route:** `/[locale]/profile/consultations/(therapists)/`
- **Page file:** `src/app/[locale]/profile/consultations/(therapists)/page.tsx`
- **Main component:** `src/features/consultations/TherapistConsultation/components/ConsultationView.tsx`
- تعرض: قائمة استشارات + panel للتفاصيل (split view)

### صفحة تفاصيل استشارة واحدة
- **لا يوجد route مستقل** `/consultation/[id]`
- التفاصيل تُعرض في `ConsultationDetails.tsx` كـ panel جانبي داخل نفس الصفحة
- **File:** `src/features/consultations/TherapistConsultation/components/ConsultationDetails.tsx`
- تعرض حالياً:
  - معلومات المريض/المختص حسب الـ role
  - نوع الاستشارة وحالتها
  - زر Zoom link (إذا video + active)
  - زر Chat (إذا accepted أو active)
  - تفاصيل الموعد (يوم + وقت)

> **خلاصة:** صفحة `/consultation/[id]` المستقلة **غير موجودة** — يجب إنشاؤها.

---

## 6. SHARED UI PATTERNS

### Status Badges
- **`StatusBadge`** — `src/features/financial/ui/shared/StatusBadge.tsx`
  - يدعم: `available`, `pending`, `frozen`, `completed`, `captured`, `failed`, `refunded`
  - مثال استخدام: `src/features/financial/ui/patient/PatientPaymentsTable.tsx`
- **`getStatusBadge()`** — `src/features/consultations/utils/consultation-helpers.tsx:4-44`
  - لـ consultation statuses — يُعيد JSX مع Tailwind classes

### Cards
- **`BaseCard`** — `src/shared/ui/components/cards/BaseCard.tsx`
  - Sub-components: `CardImage`, `CardContent`, `CardHeader`, `CardFooter`
- **shadcn Card** — `src/components/ui/Card.tsx`
  - Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`

### Empty / Loading States
- **`EmptyState`** — `src/shared/ui/components/states/EmptyState.tsx`
  - Types: `no-results`, `error`, `empty`, `no-data`
- **`LoadingState`** — `src/shared/ui/components/states/LoadingState.tsx`
  - Types: `grid` أو `list`
- **`Skeleton`** — `src/components/ui/Skeleton.tsx`

### Badges
- **shadcn `Badge`** — `src/components/ui/Badge.tsx`
  - Variants: `default`, `secondary`, `outline`, `destructive`

---

## 7. ROUTING & MIDDLEWARE

**File:** `src/middleware.ts` + `src/lib/routeConfig.ts`

### المسارات المحمية المرتبطة بالاستشارات

| Route | محمي؟ | الشرط |
|-------|--------|-------|
| `/appointment/*` | ✓ | profile مكتمل + approved |
| `/payment` | ✓ | profile مكتمل + approved |
| `/profile/consultations` | ✓ | profile مكتمل + approved |
| `/profile/chat` | ✓ | profile مكتمل + approved |
| `/profile/financial` | ✓ | profile مكتمل + approved |

### منطق الحماية (middleware.ts:99-130)
1. Profile غير مكتمل → redirect إلى `/profile/create`
2. `approval_status = "pending"` → redirect إلى `/profile/pending`
3. Control panel → admin فقط (lines 84-90)

> **تنبيه:** أي route جديد مثل `/profile/consultations/[id]` يحتاج إضافته لـ `routeConfig.ts`.

---

## ملخص Data Flow

```
/specialists
  ↓ ConsultationDialog opens
  ├─ CHAT ──→ POST /consultation-request/store
  │              → store in Zustand
  │              → navigate to /payment
  │
  └─ VIDEO ──→ navigate to /appointment/[doctorId]
                  ↓
              POST /check-available-slots
              User picks date/time
                  ↓
              POST /consultation-request/store
              store consultationRequestId in Zustand
                  ↓
              navigate to /payment
                  ↓
              /payment page shows summary
                  ↓
              User clicks "Pay"
                  ↓
              POST /create-link-payment/{type}/{id}
              → returns checkout_url
                  ↓
              redirect to AmwalPay (checkout_url)
                  ↓
              [Gateway processing]
                  ↓
              return to /payment?payment_return=1
                        &gateway_payment_id=X
                        &biller_ref=CONS-VIDEO-192-...
                        &status=paid
                  ↓
              GET /get-status-request (poll every 15s)
              Display result: paid / failed / pending
```
