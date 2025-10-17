"use client";

import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 100, height = 100, className }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/images/auth/mednova-logo.png"
        alt="Mednova Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  );
}
