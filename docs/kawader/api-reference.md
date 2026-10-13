# مرجع API كوادر للفرونت

Oct 8, 2026

هذه النسخة تلغي أي نسخة سابقة من مواصفة كوادر. فيها 8 endpoints بشكلها النهائي، مع كل ما تغيّر منذ النسخة الأولى وما هو قادم.

## 1. حالة كل جزء

| الجزء | الحالة |
| --- | --- |
| Endpoints المريض (P1 إلى P5) | جاهزة ومختبرة |
| Endpoints الأدمن (A1 إلى A3) | جاهزة ومختبرة |
| تعديلات المستشفى (المنطقة، تعطيل التأمين، تغيير مفتاح خدمة) | قيد التنفيذ. موثّقة هنا بشكلها النهائي ومعلَّمة بكلمة **قادم** |
| الإشعارات اللحظية | لم تبدأ. القسم 8 |

## 2. ما تغيّر عن النسخة الأولى

| البند | النسخة الأولى | المعتمد الآن |
| --- | --- | --- |
| مسارات الأدمن | `/api/admin/kawader/...` | `/api/control-panel/kawader/...` |
| عدد endpoints الأدمن | 12 | 3 فقط |
| تغيير الحالة | endpoint لكل إجراء (`mark-sent`، `confirm`...) | endpoint واحدة: `POST .../{id}/status` |
| الخدمة في الطلب | `kawader_service_id` (رقم) | `service_key` (نص) |
| قائمة الخدمات | من جدول، مع إدارة من اللوحة | 7 خدمات ثابتة، بدون إدارة |
| صيغة الموعد عند الإرسال | ISO مع offset | `Y-m-d H:i` بوقت المريض المحلي مع حقل `timezone` |
| موعد مؤكد منفصل | `scheduled_at` | محذوف. في الطلب موعد واحد: `preferred_at` |
| الحالات | 6 | 7، أُضيفت `expired` |
| شكل القوائم | `data.data` | العناصر مصفوفة مباشرة في `data` |
| الأولوية | غير موجودة | `priority` و `priority_label` في ردود الأدمن |
| أقل مدة قبل الموعد | ساعتان | 4 ساعات (**قادم**، حالياً ساعتان) |
| الطلبات المفتوحة لكل مريض | 2 | 3 |
| التأمين | حقول إلزامية | معطّل (**قادم**) |
| المنطقة | غير موجودة | `service_area` إلزامي (**قادم**) |
| الخدمة السابعة | `pharmacy_delivery` | `medical_supplies_delivery` (**قادم**) |
| إحصائيات وإدارة خدمات | موجودة | محذوفة |

## 3. قواعد عامة

- كل طلب يرسل `Accept-Language` بقيمة `ar` أو `en`. غيابه يرجّع رداً مخلوطاً.
- المريض: توكن المريض. الأدمن: توكن الأدمن. توكن المريض على مسارات الأدمن يرجع 401.
- الأوقات في الردود UTC بصيغة ISO 8601، وتُحوَّل لتوقيت المستخدم عند العرض.
- الحقول الاختيارية ترجع `null` ولا تُحذف من الرد.
- لا تبنوا منطقاً على نص `message` أو `status`. اعتمدوا على كود HTTP وحقول `data`.
- لا يُعرض اسم المستشفى للمريض في أي مكان، ولا أي سعر.

غلاف كل رد:

```json
{ "success": true, "message": "...", "data": {}, "pagination": null, "status": "Ok." }
```

في القوائم: `data` مصفوفة العناصر، و `pagination` بجانبها في المستوى الأعلى:

```json
{
  "success": true,
  "message": "...",
  "data": [ { "id": 1 }, { "id": 2 } ],
  "pagination": { "current_page": 1, "per_page": 15, "total": 2, "last_page": 1, "has_more_pages": false },
  "status": "Ok."
}
```

بما أن `useFetcher` يرجّع `data` فقط، القوائم المرقّمة تقرأ الغلاف كاملاً، بنفس طريقة القوائم المرقّمة الحالية في المنصة.

### الأخطاء

