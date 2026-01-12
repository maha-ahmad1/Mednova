"use client";

import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Video,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// import LandingNavbar from "@/shared/ui/layout/LandingNavbar";
import  Navbar  from "@/shared/ui/components/Navbar/Navbar";


export default function Hero() {

  return (
    <>
          <Navbar variant="landing" />        

    
    <section className="relative md:px-10 bg-gradient-to-br from-[#32A88D]/5 via-white to-blue-50/30 overflow-hidden">
      {/* شكل دائري خلفي */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#32A88D]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* شريط التنقل */}
      {/* <Navbar variant="landing" />         */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 lg:py-20 sm:px-0 3xl:px-32">
          <div className="lg:col-span-7 text-center lg:text-right">
            {/* شارة */}
            <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 text-[#32A88D] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-[#32A88D] rounded-full animate-pulse"></div>
              <span>رحلتك للشفاء تبدأ بميدنوفا</span>
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="sm:text-4xl text-6xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
              راحة جسدك{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#32A88D] to-[#2a8a7a]">
                تبدأ من هنا
              </span>
            </h1>

            {/* الوصف */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-16 leading-relaxed">
              استعد صحتك وثقتك بنفسك بمساعدة أفضل أخصائي العلاج الطبيعي
              والتأهيلي. رحلتك نحو التعافي تبدأ بخطوة واحدة مع فريقنا المتخصص.
            </p>

            {/* أزرار الإجراء */}
            <div className="flex flex-col w-fit md:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r w-[40%] md:w-[50%] from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                asChild
              >
                <Link href="/specialists">
                  ابدأ البحث الآن
                  <ArrowLeft className="mr-2 w-5 h-5" />
                </Link>
              </Button>

              <Link href="#services">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer border-[#32A88D] w-[40%] md:w-[80%] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-8 py-4 text-lg transition-all duration-300"
                >
                  تعرف أكثر
                </Button>
              </Link>
            </div>

            {/* إحصائيات */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#32A88D]">500+</div>
                <div className="text-sm text-gray-600">مختص معتمد</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#32A88D]">10K+</div>
                <div className="text-sm text-gray-600">مريض شفي</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#32A88D]">98%</div>
                <div className="text-sm text-gray-600">رضا العملاء</div>
              </div>
            </div>
          </div>

          {/* الصورة والعناصر المرئية */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* الصورة الرئيسية */}
              <div className="relative z-10">
                <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] mx-auto">
                  <Image
                    src="/images/home/herosection.png"
                    alt="طبيب مختص"
                    width={480}
                    height={480}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>

              {/* العناصر العائمة */}
              <div className="absolute -top-4 -right-4 z-20">
                <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      استشارة نصية
                    </div>
                    <div className="text-xs text-gray-600">رد فوري</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 z-20">
                <div
                  className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      استشارة فيديو
                    </div>
                    <div className="text-xs text-gray-600">وجه لوجه</div>
                  </div>
                </div>
              </div>

              {/* شكل خلفي */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#32A88D]/20 to-blue-500/20 rounded-2xl blur-xl -z-10 transform scale-110"></div>
            </div>
          </div>
        </div>

       
      </div>

      {/* أنيميشن للعناصر العائمة */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
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
    </>
  );
}
