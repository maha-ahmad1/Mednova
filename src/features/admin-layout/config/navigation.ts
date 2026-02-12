import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ChartNoAxesCombined,
  Cpu,
  Landmark,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

export interface AdminSidebarSubItem {
  label: string;
  href: string;
  badge?: string;
}

export interface AdminSidebarGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: AdminSidebarSubItem[];
}

export interface AdminSidebarAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminSidebarGroups: AdminSidebarGroup[] = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    icon: ChartNoAxesCombined,
    items: [
      { label: "نظرة عامة", href: "/admin/users" },
      { label: "الإحصائيات", href: "/admin/users/stats" },
    ],
  },
  {
    id: "users-management",
    label: "إدارة المستخدمين",
    icon: Users,
    items: [
      { label: "جميع المستخدمين", href: "/admin/users" },
      { label: "المرضى", href: "/admin/users/patients" },
      { label: "المختصون", href: "/admin/users/specialists" },
      { label: "المراكز", href: "/admin/users/centers" },
      { label: "طلبات معلقة", href: "/admin/users/pending-requests", badge: "8" },
    ],
  },
  {
    id: "finance",
    label: "المالية",
    icon: Landmark,
    items: [
      { label: "المعاملات", href: "/admin/users/finance/transactions" },
      { label: "المحافظ", href: "/admin/users/finance/wallets" },
      { label: "المدفوعات", href: "/admin/users/finance/payouts" },
      { label: "الإيرادات", href: "/admin/users/finance/revenue" },
    ],
  },
  {
    id: "hardware",
    label: "الأجهزة",
    icon: Cpu,
    items: [
      { label: "الأجهزة", href: "/admin/users/hardware/devices" },
      { label: "الأجهزة المخصصة", href: "/admin/users/hardware/assigned" },
      { label: "حالة الأجهزة", href: "/admin/users/hardware/status" },
    ],
  },
  {
    id: "reports",
    label: "التقارير",
    icon: BarChart3,
    items: [
      { label: "تحليلات الاستخدام", href: "/admin/users/reports/usage-analytics" },
      { label: "مؤشرات النمو", href: "/admin/users/reports/growth-metrics" },
    ],
  },
  {
    id: "system-settings",
    label: "إعدادات النظام",
    icon: Settings,
    items: [
      { label: "إعدادات المنصة", href: "/admin/users/settings/platform" },
      { label: "الأدوار والصلاحيات", href: "/admin/users/settings/roles" },
      { label: "الإشعارات", href: "/admin/users/settings/notifications" },
      { label: "نسبة العمولة", href: "/admin/users/settings/commission-rate" },
    ],
  },
];

export const adminSidebarLogoutAction: AdminSidebarAction = {
  label: "تسجيل الخروج",
  href: "/login",
  icon: LogOut,
};
