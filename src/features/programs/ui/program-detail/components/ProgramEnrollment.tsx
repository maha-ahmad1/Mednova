"use client";

import { Button } from "@/components/ui/button";
import { Check, Heart, Share2 } from "lucide-react";
import type { ProgramDetail } from "@/features/programs/types/program";
import Image from "next/image";
interface ProgramEnrollmentProps {
  program: ProgramDetail;
}

export function ProgramEnrollment({ program }: ProgramEnrollmentProps) {
  return (
    <div id="program-enrollment" className="sticky top-8 space-y-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-1 text-3xl font-bold text-[#32A88D] mb-2">
            <span>{program.price}</span>
            <Image
              width={16}
              height={16}
              src="/images/Light22.svg"
              className="w-6 h-6 "
              alt="Light icon"
            />
          </div>

          <p className="text-sm text-gray-600">سعر البرنامج الكامل</p>
        </div>

        <Button className="w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl mb-3">
          اشترك الآن
        </Button>

        <p className="text-xs text-gray-500 text-center mb-4">
          ضمان استرداد خلال 30 يوماً • دفع آمن عبر Mednova
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl bg-transparent"
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl bg-transparent"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">ما ستحصل عليه</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">
              الوصول الكامل لجميع محتويات البرنامج
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">
              {program.videos.length} فيديو تعليمي
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">وصول مدى الحياة</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#32A88D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#32A88D]" />
            </div>
            <span className="text-gray-700">شهادة إتمام البرنامج</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
