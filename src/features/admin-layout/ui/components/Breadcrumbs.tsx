"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
  admin: "لوحة التحكم",
  users: "المستخدمون",
  patients: "المرضى",
  specialists: "المختصون",
  centers: "المراكز",
  "pending-requests": "طلبات معلقة",
  stats: "الإحصائيات",
  finance: "المالية",
  transactions: "المعاملات",
  wallets: "المحافظ",
  payouts: "المدفوعات",
  revenue: "الإيرادات",
  hardware: "الأجهزة",
  devices: "الأجهزة",
  assigned: "الأجهزة المخصصة",
  status: "حالة الأجهزة",
  reports: "التقارير",
  "usage-analytics": "تحليلات الاستخدام",
  "growth-metrics": "مؤشرات النمو",
  settings: "إعدادات النظام",
  platform: "إعدادات المنصة",
  roles: "الأدوار والصلاحيات",
  notifications: "الإشعارات",
  "commission-rate": "نسبة العمولة",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        href,
        label: segmentLabels[segment] ?? segment,
        isLast: index === segments.length - 1,
      };
    });
  }, [pathname]);

  return (
    <nav aria-label="المسار" className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {index > 0 ? <ChevronLeft className="h-3.5 w-3.5" /> : null}
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