| الكود | متى | الشكل |
| --- | --- | --- |
| 401 | بدون توكن، أو توكن من نوع آخر |  |
| 403 | حساب مختص أو مركز على مسارات المريض |  |
| 404 | الطلب غير موجود أو ليس للمريض |  |
| 422 تحقق | حقل غير صالح | `data` كائن: `{ "patient_phone": "نص واحد" }`. تُعرض كل رسالة تحت حقلها |
| 422 قاعدة عمل | تجاوز 3 طلبات، إلغاء أو انتقال غير مسموح | `data` مصفوفة فاضية `[]`، والنص المعروض في `message` |
| 429 | أكثر من 5 محاولات إنشاء في الساعة |  |

## 4. الحالات والأولوية

| `status` | بالعربي | مفتوحة؟ |
| --- | --- | --- |
| `pending` | جديد | نعم |
| `sent_to_hospital` | أُرسل للمستشفى | نعم |
| `confirmed` | مؤكد | نعم |
| `completed` | مكتمل | لا |
| `rejected` | اعتذر المستشفى | لا |
| `cancelled` | ملغي | لا |
| `expired` | منتهي (تلقائي إذا مرّ الموعد قبل التأكيد) | لا |

التسمية الجاهزة تأتي في `status_label` بلغة الطلب، فلا حاجة لترجمتها في الفرونت.

الأولوية (للأدمن فقط): `urgent` خلال 24 ساعة، `soon` خلال 7 أيام، `normal` أبعد. تكون `null` للطلبات المغلقة.

## 5. Endpoints المريض

### P1. `GET /api/kawader/services`

```json
{
  "services": [
    { "key": "gp_visit", "name": "زيارة طبيب عام", "hint": null, "needs_details": false, "needs_destination": false },
    { "key": "home_nursing", "name": "تمريض منزلي", "hint": "مثل: حقن، محاليل...", "needs_details": true, "needs_destination": false },
    { "key": "patient_transfer", "name": "نقل مرضى (غير طارئ)", "hint": "...", "needs_details": false, "needs_destination": true }
  ],
  "areas": [ { "key": "muscat", "name": "مسقط" }, { "key": "sohar", "name": "صحار" } ],
  "insurance_enabled": false,
  "emergency_phone": "9999"
}
```

`areas` و `insurance_enabled` **قادمان**. مفاتيح الخدمات السبعة: `gp_visit`، `dietitian`، `home_nursing`، `physiotherapy`، `home_diagnostics`، `patient_transfer`، `medical_supplies_delivery`.

سلوك النموذج حسب هذا الرد:

- `needs_details = true`: خانة الملاحظات إلزامية (5 أحرف على الأقل)، ويُعرض `hint` تحت الخدمة.
- `needs_destination = true`: يظهر حقل الوجهة ويكون إلزامياً.
- `insurance_enabled = false`: لا تُعرض حقول التأمين ولا تُرسل، ويُعرض سطر "التأمين غير مقبول لخدمات الرعاية المنزلية".
- `emergency_phone`: يُعرض أعلى النموذج للحالات الطارئة، لأن الإسعاف الطارئ ليس ضمن الخدمات.
- يُعرض للمريض أن السعر يُحدَّد ويُدفع مباشرة لمقدم الخدمة نقداً أو بالبطاقة.

### P2. `POST /api/kawader/patient/requests`

| الحقل | إلزامي | ملاحظات |
| --- | --- | --- |
| `service_key` | نعم | من P1 |
| `service_area` | نعم (**قادم**) | من `areas` في P1 |
| `patient_name` | نعم | 3 إلى 150 حرفاً. يُعبَّأ مسبقاً من الملف وقابل للتعديل |
| `patient_age` | نعم | 0 إلى 120 |
| `patient_phone` | نعم | 8 إلى 15 رقماً، ويمكن أن يبدأ بـ `+` |
| `location_address` | نعم | 5 إلى 500 حرف |
| `latitude`، `longitude` | لا | يُرسلان معاً أو لا يُرسلان |
| `transfer_destination` | مع خدمة النقل فقط | 5 إلى 500 حرف |
| `preferred_at` | نعم | `2026-10-10 16:00` بوقت المريض المحلي. بعد 4 ساعات على الأقل وخلال 30 يوماً |
| `timezone` | نعم | مثل `Asia/Muscat` |
| `patient_notes` | حسب `needs_details` | حتى 1000 حرف |
| `consent` | نعم | يجب أن يكون `true` (مربع الموافقة على مشاركة البيانات) |

حقول التأمين (`has_insurance`، `insurance_company`، `insurance_card_number`) لا تُرسل ما دام `insurance_enabled = false`.

الرد 201، وهو نفس شكل الطلب في P3 و P4 و P5:

```json
{
  "id": 123,
  "reference_code": "KWD-2026-000123",
  "status": "pending",
  "status_label": "جديد",
  "service": { "key": "home_nursing", "name": "تمريض منزلي" },
  "service_area": { "key": "muscat", "name": "مسقط" },
  "patient_name": "سالم بن أحمد",
  "patient_age": 67,
  "patient_phone": "+96891234567",
  "location_address": "الخوير، بناية 12 شقة 4",
  "latitude": 23.5957,
  "longitude": 58.4201,
  "transfer_destination": null,
  "preferred_at": "2026-10-10T12:00:00+00:00",
  "has_insurance": false,
  "insurance_company": null,
  "insurance_card_masked": null,
  "patient_notes": "غيار جرح بعد عملية",
  "status_reason": null,
  "can_cancel": true,
  "created_at": "2026-10-08T14:02:55+00:00"
}
```

`service_area` **قادم**. `status_reason` يحمل سبب الاعتذار أو الإلغاء ويُعرض للمريض.

### P3. `GET /api/kawader/patient/requests`

باراميترات اختيارية: `status`، `per_page` (افتراضي 15، أقصى 50)، `page`. الترتيب من الأحدث.

### P4. `GET /api/kawader/patient/requests/{id}`

### P5. `POST /api/kawader/patient/requests/{id}/cancel`

الجسم: `{ "reason": "اختياري، حتى 500 حرف" }`. يُعرض زر الإلغاء فقط عندما `can_cancel = true`.

## 6. Endpoints الأدمن

### A1. `GET /api/control-panel/kawader/requests`

| الفلتر | القيم |
| --- | --- |
| `scope` | `open` (الافتراضي)، `closed`، `all` |
| `status` | حالة واحدة، وتتجاوز `scope` |
| `priority` | `urgent`، `soon`، `normal` |
| `service_key` | مفتاح خدمة |
| `service_area` | مفتاح منطقة (**قادم**) |
| `has_insurance` | `1` أو `0`، وليس `true` أو `false` |
| `date_from`، `date_to` | `2026-10-10`، أيام بتوقيت عُمان |
| `search` | رقم مرجعي أو هاتف أو اسم |
| `per_page`، `page` | أقصى 50 |

الترتيب: المفتوحة بالأقرب موعداً أولاً، والمغلقة بالأحدث.

```json
{
  "id": 1,
  "reference_code": "KWD-2026-000001",
  "status": "pending",
  "status_label": "New",
  "priority": "urgent",
  "priority_label": "Urgent",
  "service": { "key": "home_nursing", "name": "Home Nursing & Clinical Care" },
  "service_area": { "key": "muscat", "name": "Muscat" },
  "patient_name": "Salem Ahmed",
  "patient_age": 67,
  "patient_phone": "+96891234567",
  "preferred_at": "2026-10-09T12:00:00+00:00",
  "has_insurance": false,
  "created_at": "2026-10-08T14:02:55+00:00"
}
```

### A2. `GET /api/control-panel/kawader/requests/{id}`

كل حقول الطلب غير مقنّعة، ومعها:

```json
{
  "...": "كل حقول الطلب، ومنها insurance_card_number و admin_note و handled_by_admin_id وأوقات كل حالة",
  "account": { "id": 1, "full_name": "Salem Ahmed", "phone": "+96891234567", "email": "salem@example.com" },
  "allowed_transitions": ["confirmed", "rejected", "cancelled"],
  "hospital_message": { "text": "*New Home Care Request*\n*Reference:* KWD-2026-000001\n...", "whatsapp_url": null },
  "status_logs": [
    { "from_status": null, "to_status": "pending", "actor_type": "patient", "actor_name": "Salem Ahmed", "note": null, "created_at": "2026-10-08T14:02:55+00:00" }
  ]
}
```

- أزرار الحالة تُبنى من `allowed_transitions` مباشرة: زر لكل قيمة، ولا أزرار إذا كانت فاضية.
- زر "نسخ الرسالة" ينسخ `hospital_message.text`.
- زر "فتح واتساب" يفتح `whatsapp_url`، ويُخفى إذا كانت `null`.
- `account` صاحب الحساب، وقد يختلف عن `patient_name`.

