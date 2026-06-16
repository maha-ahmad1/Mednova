

"use client";

import Image from "next/image";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 100, height = 100, className }: LogoProps) {
  const { push } = useNavigationLoader();

  const handleClick = () => {
    push("/");
  };

  return (
    <div className={className} onClick={handleClick}>
      <Image
        src="/images/auth/mednova-logo.png"
        alt="Mednova Logo"
        width={width}
        height={height}
        priority
        className="cursor-pointer"
      />
    </div>
  );
}