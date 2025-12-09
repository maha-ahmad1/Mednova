import { Skeleton } from "@/components/ui/skeleton";


export default function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* عنوان الصفحة - Skeleton */}
        <div className="text-center mb-10">
          <Skeleton className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-4">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </Skeleton>
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأول: معلومات الطبيب - Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* بطاقة معلومات الطبيب - Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-64" />
              </div>

              {/* معلومات الحجز الحالي - Skeleton */}
              <div className="border-t border-gray-100 pt-6">
                <Skeleton className="h-6 w-32 mb-4" />
                
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* زر الرجوع - Skeleton */}
            <Skeleton className="w-full h-14 rounded-xl" />
          </div>

          {/* العمود الثاني: التقويم والأوقات - Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* صف التقويم والأوقات - Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* كارد التقويم - Skeleton */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="w-9 h-9 rounded-full" />
                  </div>
                </div>

                {/* شبكة أيام الأسبوع - Skeleton */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {[...Array(7)].map((_, index) => (
                    <Skeleton key={index} className="h-10 rounded-lg" />
                  ))}
                </div>

                {/* شبكة الأيام - Skeleton */}
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(35)].map((_, index) => (
                    <Skeleton key={index} className="h-12 rounded-lg" />
                  ))}
                </div>

                {/* المنطقة الزمنية - Skeleton */}
                <div className="mt-8">
                  <Skeleton className="h-5 w-28 mb-3" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </div>
              </div>

              {/* كارد الأوقات المتاحة - Skeleton */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <Skeleton className="h-7 w-32 mb-6" />

                <div className="space-y-8">
                  {[...Array(3)].map((_, periodIndex) => (
                    <div key={periodIndex}>
                      <Skeleton className="h-6 w-24 mb-4" />
                      <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, timeIndex) => (
                          <Skeleton key={timeIndex} className="h-12 rounded-xl" />
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* ملاحظة - Skeleton */}
                  <div className="pt-4 border-t border-gray-100">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* زر الحجز - Skeleton */}
            <Skeleton className="w-full h-16 rounded-xl" />

            {/* معلومات إضافية - Skeleton */}
            <div className="text-center">
              <Skeleton className="h-4 w-80 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
