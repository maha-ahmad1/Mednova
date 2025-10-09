import { HeroSection } from "@/features/auth/ui/HeroSection";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen ">
      <div className="h-full grid lg:grid-cols-2 items-stretch gap-0">
        <div className="flex flex-col items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md lg:max-w-lg ">
            
            <div className="flex mb-[-20]">
              <Image
                src="/images/auth/mednova-logo.png"
                alt="Mednova Logo"
                width={100}
                height={100}
              />
            </div>

            {children}
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroSection />
        </div>
      </div>
    </div>
  );
}
