// Skeleton/ProgramDetailSkeleton.tsx
"use client"

export function ProgramDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="rounded-3xl bg-gray-200/80 border border-gray-100 shadow-lg overflow-hidden mb-8">
          <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <div className="h-10 w-32 bg-gray-300 rounded-full"></div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
                <div className="h-6 w-28 bg-gray-300 rounded-full"></div>
              </div>
              <div className="h-10 w-3/4 bg-gray-300 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="aspect-[4/3] w-full bg-gray-300 rounded-3xl"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Content & Videos */}
          <div className="lg:col-span-2 space-y-8">
            {/* Content Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6"></div>
              
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="h-7 w-40 bg-gray-200 rounded-lg mb-6"></div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6"></div>
              
              {/* Selected Video Preview */}
              <div className="mb-8">
                <div className="relative aspect-video bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-7 w-3/4 bg-gray-200 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>

              {/* Video List */}
              <div className="space-y-3">
                <div className="h-7 w-56 bg-gray-200 rounded-lg mb-4"></div>
                
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-full p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-6 w-64 bg-gray-200 rounded"></div>
                          <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enrollment */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="mb-6">
                <div className="h-12 w-32 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>

              <div className="h-14 w-full bg-gray-200 rounded-xl mb-4"></div>
              
              <div className="flex gap-2">
                <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="h-7 w-40 bg-gray-200 rounded-lg mb-6"></div>
              
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
