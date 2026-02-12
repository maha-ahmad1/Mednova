import type { LucideIcon } from "lucide-react";
import {
  ChartNoAxesCombined,
  Users,
  UserRound,
  Stethoscope,
  Building2,
  UserRoundCheck,
  Landmark,
  Wallet,
  HandCoins,
  TrendingUp,
  Cpu,
  MonitorSmartphone,
  Activity,
  BarChart3,
  LineChart,
  Settings,
  ShieldCheck,
  Bell,
  Percent,
  LogOut,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const adminNavigation: AdminNavGroup[] = [
  {
    title: "لوحة التحكم",
    items: [{ label: "نظرة عامة", href: "/admin", icon: ChartNoAxesCombined }],
  },
  {
    title: "إدارة المستخدمين",
    items: [
      { label: "جميع المستخدمين", href: "/admin/users", icon: Users },
      { label: "المرضى", href: "/admin/users/patients", icon: UserRound },
      { label: "المختصون", href: "/admin/users/specialists", icon: Stethoscope },
      { label: "المراكز", href: "/admin/users/centers", icon: Building2 },
      { label: "طلبات معلقة", href: "/admin/users/pending-requests", icon: UserRoundCheck, badge: "8" },
    ],
  },
  {
    title: "المالية",
    items: [
      { label: "المعاملات", href: "/admin/finance/transactions", icon: Landmark },
      { label: "المحافظ", href: "/admin/finance/wallets", icon: Wallet },
      { label: "المدفوعات", href: "/admin/finance/payouts", icon: HandCoins },
      { label: "الإيرادات", href: "/admin/finance/revenue", icon: TrendingUp },
    ],
  },
  {
    title: "الأجهزة",
    items: [
      { label: "الأجهزة", href: "/admin/hardware/devices", icon: Cpu },
      { label: "الأجهزة المخصصة", href: "/admin/hardware/assigned", icon: MonitorSmartphone },
      { label: "حالة الأجهزة", href: "/admin/hardware/status", icon: Activity },
    ],
  },
  {
    title: "التقارير",
    items: [
      { label: "تحليلات الاستخدام", href: "/admin/reports/usage-analytics", icon: BarChart3 },
      { label: "مؤشرات النمو", href: "/admin/reports/growth-metrics", icon: LineChart },
    ],
  },
  {
    title: "إعدادات النظام",
    items: [
      { label: "إعدادات المنصة", href: "/admin/settings/platform", icon: Settings },
      { label: "الأدوار والصلاحيات", href: "/admin/settings/roles", icon: ShieldCheck },
      { label: "الإشعارات", href: "/admin/settings/notifications", icon: Bell },
      { label: "نسبة العمولة", href: "/admin/settings/commission-rate", icon: Percent },
    ],
  },
];

export const adminLogoutItem: AdminNavItem = {
  label: "تسجيل الخروج",
  href: "/login",
  icon: LogOut,
};
