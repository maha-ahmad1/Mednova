"use client";

import Image from "next/image";
import { Star, Heart, Eye, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Program } from "@/features/programs/types/program";

// export interface ProgramCardData {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   cover_image?: string;
//   image?: string;
//   ratings_avg_rating?: number;
//   ratings_count?: number;
//   enrollments_count?: number | null;
//   creator?: {
//     full_name: string;
//   };
//   status?: string;
//   is_approved?: number;
//   average_rating?: number;
//   total_reviews?: number;
// }


interface ProgramCardProps {
  program: Program;  // ✅ برنامج واحد
  variant?: "default" | "top-rated";
  showCreator?: boolean;
  showEnrollments?: boolean;
  showStatus?: boolean;
}

export function ProgramCard({
  program,
  variant = "default",
  showCreator = true,
  showEnrollments = true,
  showStatus = true,
}: ProgramCardProps) {
  const imageUrl = program.cover_image ||  "/images/home/Sports-rehabilitation.jpg";
  const rating = (program.ratings_avg_rating || 0) as number;
  const reviewsCount = program.ratings_count || 0;
  const price = program.price || 0;
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={program.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Rating */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {/* <span className="font-medium">{rating.toFixed(1)}</span> */}
            {reviewsCount > 0 && (
              <span className="text-xs opacity-80">({reviewsCount})</span>
            )}
          </div>
        </div>

        {/* Status Badge or Top Rated Badge */}
        {variant === "top-rated" ? (
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 backdrop-blur-sm text-[#32A88D] px-3 py-1 rounded-full text-xs font-medium border border-[#32A88D]/20">
              الأكثر طلباً
            </Badge>
          </div>
        ) : showStatus && program.status === "published" && program.is_approved === 1 && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              متاح
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 truncate">
            {program.title}
          </h3>
          {/* <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </Button> */}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {program.description}
        </p>

        {/* Creator Info - Optional */}
        {showCreator && program.creator && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <div className="w-8 h-8 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-[#32A88D]" />
            </div>
            <span className="font-medium">{program.creator.full_name}</span>
          </div>
        )}

        {/* Enrollments Count - Optional */}
        {showEnrollments && program.enrollments_count !== null && program.enrollments_count !== undefined && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>{program.enrollments_count} شخص مسجل</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[#32A88D]">
              {price} ر.ع.
            </div>
          </div>

          <Link href={`/programs/${program.id}`}>
            <Button className="cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Eye className="ml-2 w-4 h-4" />
              {/* {variant === "top-rated" ? "طلب البرنامج" : "عرض التفاصيل"} */}
             عرض التفاصيل 
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}