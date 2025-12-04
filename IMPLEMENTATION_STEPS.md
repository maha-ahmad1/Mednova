# 🚀 خطوات التنفيذ - الحل الذكي لتحميل البيانات

## الخطوة 1: أضفت الـ State للتتبع ✅ (تم بالفعل)

```tsx
const [isAtTop, setIsAtTop] = useState<boolean>(false);
const [shouldFollowOutput, setShouldFollowOutput] = useState<boolean>(true);
```

## الخطوة 2: أضفت useEffect للتحميل التلقائي ✅ (تم بالفعل)

```tsx
// 🔥 الحل الذكي: تحميل البيانات تلقائياً عند الوصول للأعلى
useEffect(() => {
  if (isAtTop && hasNextPage && !isFetchingNextPage) {
    console.log("⬆️ المستخدم في الأعلى وهناك بيانات أقدم - تحميل تلقائي");
    fetchNextPage();
  }
}, [isAtTop, hasNextPage, isFetchingNextPage, fetchNextPage]);
```

## الخطوة 3: تحديث Virtuoso props - يجب عمله يدوياً

في السطر **~1665**، ابحث عن هذا الكود:

```tsx
atTopThreshold={100} // عندما نكون على بعد 100px من الأعلى
atTopStateChange={(atTop) => {
  if (atTop && hasNextPage && !isFetchingNextPage) {
    console.log("⬆️ الوصول للأعلى - تحميل رسائل أقدم");
    fetchNextPage();
  }
}}
```

استبدله بـ:

```tsx
atTopThreshold={200}
atTopStateChange={(atTop) => {
  if (atTop) {
    console.log("⬆️ المستخدم وصل للأعلى - سيتم التحميل التلقائي");
    setIsAtTop(true);
  } else {
    setIsAtTop(false);
  }
}}

// ✅ تتبع حالة الوصول للأسفل
atBottomStateChange={(atBottom) => {
  console.log("📍 atBottomStateChange:", atBottom);
  setIsAtBottom(atBottom);
}}
```

وقم بتغيير:

```tsx
followOutput="auto"
```

إلى:

```tsx
followOutput={shouldFollowOutput ? "auto" : false}
```

## الخطوة 4: إضافة logic إدارة followOutput ✅ (تم بالفعل)

```tsx
useEffect(() => {
  if (isAtBottom) {
    setShouldFollowOutput(true);
  }
}, [isAtBottom]);

useEffect(() => {
  if (isFetchingNextPage) {
    setShouldFollowOutput(false);
  }
  return () => {
    if (!isFetchingNextPage && isAtBottom) {
      setShouldFollowOutput(true);
    }
  };
}, [isFetchingNextPage, isAtBottom]);
```

## ✅ النتيجة النهائية

بعد تطبيق هذه التغييرات:

1. **عندما يصل المستخدم للأعلى** → `setIsAtTop(true)`
2. **useEffect يلاحظ التغيير** → يستدعي `fetchNextPage()`
3. **البيانات تُحمل** → تُضاف للـ cache تلقائياً
4. **followOutput يبقى ذكياً** → يتحكم بـ auto-scroll بناءً على الحالة

---

## 🔍 ملخص التعديلات

| العنصر | الحالة القديمة | الحالة الجديدة | الفائدة |
|--------|--|--|--|
| `atTopThreshold` | 100 | 200 | مزيد من الرؤية قبل التحميل |
| `atTopStateChange` | استدعاء `fetchNextPage()` مباشرة | تحديث state فقط | تجنب re-renders |
| `atBottomStateChange` | غير موجود | إضافته | تتبع موضع المستخدم |
| `followOutput` | `"auto"` | `shouldFollowOutput ? "auto" : false` | تحكم ديناميكي |

---

## ⚠️ ملاحظات هامة

- الـ useEffect المضافة تتولى منطق التحميل
- لا حاجة لـ `startReached` callback
- السكرول يبقى ذكياً ولا يقفز تلقائياً
- تجنب re-renders غير الضرورية

