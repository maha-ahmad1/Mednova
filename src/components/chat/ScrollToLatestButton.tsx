"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToLatestButtonProps {
  isVisible: boolean;
  onClick: () => void;
  label?: string;
}

export default function ScrollToLatestButton({
  isVisible,
  onClick,
  label = "آخر الرسائل",
}: ScrollToLatestButtonProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      size="sm"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full shadow-lg bg-[#32A88D] hover:bg-[#2a8a7a] text-white"
    >
      <ArrowDown className="w-4 h-4 ml-1" />
      {label}
    </Button>
  );
}
