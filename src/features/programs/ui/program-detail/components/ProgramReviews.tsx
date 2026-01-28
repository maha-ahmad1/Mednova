// "use client"

// import { Star } from "lucide-react"
// import type { ProgramDetail } from "@/features/programs/types/program"

// interface ProgramReviewsProps {
//   program: ProgramDetail
// }

// const sampleReviews = [
//   {
//     name: "سارة الحارثي",
//     time: "منذ أسبوع",
//     comment: "محتوى مرتب وواضح، وساعدني على فهم الخطوات بشكل عملي.",
//   },
//   {
//     name: "محمد العتيبي",
//     time: "منذ أسبوعين",
//     comment: "الشرح ممتاز والتمارين ساعدتني كثيرًا في التطبيق.",
//   },
//   {
//     name: "ليلى الزهراني",
//     time: "منذ 3 أسابيع",
//     comment: "تجربة غنية بالمعلومات، أحببت تنظيم الوحدات.",
//   },
// ]

// export function ProgramReviews({ program }: ProgramReviewsProps) {
//   const rating = Number(program.ratings_avg_rating) || 0
//   const reviewsCount = program.ratings_count || 0

//   return (
//     <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <h2 className="text-2xl font-bold text-gray-900">تقييمات ومراجعات المتدربين</h2>
//         <div className="flex items-center gap-2 rounded-full bg-[#1F6069]/10 px-4 py-2 text-sm text-[#1F6069]">
//           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//           <span className="font-semibold">{rating.toFixed(1) || "0.0"}</span>
//           <span className="text-xs text-gray-500">({reviewsCount} مراجعة)</span>
//         </div>
//       </div>

//       {reviewsCount > 0 ? (
//         <div className="grid gap-4 md:grid-cols-2">
//           {sampleReviews.map((review) => (
//             <div key={review.name} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-semibold text-gray-900">{review.name}</p>
//                   <p className="text-xs text-gray-500">{review.time}</p>
//                 </div>
//                 <div className="flex items-center gap-1 text-sm text-gray-700">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   {rating.toFixed(1)}
//                 </div>
//               </div>
//               <p className="mt-4 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-600">
//           لا توجد مراجعات حتى الآن. كن أول من يشارك رأيه بعد إتمام البرنامج.
//         </div>
//       )}
//     </section>
//   )
// }
