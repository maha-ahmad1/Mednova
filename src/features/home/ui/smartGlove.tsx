import Image from "next/image";

export default function SmartGlove() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden">
      {/* أشكال خلفية دائرية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* الصورة */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* شكل خلفي */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
              
              {/* الصورة الرئيسية */}
              <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100">
                <Image
                  src={"/images/home/smartGloves.png"}
                  alt="القفاز الذكي من مدنوفا"
                  width={500}
                  height={400}
                  className="w-full h-full object-cover"
                />
                
                {/* تأثير زاوية */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#32A88D] to-transparent rounded-tl-2xl"></div>
              </div>

              {/* بطاقة عائمة */}
              <div className="absolute -bottom-6 -right-6 z-20">
                <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float">
                  <div className="w-12 h-12 bg-[#32A88D] rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-md"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">ذكي</div>
                    <div className="text-xs text-gray-600">تكنولوجيا متطورة</div>
                  </div>
                </div>
              </div>

              {/* بطاقة عائمة ثانية */}
              <div className="absolute -top-6 -left-6 z-20">
                <div 
                  className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="w-12 h-12 bg-[#2a8a7a] rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-md"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">منزلي</div>
                    <div className="text-xs text-gray-600">استخدام سهل</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* النص والمحتوى */}
          <div className="lg:col-span-7 text-center lg:text-right">
            {/* شارة */}
            <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
              <span>تكنولوجيا طبية متطورة</span>
            </div>

            {/* العنوان الرئيسي */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
              القفاز الذكي من{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]">
                مدنوفا
              </span>
            </h2>

            {/* الخط الفاصل */}
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] rounded-full mb-8 mx-auto lg:mx-0"></div>

            {/* الوصف */}
            <p className="text-lg text-gray-600 leading-8 mb-8 max-w-2xl mx-auto lg:mx-0">
              إذا كنت تبحث عن قفازات طبية يعيد لك القدرة على استخدام يدك بشكل
              تدريجي، فهذا المنتج يجمع بين الراحة والكفاءة. بدلاً من الاعتماد فقط
              على العلاج الطبيعي التقليدي، يمكنك الاستفادة من هذا الجهاز الذكي في
              المنزل مع نتائج ملموسة.
            </p>

            {/* نقاط مميزة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#32A88D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-[#32A88D] rounded-full"></div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 mb-1">استخدام منزلي</h4>
                  <p className="text-sm text-gray-600">لا حاجة للذهاب للمركز</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#32A88D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-[#32A88D] rounded-full"></div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 mb-1">نتائج ملموسة</h4>
                  <p className="text-sm text-gray-600">تحسن تدريجي ملحوظ</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#32A88D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-[#32A88D] rounded-full"></div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 mb-1">راحة وكفاءة</h4>
                  <p className="text-sm text-gray-600">تصميم مريح وفعال</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#32A88D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-[#32A88D] rounded-full"></div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-800 mb-1">تكنولوجيا ذكية</h4>
                  <p className="text-sm text-gray-600">أحدث ما توصلت إليه التكنولوجيا</p>
                </div>
              </div>
            </div>

            {/* زر الإجراء */}
            <div className="flex justify-center lg:justify-start mt-8">
              <button className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium">
                تعرف أكثر على القفاز الذكي
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* أنيميشن للعناصر العائمة */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}