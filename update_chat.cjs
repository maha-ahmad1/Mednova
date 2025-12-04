const fs = require('fs');
const path = 'src/features/chat/ui/ChatInterface.tsx';

let content = fs.readFileSync(path, 'utf8');

// Find and replace the atTopStateChange section
const oldPattern = /atTopThreshold=\{100\}.*?followOutput="auto"/s;

const newCode = `atTopThreshold={200}
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
  
    increaseViewportBy={{ top: 400, bottom: 400 }} 
  // ✅ تجاهل endReached
  endReached={() => {
    console.log("⬇️ وصلنا للأسفل (أحدث الرسائل)");
  }}
  
  // ✅ المتابعة التلقائية للأسفل
  followOutput={shouldFollowOutput ? "auto" : false}`;

if (oldPattern.test(content)) {
  content = content.replace(oldPattern, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('✅ تم التحديث بنجاح!');
} else {
  console.log('❌ لم يتم العثور على النمط المطلوب');
}
