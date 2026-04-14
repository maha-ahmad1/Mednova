import { HeroSection } from "@/features/auth/ui/HeroSection";
import { Logo } from "@/shared/ui/components/Logo";
import { cn } from "@/lib/utils";
import { getLocale } from "next-intl/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen w-full bg-white">
      <div
        className={cn(
          "flex min-h-screen w-full flex-col items-stretch lg:flex-row",
          isArabic && "lg:flex-row-reverse"
        )}
      >
        <div className="relative z-10 flex w-full flex-col items-center justify-center p-4 lg:w-1/2 lg:p-8">
          <div className="w-full max-w-md lg:max-w-lg">
            <Logo />
            {children}
          </div>
        </div>

        <div className="relative hidden min-h-0 w-full lg:block lg:min-h-screen lg:w-1/2">
          <HeroSection />
        </div>
      </div>
    </div>
  );
}