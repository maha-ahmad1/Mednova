import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PreFooterCta() {
  return (
    <section className="bg-[#1f7f6c] px-4 py-12 text-white md:px-10" dir="rtl">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">جاهز تبدأ رحلة التعافي؟</h2>
          <p className="mt-2 text-white/90">اختصر وقتك واحجز أول جلسة مع مختص مناسب لحالتك اليوم.</p>
        </div>
        <Button asChild className="rounded-xl bg-white text-[#1f7f6c] hover:bg-white/90">
          <Link href="/specialists">احجز جلستك الآن</Link>
        </Button>
      </div>
    </section>
  );
}
