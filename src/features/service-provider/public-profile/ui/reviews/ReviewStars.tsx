// import React from 'react';
// import { Star } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface ReviewStarsProps {
//   rating: number;
//   hoverRating: number;
//   onRatingChange: (rating: number) => void;
//   onHoverRatingChange: (rating: number) => void;
//   disabled?: boolean;
//   size?: 'sm' | 'md' | 'lg';
// }

// export const ReviewStars: React.FC<ReviewStarsProps> = ({
//   rating,
//   hoverRating,
//   onRatingChange,
//   onHoverRatingChange,
//   disabled = false,
//   size = 'md',
// }) => {
//   const sizes = {
//     sm: 'w-6 h-6',
//     md: 'w-8 h-8',
//     lg: 'w-10 h-10',
//   };

//   return (
//     <div className="flex gap-1">
//       {[...Array(5)].map((_, index) => {
//         const starValue = index + 1;
//         const isFilled = starValue <= (hoverRating || rating);

//         return (
//           <button
//             key={index}
//             type="button"
//             className={cn(
//               "p-1 focus:outline-none focus:ring-2 focus:ring-[#32A88D] focus:ring-offset-2 rounded-full",
//               disabled && "cursor-not-allowed opacity-50"
//             )}
//             onClick={() => !disabled && onRatingChange(starValue)}
//             onMouseEnter={() => !disabled && onHoverRatingChange(starValue)}
//             onMouseLeave={() => !disabled && onHoverRatingChange(0)}
//             disabled={disabled}
//             aria-label={`${starValue} نجمة`}
//           >
//             <Star
//               className={cn(
//                 sizes[size],
//                 "transition-all duration-200",
//                 isFilled
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "fill-gray-200 text-gray-200",
//                 !disabled && "hover:scale-110 active:scale-95"
//               )}
//             />
//           </button>
//         );
//       })}
//     </div>
//   );
// };