### A3. `POST /api/control-panel/kawader/requests/{id}/status`

```json
{ "status": "confirmed", "admin_note": "اختياري" }
{ "status": "rejected", "reason": "إلزامي", "admin_note": "اختياري" }
```

- `status`: واحدة من `sent_to_hospital`، `confirmed`، `completed`، `rejected`، `cancelled`.
- `reason`: إلزامي مع `rejected` و `cancelled` (3 إلى 500 حرف)، ويراه المريض.
- `admin_note`: اختياري، داخلي، لا يراه المريض.
- الرد عند النجاح: نفس شكل A2 بعد التحديث.

## 7. الشاشات

| الشاشة | الدور | الـ endpoints |
| --- | --- | --- |
| نموذج طلب كوادر | المريض | P1، P2 |
| طلباتي | المريض | P3 |
| تفاصيل الطلب مع زر الإلغاء | المريض | P4، P5 |
| قائمة الطلبات: شارة الأولوية، تبويب مفتوح ومغلق، الفلاتر | الأدمن | A1 |
| تفاصيل الطلب: نسخ الرسالة، فتح واتساب، أزرار الحالة، السجل | الأدمن | A2، A3 |

## 8. قادم لاحقاً: الإشعارات

لم تُنفَّذ بعد، والتفاصيل قد تتغير قليلاً عند التنفيذ:

- قناة المريض: `customer.{id}`. قناة الأدمن: `admin.notifications`.
- اسم الحدث: `kawader.request.status.changed`.
- المحتوى: `kawader_request_id` و `reference_code` و `status` فقط. الواجهة تجلب التفاصيل من P4 أو A2.
- المريض يُشعَر عند: الإرسال للمستشفى، التأكيد، الاعتذار، الإلغاء من الإدارة، الإتمام، الانتهاء التلقائي.
- الأدمن يُشعَر عند: طلب جديد، إلغاء من المريض، انتهاء تلقائي.

سنرسل تحديثاً لهذا القسم بعد التنفيذ.





مرحباً، هذه endpoints لوحة الأدمن لميزة كوادر، جاهزة ومختبرة.
كل الطلبات تحتاج توكن الأدمن وهيدر Accept-Language بقيمة ar أو en.

━━━ المسارات ━━━
GET  /api/control-panel/kawader/requests              قائمة الطلبات
GET  /api/control-panel/kawader/requests/{id}         تفاصيل طلب
POST /api/control-panel/kawader/requests/{id}/status  تغيير الحالة

━━━ 1. القائمة ━━━
فلاتر اختيارية: scope (open | closed | all، الافتراضي open)، status، priority (urgent | soon | normal)، service_key، has_insurance (1 أو 0، وليس true/false)، date_from، date_to، search، per_page (حد أقصى 50)، page

{
  "success": true,
  "message": "...",
  "data": [
    {
      "id": 1,
      "reference_code": "KWD-2026-000001",
      "status": "pending",
      "status_label": "New",
      "priority": "urgent",
      "priority_label": "Urgent",
      "service": { "key": "home_nursing", "name": "Home Nursing & Clinical Care" },
      "patient_name": "Salem Ahmed",
      "patient_age": 67,
      "patient_phone": "+96891234567",
      "preferred_at": "2026-10-09T12:00:00+00:00",
      "has_insurance": true,
      "created_at": "2026-10-08T14:02:55+00:00"
    }
  ],
  "pagination": { "current_page": 1, "per_page": 2, "total": 3, "last_page": 2, "has_more_pages": true },
  "status": "Ok."
}

