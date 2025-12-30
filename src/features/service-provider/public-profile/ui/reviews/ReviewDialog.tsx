


// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Star, X, Loader2, CheckCircle } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { ReviewStars } from './ReviewStars';

// interface ReviewDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   reviewerId: number;
//   revieweeId: number;
//   revieweeType: 'customer' | 'program' | 'platform';
//   revieweeName: string;
//   onSubmit: (rating: number, comment: string) => void;
//   isSubmitting?: boolean;
//   defaultRating?: number;
//   defaultComment?: string;
//   onClose?: () => void;
// }

// export const ReviewDialog: React.FC<ReviewDialogProps> = ({
//   open,
//   onOpenChange,
//   reviewerId,
//   revieweeId,
//   revieweeType,
//   revieweeName,
//   onSubmit,
//   isSubmitting = false,
//   defaultRating = 0,
//   defaultComment = '',
//   onClose,
// }) => {
//   const [rating, setRating] = useState(defaultRating);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [comment, setComment] = useState(defaultComment);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // إعادة تعيين الحقول عند فتح الـ Dialog
//   useEffect(() => {
//     if (open) {
//       setRating(defaultRating);
//       setComment(defaultComment);
//       setIsSubmitted(false);
//     }
//   }, [open, defaultRating, defaultComment]);

//   const resetForm = () => {
//     setRating(0);
//     setHoverRating(0);
//     setComment('');
//     setIsSubmitted(false);
//   };

//   const handleClose = () => {
//     if (!isSubmitting) {
//       onOpenChange(false);
//       if (!isSubmitted) {
//         resetForm();
//       }
//       onClose?.();
//     }
//   };

//   const handleSubmit = () => {
//     if (rating === 0) {
//       // يمكن استخدام toast هنا إذا كان متاحاً
//       return;
//     }

//     onSubmit(rating, comment);
//     setIsSubmitted(true);
    
//     // إغلاق الـ Dialog بعد 2 ثانية
//     setTimeout(() => {
//       handleClose();
//     }, 2000);
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md md:max-w-lg rounded-2xl">
//         <button
//           onClick={handleClose}
//           disabled={isSubmitting}
//           className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
//           aria-label="إغلاق"
//         >
//           <X className="w-5 h-5 text-gray-500" />
//         </button>

//         <DialogHeader className="text-center pt-8">
//           {isSubmitted ? (
//             <div className="space-y-4">
//               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                 <CheckCircle className="w-10 h-10 text-green-600" />
//               </div>
//               <DialogTitle className="text-2xl font-bold text-gray-800">
//                 شكراً لك!
//               </DialogTitle>
//               <DialogDescription className="text-lg text-gray-600">
//                 تم إرسال تقييمك بنجاح
//               </DialogDescription>
//             </div>
//           ) : (
//             <>
//               <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Star className="w-8 h-8 text-[#32A88D]" />
//               </div>
//               <DialogTitle className="text-2xl font-bold text-gray-800">
//                 اكتب تقييمك
//               </DialogTitle>
//               <DialogDescription className="text-gray-600">
//                 شاركنا تجربتك مع {revieweeName}
//               </DialogDescription>
//             </>
//           )}
//         </DialogHeader>

//         {!isSubmitted ? (
//           <>
//             <div className="py-6">
//               <div className="text-center mb-4">
//                 <p className="text-gray-700 font-medium mb-2">
//                   كيف تقيم تجربتك؟
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   اختر من 1 إلى 5 نجوم
//                 </p>
//               </div>

//               <div className="flex justify-center gap-1 mb-8">
//                 <ReviewStars
//                   rating={rating}
//                   hoverRating={hoverRating}
//                   onRatingChange={setRating}
//                   onHoverRatingChange={setHoverRating}
//                   disabled={isSubmitting}
//                   size="lg"
//                 />
//               </div>

//               {rating > 0 && (
//                 <div className="text-center">
//                   <p className="text-lg font-semibold text-[#32A88D]">
//                     {rating} من 5
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-4">
//               <label htmlFor="comment" className="text-gray-700 font-medium">
//                 شاركنا المزيد من التفاصيل
//               </label>
//               <Textarea
//                 id="comment"
//                 placeholder="اكتب تعليقك هنا... (اختياري)"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 disabled={isSubmitting}
//                 className="min-h-[120px] resize-none rounded-xl border-gray-300 focus:border-[#32A88D] focus:ring-[#32A88D]"
//               />
//               <p className="text-sm text-gray-500">
//                 مشاركة تجربتك تساعد الآخرين على اتخاذ قرار أفضل
//               </p>
//             </div>

//             <DialogFooter className="mt-6">
//               <Button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting || rating === 0}
//                 className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     <span>جاري الإرسال...</span>
//                   </div>
//                 ) : (
//                   'إرسال التقييم'
//                 )}
//               </Button>
//             </DialogFooter>
//           </>
//         ) : (
//           <div className="py-8 text-center">
//             <p className="text-gray-600 mb-6">
//               شكراً لمشاركتك رأيك معنا. تقييمك يساعدنا في تحسين خدماتنا.
//             </p>
//             <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
//               <p>سيتم إغلاق النافذة تلقائياً...</p>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };