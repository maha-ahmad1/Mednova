"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarIcon } from "lucide-react";

interface Props {
  onClick: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
}

export default function BookingButton({ onClick, disabled, isSubmitting }: Props) {
  return (
    <div>
      <Button onClick={onClick} disabled={!!disabled} className="cursor-pointer w-full bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl py-6 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span>جاري الحجز...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>تأكيد الحجز</span>
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </Button>
    </div>
  );
}