━━━ 2. التفاصيل ━━━
{
  "success": true,
  "message": "...",
  "data": {
    "id": 1,
    "reference_code": "KWD-2026-000001",
    "status": "sent_to_hospital",
    "status_label": "Sent to Hospital",
    "priority": "urgent",
    "priority_label": "Urgent",
    "service": { "key": "home_nursing", "name": "Home Nursing & Clinical Care" },
    "patient_name": "Salem Ahmed",
    "patient_age": 67,
    "patient_phone": "+96891234567",
    "location_address": "Al Khuwair, building 12, flat 4",
    "latitude": 23.5957,
    "longitude": 58.4201,
    "transfer_destination": null,
    "preferred_at": "2026-10-09T12:00:00+00:00",
    "has_insurance": true,
    "insurance_company": "Oman Insurance",
    "insurance_card_number": "INS-99887766",
    "patient_notes": "Wound dressing after surgery",
    "cancelled_by": null,
    "status_reason": null,
    "admin_note": "Sent via WhatsApp",
    "handled_by_admin_id": 1,
    "consent_accepted_at": "2026-10-08T14:02:55+00:00",
    "sent_to_hospital_at": "2026-10-08T14:05:56+00:00",
    "confirmed_at": null,
    "completed_at": null,
    "rejected_at": null,
    "cancelled_at": null,
    "expired_at": null,
    "created_at": "2026-10-08T14:02:55+00:00",
    "updated_at": "2026-10-08T14:05:56+00:00",
    "account": { "id": 1, "full_name": "Salem Ahmed", "phone": "+96891234567", "email": "salem@example.com" },
    "allowed_transitions": ["confirmed", "rejected", "cancelled"],
    "hospital_message": {
      "text": "*New Home Care Request*\n*Reference:* KWD-2026-000001\n\n*Patient Name:* Salem Ahmed\n...",
      "whatsapp_url": null
    },
    "status_logs": [
      { "from_status": null, "to_status": "pending", "actor_type": "patient", "actor_name": "Salem Ahmed", "note": null, "created_at": "2026-10-08T14:02:55+00:00" },
      { "from_status": "pending", "to_status": "sent_to_hospital", "actor_type": "admin", "actor_name": "Mona Admin", "note": "Sent via WhatsApp", "created_at": "2026-10-08T14:05:56+00:00" }
    ]
  },
  "pagination": null,
  "status": "Ok."
}

━━━ 3. تغيير الحالة ━━━
الجسم:
{ "status": "confirmed", "admin_note": "اختياري" }
{ "status": "rejected", "reason": "إلزامي مع rejected و cancelled", "admin_note": "اختياري" }

القيم المسموحة في status: sent_to_hospital, confirmed, completed, rejected, cancelled
الرد عند النجاح: نفس شكل التفاصيل (رقم 2) بعد التحديث، مع message مختلفة.

━━━ 4. الأخطاء 422 ━━━
انتقال غير مسموح:
{ "success": false, "message": "The request cannot be moved to this status from its current status.", "data": [], "status": "Unprocessable Entity" }

خطأ تحقق (مثل reason ناقص):
{ "success": false, "message": "...", "data": { "reason": "The reason field is required." }, "status": "Unprocessable Entity" }

━━━ ملاحظات مهمة ━━━
1. أزرار الحالة تُبنى من allowed_transitions مباشرة: زر لكل قيمة في المصفوفة، وإذا كانت فاضية لا تظهر أزرار.
2. زر "نسخ الرسالة" ينسخ hospital_message.text. زر "فتح واتساب" يفتح whatsapp_url، ويُخفى إذا كانت القيمة null.
3. في القوائم: العناصر مصفوفة مباشرة في data، و pagination في المستوى الأعلى بجانبها.
4. في 422: إذا data كائن فيه حقول، تُعرض كل رسالة تحت حقلها. إذا data مصفوفة فاضية، تُعرض message.
5. كل الأوقات UTC بصيغة ISO وتُحوَّل لتوقيت المستخدم عند العرض.
6. priority و priority_label تكون null للطلبات المغلقة.
7. الحقول الاختيارية ترجع null ولا تُحذف من الرد.

━━━ تغييرات قادمة قريباً (بعد رد المستشفى) ━━━
- حقل جديد service_area (المنطقة) في كل الردود، وإلزامي في نموذج المريض، وفلتر في قائمة الأدمن.
- التأمين سيُعطَّل: حقول التأمين تبقى في الرد لكن لا تُعرض في النموذج.
- قائمة الخدمات (GET /api/kawader/services) سترجع أيضاً areas و insurance_enabled.
- مفتاح الخدمة السابعة يتغير من pharmacy_delivery إلى medical_supplies_delivery.
سنرسل الردود النهائية بعد تطبيق هذه التغييرات.






ملاحظة للفرونت (بضيفها بوثيقتهم بعد ما تنجح الاختبارات): إشعارات كوادر للمريض بتيجي على قناة customer.{id}، مش patient.{id} اللي بتيجي عليها إشعارات الاستشارات. واسم الحدث kawader.request.status.changed.