"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 100, height = 100, className }: LogoProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
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