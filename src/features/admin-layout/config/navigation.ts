import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ChartNoAxesCombined,
  Cpu,
  Landmark,
  LogOut,
  Settings,
  Users,
  BookOpen,
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
      { label: "نظرة عامة", href: "/control-panel/users" },
      { label: "الإحصائيات", href: "/control-panel/users/stats" },
    ],
  },
  {
    id: "users-management",
    label: "إدارة المستخدمين",
    icon: Users,
    items: [
      { label: "جميع المستخدمين", href: "/control-panel/users" },
      { label: "المرضى", href: "/control-panel/users/patients" },
      { label: "المختصون", href: "/control-panel/users/specialists" },
      { label: "المشتركون", href: "/control-panel/subscriptions" },
      { label: "المراكز", href: "/control-panel/users/centers" },
      { label: "طلبات معلقة", href: "/control-panel/users/pending-requests", badge: "8" },
    ],
  },
  {
    id: "programs-management",
    label: "إدارة البرامج",
    icon: BookOpen,
    items: [
      { label: "جميع البرامج", href: "/control-panel/programs" },
      // { label: "البرامج المنشورة", href: "/control-panel/programs?status=published" },
      // { label: "البرامج غير الموافق عليها", href: "/control-panel/programs?is_approved=0" },
    ],
  },
  {
    id: "finance",
    label: "المالية",
    icon: Landmark,
    items: [
      { label: "المعاملات", href: "/coming-soon" },
      { label: "المحافظ", href: "/coming-soon" },
      { label: "المدفوعات", href: "/coming-soon" },
      { label: "الإيرادات", href: "/coming-soon" },
    ],
  },
  {
    id: "hardware",
    label: "الأجهزة",
    icon: Cpu,
    items: [
      { label: "الأجهزة", href: "/coming-soon" },
      { label: "الأجهزة المخصصة", href: "/coming-soon" },
      { label: "حالة الأجهزة", href: "/coming-soon" },
    ],
  },
  {
    id: "reports",
    label: "التقارير",
    icon: BarChart3,
    items: [
      { label: "تحليلات الاستخدام", href: "/coming-soon" },
      { label: "مؤشرات النمو", href: "/coming-soon" },
    ],
  },
  {
    id: "system-settings",
    label: "إعدادات النظام",
    icon: Settings,
    items: [
      { label: "إعدادات المنصة", href: "/coming-soon" },
      { label: "الأدوار والصلاحيات", href: "/coming-soon" },
      { label: "الإشعارات", href: "/coming-soon" },
      { label: "نسبة العمولة", href: "/coming-soon" },
    ],
  },
];

export const adminSidebarLogoutAction: AdminSidebarAction = {
  label: "تسجيل الخروج",
  href: "/login",
  icon: LogOut,
};
