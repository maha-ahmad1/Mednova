"use client";

import Image from "next/image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Star, Clock, Calendar, Users, ArrowLeft, PlayCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type TypeItem = {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  ratings_avg_rating: string;
  total_reviews: number;
  average_rating: number;
};

export default function Program() {
  const { data: session, status } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getTopEnrolledProgram"],
    queryFn: async () => {
      try {
        const token = session?.accessToken;

        const res = await axios.get(
          "https://demoapplication.jawebhom.com/api/programs/show/get-top-enrolled-program",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 3,
            },
          }
        );

        console.log("✅ API Response:", res.data);
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", err.response?.data || err.message);
        } else {
          console.error("Unexpected Error:", err);
        }
        throw err;
      }
    },
    enabled: status === "authenticated",
  });

  // حالة التحميل
  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">حدث خطأ</h3>
              <p className="text-red-600 mb-4">تعذر تحميل البرامج التأهيلية</p>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => window.location.reload()}
              >
                إعادة المحاولة
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const programs = data?.data || [];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الهيدر */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-6 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            <span className="text-sm font-medium text-[#32A88D]">البرامج الأكثر طلباً</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            برامجنا التأهيلية الأكثر طلبًا
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            مصممة لعلاج الحالات الشائعة بتمارين دقيقة وأساليب حديثة تساعد على
            تحسين الحركة وتخفيف الألم بإشراف مختصين معتمدين.
          </p>
        </div>

        {/* شبكة البرامج */}
        {programs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {programs.map((program: TypeItem) => (
              <div
                key={program.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* صورة البرنامج */}
                <div className="relative overflow-hidden">
                  <Image
                    src={program.image || "/images/home/Sports-rehabilitation.jpg"}
                    alt={program.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-[#32A88D] px-3 py-1 rounded-full text-xs font-medium border border-[#32A88D]/20">
                      الأكثر طلباً
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {Number(program.ratings_avg_rating).toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* محتوى البرنامج */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {program.description}
                  </p>

                  {/* معلومات البرنامج */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">30-45 دقيقة</div>
                        <div className="text-xs text-gray-500">مدة الجلسة</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">6 جلسات</div>
                        <div className="text-xs text-gray-500">عدد الجلسات</div>
                      </div>
                    </div>
                  </div>

                  {/* السعر والإجراءات */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-[#32A88D]">
                        ${program.price}
                      </div>
                      <div className="text-sm text-gray-500">للبرنامج</div>
                    </div>
                    
                    <Button 
                      className="cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <PlayCircle className="ml-2 w-4 h-4" />
                      طلب البرنامج
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">لا توجد برامج متاحة</h3>
              <p className="text-gray-600">سيتم إضافة البرامج التأهيلية قريباً</p>
            </div>
          </div>
        )}

        {/* زر عرض المزيد */}
        {programs.length > 0 && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-8 py-3 transition-all duration-300 group"
            >
              عرض جميع البرامج
              <ArrowLeft className="mr-2 w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}