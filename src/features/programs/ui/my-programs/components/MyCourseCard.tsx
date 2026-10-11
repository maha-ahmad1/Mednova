"use client";

import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { MyCourseItem } from "@/features/programs/types/myCourses";

interface MyCourseCardProps {
  course: MyCourseItem;
}

export function MyCourseCard({ course }: MyCourseCardProps) {
  const continueHref = course.last_video_id
    ? (`/programs/${course.program_id}?video=${course.last_video_id}` as const)
    : (`/programs/${course.program_id}` as const);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={course.cover_image || "/images/home/Sports-rehabilitation.jpg"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800">{course.title}</h3>
        <p className="mb-4 text-sm text-gray-600">{course.creator_name}</p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {course.videos_completed} من {course.videos_count} فيديو
            </span>
            <span className="font-semibold text-[#32A88D]">{course.progress_percent}%</span>
          </div>
          <Progress value={course.progress_percent} />

          <Button
            asChild
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white hover:from-[#2a8a7a] hover:to-[#32A88D]"
          >
            <Link href={continueHref}>
              <PlayCircle className="ms-2 h-4 w-4" />
              متابعة المشاهدة
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
