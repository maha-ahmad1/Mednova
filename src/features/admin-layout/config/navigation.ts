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
    id: "programs-management",
    label: "إدارة البرامج",
    icon: BookOpen,
    items: [
      { label: "جميع البرامج", href: "/admin/programs" },
      { label: "البرامج المنشورة", href: "/admin/programs?status=published" },
      { label: "البرامج غير الموافق عليها", href: "/admin/programs?is_approved=0" },
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
