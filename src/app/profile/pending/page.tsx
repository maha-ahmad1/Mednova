import { Clock, FileCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-l from-white to-white/90 rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
          {/* أيقونة رئيسية */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#32A88D] to-[#2a8a7a] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <FileCheck className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* العنوان الرئيسي */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            حسابك تحت المراجعة
          </h1>

          {/* الرسالة التوضيحية */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            نعمل على مراجعة معلومات حسابك للتأكد من صحتها وكفايتها. 
            هذه العملية تستغرق عادةً من 24 إلى 48 ساعة.
          </p>

          {/* معلومات إضافية */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">لماذا المراجعة؟</span>
            </div>
            <p className="text-sm text-blue-600">
              نراجع جميع الحسابات الجديدة لضمان جودة الخدمة وحماية بيانات المستخدمين
            </p>
          </div>

          {/* الخطوات التالية */}
          {/* <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-[#32A88D] rounded-full flex items-center justify-center text-white text-xs">
                1
              </div>
              <span>سيتم إشعارك عبر البريد الإلكتروني عند تفعيل الحساب</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-[#32A88D] rounded-full flex items-center justify-center text-white text-xs">
                2
              </div>
              <span>يمكنك تعديل معلوماتك في أي وقت أثناء المراجعة</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-[#32A88D] rounded-full flex items-center justify-center text-white text-xs">
                3
              </div>
              <span>ستتمكن من الوصول الكامل بعد التفويـل</span>
            </div>
          </div> */}

          {/* أزرار الإجراءات */}
          {/* <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-[#32A88D] hover:bg-[#2a8a7a] text-white rounded-xl py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              تحديث المعلومات
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl py-3 transition-all duration-200"
            >
              التواصل مع الدعم
            </Button>
          </div> */}

          {/* رسالة طمأنة */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              شكرًا لصبرك. نحن هنا لمساعدتك في أي وقت
            </p>
          </div>
        </div>

        {/* معلومات إضافية في الأسفل */}
        <div className="text-center mt-6">
          <div className="flex justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>مدة المراجعة: 1-2 يوم</span>
            </div>
            <div className="flex items-center gap-1">
              <FileCheck className="w-3 h-3" />
              <span>مراجعة الجودة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}