// app/home/components/ProgramsSection.tsx
"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import { ProgramCard, type ProgramCardData } from "@/components/common/ProgramCard";
import Link from "next/link";
import { ProgramCard, type ProgramCardData } from "@/shared/ui/components/ProgramCard";
export default function ProgramsSection() {
  const { data: session, status } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getTopEnrolledProgram"],
    queryFn: async () => {
      try {
        const token = session?.accessToken;

        const res = await axios.get(
          "https://mednovacare.com/api/programs/show/get-top-enrolled-program",
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
// تحويل البيانات من API إلى التنسيق المشترك
const programs: ProgramCardData[] = (data?.data || []).map((item: ProgramCardData) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  price: item.price,
  cover_image: item.cover_image, // استخدم cover_image بدل image
  image: item.cover_image, // لتحافظ على التوافق
  average_rating: item.ratings_avg_rating ? Number(item.ratings_avg_rating) : 0,
  total_reviews: item.ratings_count || 0,
  ratings_avg_rating: item.ratings_avg_rating ? Number(item.ratings_avg_rating) : 0,
  ratings_count: item.ratings_count || 0,
  enrollments_count: item.enrollments_count || 0,
  status: item.status || "draft",
  is_approved: item.is_approved || 0,
  // creator غير موجود في API، لذلك نضع قيمة افتراضية
  // creator: {
  //   full_name: "مقدم البرنامج" // قيمة افتراضية أو اسم المستخدم من الجلسة
  // }
}));

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
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse"
              >
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
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                حدث خطأ
              </h3>
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

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* الهيدر */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#32A88D]/10 px-6 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#32A88D] rounded-full"></div>
            <span className="text-sm font-medium text-[#32A88D]">
              البرامج الأكثر طلباً
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            برامجنا التأهيلية الأكثر طلبًا
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            مصممة لعلاج الحالات الشائعة بتمارين دقيقة وأساليب حديثة تساعد على
            تحسين الحركة وتخفيف الألم بإشراف مختصين معتمدين.
          </p>
        </div>

        {/* شبكة البرامج باستخدام المكون المشترك */}
        {programs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {programs.map((program: ProgramCardData) => (
              <ProgramCard
                key={program.id}
                program={program}
                 variant="top-rated"
                 showCreator={true}
                showEnrollments={true}
                showStatus={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                لا توجد برامج متاحة
              </h3>
              <p className="text-gray-600">
                سيتم إضافة البرامج التأهيلية قريباً
              </p>
            </div>
          </div>
        )}

        {/* زر عرض المزيد */}
        {programs.length > 0 && (
          <div className="text-center">
            <Link href="/programs">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-8 py-3 transition-all duration-300 group"
              >
                عرض جميع البرامج
                <ArrowLeft className="mr-2 w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}