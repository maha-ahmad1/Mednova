import { Skeleton } from "@/components/ui/skeleton";

export default function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* عنوان الصفحة - Skeleton */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 px-2">
          <Skeleton className="inline-flex h-8 w-32 rounded-full mb-3 sm:mb-4" />
          <Skeleton className="h-9 sm:h-10 md:h-11 w-72 sm:w-80 md:w-96 mx-auto mb-3 sm:mb-4" />
          <Skeleton className="h-5 sm:h-6 w-64 sm:w-72 md:w-80 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* العمود الأول: معلومات المختص/المركز - Skeleton */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* بطاقة المعلومات - Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 sm:mb-4" />
                <Skeleton className="h-7 sm:h-8 w-40 sm:w-48 mb-2" />
                <Skeleton className="h-4 sm:h-5 w-32 sm:w-40 mb-3 sm:mb-4" />
                
                {/* العنوان - Skeleton */}
                <div className="flex items-center gap-2 mt-3 sm:mt-4">
                  <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              {/* معلومات الحجز - Skeleton */}
              <div className="border-t border-gray-100 pt-4 sm:pt-6">
                <Skeleton className="h-6 sm:h-7 w-32 mb-3 sm:mb-4" />
                
                <div className="space-y-3 sm:space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between gap-2">
                      <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
                      <Skeleton className="h-6 sm:h-7 w-24 sm:w-28 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* زر الرجوع - Skeleton */}
            <Skeleton className="w-full h-12 sm:h-14 rounded-xl" />
          </div>

          {/* العمود الثاني: التقويم والأوقات - Skeleton */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            {/* كارد التقويم والأوقات - Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
                {/* قسم التقويم - Skeleton */}
                <div className="p-4 sm:p-6 order-1 xl:order-1">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded" />
                      <Skeleton className="h-6 sm:h-7 w-32" />
                    </div>
                  </div>

                  {/* التقويم - Skeleton */}
                  <div className="mb-4 sm:mb-6 w-full max-w-[350px] mx-auto">
                    <div className="space-y-4">
                      {/* أيام الأسبوع - Skeleton */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {[...Array(7)].map((_, i) => (
                          <Skeleton key={`weekday-${i}`} className="h-8 rounded-lg" />
                        ))}
                      </div>
                      
                      {/* الأيام - Skeleton */}
                      <div className="grid grid-cols-7 gap-1">
                        {[...Array(35)].map((_, i) => (
                          <Skeleton key={`day-${i}`} className="h-10 sm:h-11 rounded-lg" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* المنطقة الزمنية - Skeleton */}
                  <div className="mt-4 sm:mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                    
                    <Skeleton className="w-full h-12 sm:h-14 rounded-xl" />
                    
                    {/* ملاحظة - Skeleton */}
                    <div className="mt-3 flex items-center gap-2">
                      <Skeleton className="w-3 h-3 rounded-full" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </div>

                {/* قسم الأوقات - Skeleton */}
                <div className="p-4 sm:p-6 order-2 xl:order-2">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded" />
                      <Skeleton className="h-6 sm:h-7 w-32" />
                    </div>
                  </div>

                  {/* الأوقات المتاحة - Skeleton */}
                  <div className="space-y-6 sm:space-y-8  overflow-y-auto pr-1 sm:pr-2 custom-scrollbar pt-4">
                    {[...Array(3)].map((_, periodIndex) => (
                      <div key={`period-${periodIndex}`} className="mb-6">
                        <Skeleton className="h-5 sm:h-6 w-24 mb-3" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {[...Array(6)].map((_, timeIndex) => (
                            <Skeleton 
                              key={`time-${periodIndex}-${timeIndex}`} 
                              className="h-10 sm:h-12 rounded-lg" 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* زر تأكيد الحجز - Skeleton */}
            <div>
              <Skeleton className="w-full h-14 sm:h-16 rounded-xl" />
              
              {/* رسالة التوجيه - Skeleton */}
              <div className="mt-3 sm:mt-4 text-center">
                <Skeleton className="h-4 w-64 sm:w-72 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}